// ============================================================
// FootprintJH — Supabase Client & Universal Auth Controller
// Handles user authentication, session persistence, reactive
// navbar state across all pages, and per-user storage helpers.
// ============================================================

const SUPABASE_URL = "https://vzjcynucqpebxoczlzrc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_lUvfYB-aU86m1VmqN7vCwg_OoWgpe7I";

let supabaseClient = null;

function getSupabaseClient() {
  if (!supabaseClient && typeof window !== "undefined" && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      console.warn("Error initializing Supabase client:", e);
    }
  }
  return supabaseClient;
}

// Immediately attempt initialization if Supabase CDN script loaded
if (typeof window !== "undefined" && window.supabase) {
  getSupabaseClient();
}

// ============================================================
// AUTHENTICATION HELPERS
// ============================================================

/**
 * Synchronously inspects localStorage for cached Supabase user session
 */
function getCachedUser() {
  try {
    if (typeof localStorage === "undefined") return null;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.user) return parsed.user;
        }
      }
    }
  } catch (e) {}
  return null;
}

/**
 * Returns the currently active user ID or null if Guest
 */
function getUserId() {
  const user = getCachedUser();
  return user ? user.id : null;
}

/**
 * Checks if user is authenticated
 */
function isLoggedIn() {
  return getUserId() !== null;
}

/**
 * Asynchronously gets the validated user session from Supabase
 */
async function getCurrentUser() {
  const client = getSupabaseClient();
  if (!client) return getCachedUser();
  try {
    const { data: { session }, error } = await client.auth.getSession();
    if (error || !session) return null;
    return session.user;
  } catch (e) {
    return getCachedUser();
  }
}

/**
 * User Sign Up
 */
async function signUpUser(email, password, fullName, phone) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: "Supabase library not loaded. Please refresh." };
  }

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || "Explorer",
        phone: phone || null
      },
      emailRedirectTo: window.location.origin + "/auth.html"
    }
  });

  if (error) {
    return { success: false, message: error.message };
  }

  // If email confirmation is disabled/auto-confirmed, session is returned immediately
  const hasSession = !!(data && data.session);

  return {
    success: true,
    message: hasSession
      ? "Account created and signed in successfully!"
      : "Account created! Please check your email to confirm your account.",
    data,
    hasSession
  };
}

/**
 * User Log In
 */
async function loginUser(email, password) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: "Supabase library not loaded. Please refresh." };
  }

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return { success: false, message: "Please confirm your email before logging in. Check your inbox." };
    }
    return { success: false, message: error.message };
  }

  // Trigger UI refresh
  updateNavbarAuthUI(data.user);

  return { success: true, message: "Logged in successfully.", data };
}

/**
 * User Log Out
 */
async function logoutUser() {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {
      console.warn("SignOut error:", e);
    }
  }

  // Clean local cached session tokens
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
        localStorage.removeItem(key);
      }
    }
  } catch (e) {}

  document.dispatchEvent(new CustomEvent("footprintjh-auth-change", { detail: { event: "SIGNED_OUT", session: null } }));
  updateNavbarAuthUI(null);

  // If on scheduler page or auth-dependent page, reload or refresh state
  if (window.location.pathname.includes("scheduler.html")) {
    window.location.reload();
  }

  return { success: true, message: "Logged out." };
}

/**
 * Resend Confirmation Email
 */
async function resendConfirmation(email) {
  const client = getSupabaseClient();
  if (!client) return { success: false, message: "Supabase client not available." };
  const { error } = await client.auth.resend({
    type: "signup",
    email
  });
  return { success: !error, message: error ? error.message : "Confirmation email resent." };
}

// ============================================================
// UNIVERSAL REACTIVE NAVBAR & HOME CTA AUTH UI SYNC
// ============================================================

function getUserDisplayName(user) {
  if (!user) return "Explorer";
  if (user.user_metadata && user.user_metadata.full_name) {
    return user.user_metadata.full_name;
  }
  if (user.email) {
    const localPart = user.email.split("@")[0];
    return localPart.charAt(0).toUpperCase() + localPart.slice(1);
  }
  return "Explorer";
}

