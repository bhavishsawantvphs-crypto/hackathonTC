// ============================================================
// FootprintJH — Supabase Client & Auth Logic
// Include this file on EVERY page that needs to know if a user
// is logged in (e.g. after the <script src="...supabase-js"> tag).
// ============================================================

// 1. FILL THESE IN from Supabase Dashboard → Project Settings → API
const SUPABASE_URL = "https://vzjcynucqpebxoczlzrc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_lUvfYB-aU86m1VmqN7vCwg_OoWgpe7I";

// 2. Create the client (requires the Supabase JS CDN script, see auth.html)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// SIGN UP — creates the user AND triggers Supabase's built-in
// confirmation email automatically (no extra email code needed —
// Supabase sends it as long as "Confirm email" is ON in
// Dashboard → Authentication → Providers → Email).
// ============================================================
async function signUpUser(email, password, fullName, phone) {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone || null
      },
      // Where the confirmation link sends the user back to.
      // Change this to your deployed domain, e.g. "https://footprintjh.com/auth.html"
      emailRedirectTo: window.location.origin + "/auth.html"
    }
  });

  if (error) {
    return { success: false, message: error.message };
  }

  // If email confirmation is required, Supabase returns a user
  // with no active session yet — that's expected.
  return {
    success: true,
    message: "Account created! Check your email to confirm your address before logging in.",
    data
  };
}

// ============================================================
// LOG IN — works from any PC/browser; Supabase looks the user
// up centrally, not locally, so the SAME account + data appears
// no matter which device they use.
// ============================================================
async function loginUser(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    // Common case: user hasn't clicked the confirmation link yet
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return { success: false, message: "Please confirm your email before logging in. Check your inbox." };
    }
    return { success: false, message: error.message };
  }

  return { success: true, message: "Logged in successfully.", data };
}

// ============================================================
// LOG OUT
// ============================================================
async function logoutUser() {
  const { error } = await supabaseClient.auth.signOut();
  return { success: !error, message: error ? error.message : "Logged out." };
}

// ============================================================
// RESEND CONFIRMATION EMAIL (in case the user missed it)
// ============================================================
async function resendConfirmation(email) {
  const { error } = await supabaseClient.auth.resend({
    type: "signup",
    email
  });
  return { success: !error, message: error ? error.message : "Confirmation email resent." };
}

// ============================================================
// GET CURRENT SESSION — call this on page load to check if
// someone is already logged in (works across devices because
// the session is validated against Supabase, not local storage alone).
// ============================================================
async function getCurrentUser() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  return session ? session.user : null;
}

// ============================================================
// FETCH / UPDATE PROFILE DATA (the extra info tied to a user)
// ============================================================
async function getProfile(userId) {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return { success: !error, data, message: error?.message };
}

async function updateProfile(userId, updates) {
  const { data, error } = await supabaseClient
    .from("profiles")
    .update(updates)
    .eq("id", userId);
  return { success: !error, data, message: error?.message };
}

// ============================================================
// LISTEN FOR AUTH STATE CHANGES (e.g. update navbar automatically)
// ============================================================
supabaseClient.auth.onAuthStateChange((event, session) => {
  document.dispatchEvent(
    new CustomEvent("footprintjh-auth-change", { detail: { event, session } })
  );
});