function ensureAuthStyles() {
  if (document.getElementById("footprintjh-auth-styles")) return;
  const style = document.createElement("style");
  style.id = "footprintjh-auth-styles";
  style.textContent = `
    .fp-auth-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }
    .fp-auth-user-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: #163B27;
      border: 1px solid rgba(76, 154, 69, 0.45);
      color: #F8FAF4;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(22, 59, 39, 0.15);
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .fp-auth-user-btn:hover {
      background: #1F4D33;
      border-color: #4C9A45;
      transform: translateY(-1px);
    }
    .fp-auth-avatar {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #4C9A45;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 800;
    }
    .fp-auth-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 230px;
      background: #FFFFFF;
      border: 1px solid rgba(47, 107, 60, 0.18);
      border-radius: 16px;
      box-shadow: 0 16px 36px rgba(22, 59, 39, 0.16);
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      z-index: 999999;
      opacity: 0;
      visibility: hidden;
      transform: translateY(6px);
      transition: all 0.2s ease;
    }
    .fp-auth-wrap:hover .fp-auth-dropdown,
    .fp-auth-wrap.open .fp-auth-dropdown {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .fp-auth-dropdown-header {
      padding: 8px 10px 10px;
      border-bottom: 1px solid rgba(47, 107, 60, 0.1);
      margin-bottom: 4px;
    }
    .fp-auth-dropdown-name {
      font-size: 13px;
      font-weight: 700;
      color: #163B27;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .fp-auth-dropdown-email {
      font-size: 11px;
      color: #6E846F;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }
    .fp-auth-dropdown-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 10px;
      color: #163B27;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.15s, color 0.15s;
      cursor: pointer;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
    }
    .fp-auth-dropdown-item:hover {
      background: #E7F1E3;
      color: #2F6B3C;
    }
    .fp-auth-dropdown-item.logout {
      color: #991B1B;
      border-top: 1px solid rgba(217, 87, 87, 0.15);
      margin-top: 4px;
      padding-top: 10px;
      border-radius: 8px;
    }
    .fp-auth-dropdown-item.logout:hover {
      background: #FEE2E2;
      color: #7F1D1D;
    }
    .fp-auth-login-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: #4C9A45;
      color: #FFFFFF;
      text-decoration: none;
      font-size: 12px;
      font-weight: 700;
      box-shadow: 0 2px 6px rgba(76, 154, 69, 0.25);
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .fp-auth-login-btn:hover {
      background: #3D7F37;
      transform: translateY(-1px);
    }
  `;
  document.head.appendChild(style);
}

function updateNavbarAuthUI(user) {
  ensureAuthStyles();
  const activeUser = user !== undefined ? user : getCachedUser();

  const renderLoggedInHTML = (name, email) => {
    const initial = name ? name.charAt(0).toUpperCase() : "E";
    return `
      <div class="fp-auth-wrap" id="fp-user-menu-wrap">
        <button type="button" class="fp-auth-user-btn" onclick="this.parentElement.classList.toggle('open')" aria-label="User profile and menu">
          <span class="fp-auth-avatar">${initial}</span>
          <span style="max-width:110px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${name}</span>
          <span style="font-size:9px; opacity:0.8;">▼</span>
        </button>
        <div class="fp-auth-dropdown">
          <div class="fp-auth-dropdown-header">
            <div class="fp-auth-dropdown-name">${name}</div>
            <div class="fp-auth-dropdown-email">${email || ""}</div>
          </div>
          <a href="profile.html" class="fp-auth-dropdown-item">
            <span>👤</span>
            <span>My Profile</span>
          </a>
          <a href="scheduler.html" class="fp-auth-dropdown-item">
            <span>🗺️</span>
            <span>My Trip Plan</span>
          </a>
          <a href="feedback.html" class="fp-auth-dropdown-item">
            <span>💬</span>
            <span>Give Feedback</span>
          </a>
          <a href="jhar.html" class="fp-auth-dropdown-item">
            <span>📅</span>
            <span>Festival Calendar</span>
          </a>
          <button type="button" onclick="logoutUser()" class="fp-auth-dropdown-item logout">
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    `;
  };

  const renderGuestHTML = () => `
    <div class="fp-auth-wrap">
      <a href="feedback.html" style="font-size:12px; font-weight:600; color:#6E846F; text-decoration:none; margin-right:4px;" class="hidden sm:inline-block">
        Reviews
      </a>
      <a href="auth.html" class="fp-auth-login-btn">
        <span>Log In / Sign Up</span>
        <span>→</span>
      </a>
    </div>
  `;

  // 1. Update Navigation Bar Auth Container (id="nav-auth-container")
  const navAuthEl = document.getElementById("nav-auth-container");
  if (navAuthEl) {
    if (activeUser) {
      const name = getUserDisplayName(activeUser);
      navAuthEl.innerHTML = renderLoggedInHTML(name, activeUser.email);
    } else {
      navAuthEl.innerHTML = renderGuestHTML();
    }
  }

  // 2. Update Global Header in pages using .global-portal-badge (e.g. mining.html, jhar.html)
  const globalBadgeEl = document.querySelector(".global-portal-badge");
  if (globalBadgeEl && !document.getElementById("nav-auth-container")) {
    if (activeUser) {
      const name = getUserDisplayName(activeUser);
      globalBadgeEl.outerHTML = `<div id="nav-auth-container">${renderLoggedInHTML(name, activeUser.email)}</div>`;
    } else {
      globalBadgeEl.outerHTML = `<div id="nav-auth-container">${renderGuestHTML()}</div>`;
    }
  }

  // 3. Update Hero Section CTA on Home Page (home.html)
  const heroCtaContainer = document.getElementById("hero-cta-container");
  if (heroCtaContainer) {
    if (activeUser) {
      const name = getUserDisplayName(activeUser);
      heroCtaContainer.innerHTML = `
        <div class="space-y-4">
          <div class="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-[#E7F1E3] border border-[#4C9A45]/30 text-xs font-bold text-deepForest shadow-sm">
            <span class="text-base">🌿</span>
            <span>Welcome back, <strong class="text-leafGreen">${name}</strong>! Your explorer account is active.</span>
          </div>
          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <a href="index.html" class="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-leafGreen text-white font-bold hover:bg-leafGreenHover transition-all duration-300 shadow-lg shadow-leafGreen/25 text-sm group cursor-pointer">
              <span>Explore Destinations</span>
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a href="profile.html" class="inline-flex items-center space-x-2 px-5 py-3.5 rounded-2xl bg-white border border-[rgba(47,107,60,0.25)] text-deepForest font-bold hover:bg-[#E7F1E3] transition-all text-sm cursor-pointer shadow-sm">
              <span>👤 My Profile</span>
            </a>
            <a href="feedback.html" class="inline-flex items-center space-x-2 px-4 py-3.5 rounded-2xl bg-white border border-[rgba(47,107,60,0.25)] text-deepForest font-bold hover:bg-[#E7F1E3] transition-all text-sm cursor-pointer shadow-sm">
              <span>💬 Feedback</span>
            </a>
          </div>
        </div>
      `;
    } else {
      heroCtaContainer.innerHTML = `
        <div class="flex flex-wrap items-center justify-center lg:justify-start gap-3">
          <a href="auth.html" class="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-leafGreen text-white font-bold hover:bg-leafGreenHover transition-all duration-300 shadow-lg shadow-leafGreen/25 text-sm group cursor-pointer">
            <span>Log In / Sign Up</span>
            <span class="group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <a href="index.html" class="inline-flex items-center space-x-2 px-5 py-3.5 rounded-2xl bg-white border border-[rgba(47,107,60,0.25)] text-deepForest font-bold hover:bg-[#E7F1E3] transition-all text-sm cursor-pointer shadow-sm">
            <span>Explore as Guest</span>
            <span>→</span>
          </a>
        </div>
      `;
    }
  }
}

// Listen for Supabase Auth Events
const clientInstance = getSupabaseClient();
if (clientInstance) {
  clientInstance.auth.onAuthStateChange((event, session) => {
    const user = session ? session.user : null;
    document.dispatchEvent(
      new CustomEvent("footprintjh-auth-change", { detail: { event, session, user } })
    );
    updateNavbarAuthUI(user);
  });
}

// Check session on page load
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", async () => {
      updateNavbarAuthUI(getCachedUser());
      const user = await getCurrentUser();
      updateNavbarAuthUI(user);
    });
  } else {
    updateNavbarAuthUI(getCachedUser());
    getCurrentUser().then(user => updateNavbarAuthUI(user));
  }
}

// Global Exports
window.FootprintJH = window.FootprintJH || {};
window.FootprintJH.auth = {
  getSupabaseClient,
  getCurrentUser,
  getCachedUser,
  getUserId,
  isLoggedIn,
  signUpUser,
  loginUser,
  logoutUser,
  resendConfirmation,
  updateNavbarAuthUI
};
