/**
 * Jharkhand Tourism - Official Application Logic
 * Classic Expedition Gateway Unlock, 5 Collectible Stamps Passport & Route Intelligence
 * Focus: TOP 5 FAMOUS DESTINATIONS & IMMERSIVE TOURIST EXPEDITION
 */

// Global State for Explorer Passport
let unlockedDestinations = [];
let isSiteUnlocked = false;

document.addEventListener("DOMContentLoaded", () => {
  // 1. Load unlocked state from localStorage
  loadPassportProgress();

  // 2. Initialize the Classic Gateway Unlock
  initExpeditionVaultGateway();

  // 3. Initialize Navigation & Reading Progress
  initNavigation();
  initScrollProgressBar();

  // 4. Render 5 Famous Destinations
  renderFamousDestinations();
  renderDidYouKnowFacts();
  renderTravelThemes();

  // 5. Initialize Category Filters
  initCategoryFilters();

  // 6. Initialize Desktop Custom Cursor & 3D Card Tilt
  initCardCursorFollower();
  initCard3DTilt();

  // 7. Initialize Scroll Reveal Animations & Stat Counters
  initScrollReveals();
  initStatCounters();

  // 8. Initialize Leaflet Map
  if (typeof initJharkhandMap === "function") {
    initJharkhandMap();
  }

  // 9. Initialize Confetti Canvas
  initConfettiCanvas();

  // 10. Initialize Live Falling Leaves Particle System
  initFallingLeaves();

  // 11. Update UI Passport Badges
  updatePassportUI();
});

/* ==========================================================================
   1. CLASSIC EXPEDITION GATEWAY UNLOCK (REFINED, LESSER ANIMATION)
   ========================================================================== */
function initExpeditionVaultGateway() {
  const gateway = document.getElementById("expedition-vault-gateway");
  const sealBtn = document.getElementById("vault-seal-btn");
  if (!gateway || !sealBtn) return;

  // Check if previously unlocked in this session
  const alreadyUnlocked = sessionStorage.getItem("jharkhand_vault_unlocked");
  if (alreadyUnlocked === "true") {
    gateway.classList.add("unlocked");
    isSiteUnlocked = true;
    return;
  }

  // Unlock Trigger Click Handler
  sealBtn.addEventListener("click", () => {
    performClassicUnlock(gateway);
  });

  // Also unlock on Enter/Space keypress on the seal
  sealBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      performClassicUnlock(gateway);
    }
  });
}

function performClassicUnlock(gateway) {
  if (isSiteUnlocked) return;
  isSiteUnlocked = true;

  try {
    sessionStorage.setItem("jharkhand_vault_unlocked", "true");
  } catch (e) {}

  // Smooth, classic fade out
  gateway.classList.add("unlocked");

  // Show Gentle Initiation Toast
  setTimeout(() => {
    showInitiationUnlockToast();
  }, 600);
}

function showInitiationUnlockToast() {
  let toast = document.getElementById("unlock-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "unlock-toast";
    toast.className = "unlock-toast";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="unlock-toast-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
    </div>
    <div>
      <div class="unlock-toast-title">Welcome to Jharkhand</div>
      <div class="unlock-toast-place">Expedition Ready</div>
      <div class="unlock-toast-xp">Explore the Top 5 Wonders & Collect Passport Stamps!</div>
    </div>
  `;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4500);
}

/* ==========================================================================
   2. READING SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgressBar() {
  const progressBar = document.getElementById("scroll-progress-indicator");
  if (!progressBar) return;

  window.addEventListener("scroll", () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
  }, { passive: true });
}

/* ==========================================================================
   3. NAVIGATION CONTROLLER
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const mobileToggle = document.getElementById("mobile-nav-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-drawer-link");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }

    updateActiveNavLink();
  }, { passive: true });

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileDrawer.classList.contains("open");
      if (isOpen) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileDrawer();
      });
    });
  }

  function openMobileDrawer() {
    mobileDrawer.classList.add("open");
    mobileToggle.classList.add("open");
    mobileToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMobileDrawer() {
    mobileDrawer.classList.remove("open");
    mobileToggle.classList.remove("open");
    mobileToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const scrollPosition = window.scrollY + 200;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }
  });
}

/* ==========================================================================
   4. FAMOUS DESTINATION CARD CREATION & RENDERING (TOP 5)
   ========================================================================== */

function createFamousCardHtml(dest) {
  const isUnlocked = unlockedDestinations.includes(dest.id);
  const isScheduled = isDestinationScheduled(dest.id);
  const badgeHtml = isUnlocked
    ? `<span class="badge-famous badge-unlocked">Stamp Collected</span>`
    : `<span class="badge-famous">Explore to Collect Stamp</span>`;

  return `
    <article class="destination-card fade-up ${isUnlocked ? 'is-unlocked' : ''}" 
             data-category="${dest.category.toLowerCase()}" 
             data-id="${dest.id}" 
             onclick="openDestinationModal('${dest.id}')" 
             tabindex="0" 
             role="button" 
             aria-label="Explore ${dest.name}">
      <div class="card-media">
        <img src="${dest.thumbnail}" alt="${dest.name}" class="card-img" loading="lazy" />
        <div class="card-gradient"></div>
      </div>

      <div class="card-top-meta">
        ${badgeHtml}
        <span class="card-district">${dest.district}</span>
      </div>

      <div class="card-body">
        <span class="card-category">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          ${dest.category}
        </span>
        <h3 class="card-title">${dest.name}</h3>
        <p class="card-tagline">${dest.tagline}</p>
        
        <div class="card-cta-row">
          <button class="btn-card-scheduler ${isScheduled ? 'added' : ''}" 
                  onclick="event.stopPropagation(); addToScheduler('${dest.id}', this);" 
                  title="Add to shared team scheduler"
                  aria-label="Add ${dest.name} to Scheduler">
            <span>${isScheduled ? '✓ Added to Scheduler' : 'Add to Scheduler +'}</span>
          </button>

          <div class="card-cta-actions">
            <span class="card-explore-btn">
              ${isUnlocked ? 'Passport Stamp' : 'Explore'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>

            <button class="card-map-action" title="View on Map" onclick="event.stopPropagation(); focusDestinationOnMap('${dest.id}');" aria-label="View ${dest.name} on map">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

/* ==========================================================================
   SHARED TRIP SCHEDULER MODULE: COLLECTION MANAGEMENT & METADATA PRESERVATION
   ========================================================================== */
function getFamousUserTripKey() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("sb-") && k.endsWith("-auth-token")) {
        const d = JSON.parse(localStorage.getItem(k));
        if (d && d.user && d.user.id) return "jharkhandTripPlan_" + d.user.id;
      }
    }
  } catch (e) {}
  return null;
}

function getSchedulerCollection() {
  const userKey = getFamousUserTripKey();
  if (!userKey) return [];
  try {
    let raw = localStorage.getItem(userKey);
    if (!raw) raw = localStorage.getItem("jharkhandTripPlan");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error accessing scheduler collection", e);
    return [];
  }
}

function saveSchedulerCollection(collection) {
  const userKey = getFamousUserTripKey();
  if (!userKey) return;
  try {
    const json = JSON.stringify(collection);
    localStorage.setItem(userKey, json);
    localStorage.setItem("jharkhandTripPlan", json);
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Error saving scheduler collection", e);
  }
}

function isDestinationScheduled(destId) {
  const collection = getSchedulerCollection();
  const cleanId = 'famous-' + destId;
  return collection.some((item) => item.id === cleanId || item.id === destId);
}

function addToScheduler(destId, btnElement) {
  const userKey = getFamousUserTripKey();
  if (!userKey) {
    if (confirm("Please log in or create an account to save places to your Trip Plan. Go to Sign In?")) {
      window.location.href = "../../../../../auth.html";
    }
    return;
  }
  // Find destination in FAMOUS_DESTINATIONS
  let dest = null;
  if (typeof FAMOUS_DESTINATIONS !== "undefined") {
    dest = FAMOUS_DESTINATIONS.find((d) => d.id === destId);
  }

  if (!dest) {
    dest = {
      id: destId,
      name: destId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      district: "Jharkhand",
      thumbnail: "",
      category: "Famous Place",
      tagline: "Top 5 Famous Destination in Jharkhand"
    };
  }

  const collection = getSchedulerCollection();
  const cleanId = 'famous-' + dest.id;

  // Prevent duplicate additions
  const alreadyExists = collection.some((item) =>
    item.id === cleanId || item.id === dest.id
  );

  if (!alreadyExists) {
    const scheduleItem = {
      id: cleanId,
      name: dest.name,
      module: "famous",
      category: dest.category || "Top 5 Famous Place",
      location: (dest.district ? dest.district + ", Jharkhand" : "Jharkhand"),
      image: dest.thumbnail || dest.heroImage || dest.image || "",
      description: dest.tagline || dest.description || "One of Jharkhand's iconic wonders.",
      link: "Bhavish_Underrated_test/antigravity/scratch/jharkhand-tourism/index.html#famous-destinations",
      addedAt: new Date().toISOString()
    };

    collection.push(scheduleItem);
    saveSchedulerCollection(collection);
    showFamousToast(`✓ Added to My Trip Plan: ${dest.name}`);
  } else {
    showFamousToast(`Already in My Trip Plan: ${dest.name}`);
  }

  // Update button state cleanly
  if (btnElement) {
    btnElement.classList.add("added");
    btnElement.innerHTML = "<span>✓ Added to My Trip Plan</span>";
  }
}

function showFamousToast(msg) {
  let toast = document.getElementById("famous-trip-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "famous-trip-toast";
    toast.style.cssText = "position:fixed;bottom:24px;right:24px;z-index:999999;padding:12px 20px;border-radius:16px;background:#163B27;color:#F8FAF4;font-size:13px;font-weight:600;box-shadow:0 12px 30px rgba(22,59,39,0.3);display:flex;align-items:center;gap:8px;border:1px solid rgba(76,154,69,0.4);transition:all 0.3s ease;transform:translateY(10px);opacity:0;";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>🌿</span><span>${msg}</span>`;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
  }, 2800);
}

function renderFamousDestinations() {
  const famousContainer = document.getElementById("famous-destinations-grid");
  if (!famousContainer || typeof FAMOUS_DESTINATIONS === "undefined") return;

  famousContainer.innerHTML = FAMOUS_DESTINATIONS.map((d) => createFamousCardHtml(d)).join("");
}

function renderDidYouKnowFacts() {
  const factsContainer = document.getElementById("facts-container");
  if (!factsContainer || typeof DID_YOU_KNOW_FACTS === "undefined") return;

  factsContainer.innerHTML = DID_YOU_KNOW_FACTS.map((fact) => `
    <div class="fact-card fade-up">
      <div class="fact-num">${fact.number}</div>
      <div class="fact-tag">${fact.tag}</div>
      <h3 class="fact-headline">${fact.headline}</h3>
      <p class="fact-body">${fact.body}</p>
    </div>
  `).join("");
}

function renderTravelThemes() {
  const themesContainer = document.getElementById("themes-grid");
  if (!themesContainer || typeof TRAVEL_THEMES === "undefined") return;

  themesContainer.innerHTML = TRAVEL_THEMES.map((theme) => `
    <div class="theme-card fade-up">
      <div class="theme-bg">
        <img src="${theme.image}" alt="${theme.title}" class="theme-img" loading="lazy" />
        <div class="theme-overlay"></div>
      </div>
      <div class="theme-content">
        <span class="theme-count">${theme.count}</span>
        <h3 class="theme-title">${theme.title}</h3>
        <p class="theme-sub">${theme.subtitle}</p>
      </div>
    </div>
  `).join("");
}

/* ==========================================================================
   5. CATEGORY FILTERS
   ========================================================================== */
function initCategoryFilters() {
  const filterChips = document.querySelectorAll(".filter-chip");

  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filterChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const selectedCategory = chip.dataset.category.toLowerCase();
      const destinationCards = document.querySelectorAll(".destination-card");

      destinationCards.forEach((card) => {
        const cardCat = card.dataset.category || "";
        if (selectedCategory === "all" || cardCat.includes(selectedCategory)) {
          card.style.display = "flex";
          setTimeout(() => {
            card.classList.add("in-view");
          }, 50);
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/* ==========================================================================
   6. 3D CARD TILT MICRO-INTERACTION (DESKTOP ONLY)
   ========================================================================== */
function initCard3DTilt() {
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!isFinePointer) return;

  document.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".destination-card");
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  document.addEventListener("mouseout", (e) => {
    const card = e.target.closest(".destination-card");
    if (card && !card.contains(e.relatedTarget)) {
      card.style.transform = "";
    }
  });
}

/* ==========================================================================
   7. DESKTOP CUSTOM CURSOR FOLLOWER FOR CARDS
   ========================================================================== */
function initCardCursorFollower() {
  const follower = document.getElementById("card-cursor-follower");
  if (!follower) return;

  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!isFinePointer) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let isHoveringCard = false;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const targetCard = e.target.closest(".destination-card, .theme-card");
    if (targetCard) {
      if (!isHoveringCard) {
        follower.classList.add("active");
        follower.textContent = "EXPLORE";
        isHoveringCard = true;
      }
    } else {
      if (isHoveringCard) {
        follower.classList.remove("active");
        isHoveringCard = false;
      }
    }
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;

    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) ${isHoveringCard ? 'scale(1)' : 'scale(0.5)'}`;
    requestAnimationFrame(animateFollower);
  }

  animateFollower();
}

/* ==========================================================================
   8. 5-STAMP PASSPORT SYSTEM & UNLOCK ENGINE (NO XP, CREATIVE RANK)
   ========================================================================== */

function loadPassportProgress() {
  try {
    const saved = localStorage.getItem("jharkhand_unlocked_places_5");
    if (saved) {
      unlockedDestinations = JSON.parse(saved);
    }
  } catch (err) {
    unlockedDestinations = [];
  }
}

function savePassportProgress() {
  try {
    localStorage.setItem("jharkhand_unlocked_places_5", JSON.stringify(unlockedDestinations));
  } catch (err) {}
  updatePassportUI();
}

function getExplorerRankTitle() {
  const count = unlockedDestinations.length;
  if (count === 0) return "Nomad";
  if (count === 1) return "Wanderer";
  if (count === 2) return "Pathfinder";
  if (count === 3) return "Trailblazer";
  if (count === 4) return "Plateau Pioneer";
  return "Master Voyager";
}

function unlockDestination(destinationId) {
  if (unlockedDestinations.includes(destinationId)) return;

  const destination = FAMOUS_DESTINATIONS.find((d) => d.id === destinationId);
  if (!destination) return;

  unlockedDestinations.push(destinationId);
  savePassportProgress();

  // 1. Show Limited, Subtle Celebration Confetti
  triggerUnlockConfetti();

  // 2. Show Celebration Toast Notification (No XP)
  showUnlockToast(destination);

  // 3. Update Card Visual
  const card = document.querySelector(`.destination-card[data-id="${destinationId}"]`);
  if (card) {
    card.classList.add("is-unlocked");
    const badgeContainer = card.querySelector(".badge-famous");
    if (badgeContainer) {
      badgeContainer.outerHTML = `<span class="badge-famous badge-unlocked">Stamp Collected</span>`;
    }
    const exploreBtn = card.querySelector(".card-explore-btn");
    if (exploreBtn) {
      exploreBtn.innerHTML = `View Passport Stamp <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
    }
  }

  // If all 5 collected, show completion note
  if (unlockedDestinations.length === FAMOUS_DESTINATIONS.length) {
    setTimeout(() => {
      triggerUnlockConfetti();
    }, 1200);
  }
}

function showUnlockToast(dest) {
  let toast = document.getElementById("unlock-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "unlock-toast";
    toast.className = "unlock-toast";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="unlock-toast-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    </div>
    <div>
      <div class="unlock-toast-title">Stamp Collected: ${dest.stampTitle || 'OFFICIAL STAMP'}</div>
      <div class="unlock-toast-place">${dest.name} (${dest.district})</div>
      <div class="unlock-toast-xp">Passport Stamp Unlocked (${unlockedDestinations.length}/${FAMOUS_DESTINATIONS.length})</div>
    </div>
  `;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

function updatePassportUI() {
  const countSpan = document.getElementById("passport-count-badge");
  if (countSpan) {
    countSpan.textContent = `${unlockedDestinations.length}/${FAMOUS_DESTINATIONS.length} Stamps`;
  }
}

function openPassportModal() {
  const modalBackdrop = document.getElementById("passport-modal-backdrop");
  const stampsGrid = document.getElementById("passport-stamps-grid");
  const rankElem = document.getElementById("passport-user-rank");
  const levelElem = document.getElementById("passport-level-pill");
  if (!modalBackdrop || !stampsGrid) return;

  if (rankElem) rankElem.textContent = getExplorerRankTitle();
  if (levelElem) levelElem.textContent = `${unlockedDestinations.length}/${FAMOUS_DESTINATIONS.length} Stamps Collected`;

  stampsGrid.innerHTML = FAMOUS_DESTINATIONS.map((dest) => {
    const isUnlocked = unlockedDestinations.includes(dest.id);
    if (isUnlocked) {
      return `
        <div class="passport-stamp-slot unlocked">
          <span class="stamp-seal-badge">${dest.stampTitle || 'OFFICIAL STAMP'}</span>
          <img src="${dest.thumbnail}" alt="${dest.name}" class="stamp-thumbnail-mini" />
          <h4 class="stamp-place-name">${dest.name}</h4>
          <p class="stamp-clue" style="color: #34D399;">${dest.category} • ${dest.district}</p>
          <button class="btn-primary" style="padding: 0.35rem 0.75rem; font-size: 0.7rem; margin-top: 0.5rem;" onclick="closePassportModal(); openDestinationModal('${dest.id}');">
            View Details
          </button>
        </div>
      `;
    } else {
      return `
        <div class="passport-stamp-slot">
          <div class="stamp-locked-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h4 class="stamp-place-name" style="opacity: 0.7;">${dest.name}</h4>
          <p class="stamp-clue">"${dest.unlockClue}"</p>
          <button class="btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.7rem; margin-top: 0.5rem;" onclick="closePassportModal(); openDestinationModal('${dest.id}');">
            Collect Stamp
          </button>
        </div>
      `;
    }
  }).join("");

  modalBackdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closePassportModal() {
  const modalBackdrop = document.getElementById("passport-modal-backdrop");
  if (modalBackdrop) {
    modalBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  }
}

window.openPassportModal = openPassportModal;
window.closePassportModal = closePassportModal;

/* ==========================================================================
   9. LIMITED, SUBTLE CONFETTI PARTICLES (REDUCED PARTY POPPERS)
   ========================================================================== */
let confettiCanvas, confettiCtx;
let confettiParticles = [];

function initConfettiCanvas() {
  confettiCanvas = document.getElementById("unlock-confetti-canvas");
  if (!confettiCanvas) {
    confettiCanvas = document.createElement("canvas");
    confettiCanvas.id = "unlock-confetti-canvas";
    document.body.appendChild(confettiCanvas);
  }
  confettiCtx = confettiCanvas.getContext("2d");

  function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
}

function triggerUnlockConfetti() {
  if (!confettiCtx) return;

  const colors = ["#C5A059", "#DFC27D", "#10B981", "#34D399", "#FFFFFF"];
  // Limited & restrained particle count (16 subtle particles)
  const particleCount = 16;

  for (let i = 0; i < particleCount; i++) {
    confettiParticles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 120,
      y: window.innerHeight * 0.4,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * -7 - 2,
      size: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 6,
      opacity: 0.9,
      gravity: 0.22
    });
  }

  if (confettiParticles.length === particleCount) {
    animateConfetti();
  }
}

function animateConfetti() {
  if (!confettiParticles.length) {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    return;
  }

  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.rotation += p.rotationSpeed;
    p.opacity -= 0.016;

    if (p.opacity <= 0 || p.y > window.innerHeight) {
      confettiParticles.splice(i, 1);
      continue;
    }

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rotation * Math.PI) / 180);
    confettiCtx.fillStyle = p.color;
    confettiCtx.globalAlpha = p.opacity;
    confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    confettiCtx.restore();
  }

  requestAnimationFrame(animateConfetti);
}

/* ==========================================================================
   10. FULL-SCREEN IMMERSIVE DESTINATION DETAILS MODAL
   ========================================================================== */
function openDestinationModal(destinationId) {
  unlockDestination(destinationId);

  const destination = FAMOUS_DESTINATIONS.find((d) => d.id === destinationId);
  if (!destination) return;

  const modalBackdrop = document.getElementById("destination-modal-backdrop");
  const modalContainer = document.getElementById("destination-modal-content");
  if (!modalBackdrop || !modalContainer) return;

  const gmapsNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination.coordinates.lat},${destination.coordinates.lng}&travelmode=driving`;

  modalContainer.innerHTML = `
    <div class="modal-hero">
      <img src="${destination.heroImage}" alt="${destination.name}" class="modal-hero-img" />
      <div class="modal-hero-overlay"></div>
      <div class="modal-hero-text">
        <div class="modal-badge-row">
          <span class="badge-famous badge-unlocked">Official Passport Stamp</span>
          <span class="card-district">${destination.district} District</span>
        </div>
        <h2 class="modal-title">${destination.name}</h2>
        <p class="modal-tagline">"${destination.tagline}"</p>
      </div>
    </div>

    <div class="modal-body">
      <div class="modal-grid-layout">
        <!-- Main Narrative Column -->
        <div class="modal-main-content">
          <h3 class="modal-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            About This Wonder
          </h3>
          <p class="modal-main-desc">${destination.description}</p>

          <h3 class="modal-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            Key Highlights
          </h3>
          <ul class="modal-highlights-list">
            ${destination.highlights.map((h) => `
              <li class="modal-highlight-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>${h}</span>
              </li>
            `).join("")}
          </ul>
        </div>

        <!-- Quick Facts Sidebar -->
        <div class="modal-sidebar-card">
          <div class="modal-info-row">
            <span class="info-label">Category</span>
            <span class="info-val">${destination.category}</span>
          </div>
          <div class="modal-info-row">
            <span class="info-label">Location</span>
            <span class="info-val">${destination.location}</span>
          </div>
          <div class="modal-info-row">
            <span class="info-label">Elevation</span>
            <span class="info-val">${destination.elevation}</span>
          </div>
          <div class="modal-info-row">
            <span class="info-label">Best Season</span>
            <span class="info-val">${destination.bestTimeToVisit}</span>
          </div>
          <div class="modal-info-row">
            <span class="info-label">Visiting Hours</span>
            <span class="info-val">${destination.timings}</span>
          </div>
          <div class="modal-info-row">
            <span class="info-label">Entry Ticket</span>
            <span class="info-val">${destination.entryFee}</span>
          </div>
        </div>
      </div>

      <!-- Safety Information Section (Precaution & Major Warning) -->
      <div>
        <h3 class="modal-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          Visitor Safety & Advisory
        </h3>
        <div class="safety-cards-container">
          <!-- Precaution Card -->
          <div class="safety-card-precaution">
            <div class="safety-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              PRECAUTION
            </div>
            <p class="safety-body">${destination.safety.precaution}</p>
          </div>

          <!-- Major Safety Warning Card -->
          <div class="safety-card-warning">
            <div class="safety-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              MAJOR SAFETY WARNING
            </div>
            <p class="safety-body">${destination.safety.majorWarning}</p>
          </div>
        </div>
      </div>

      <!-- How to Reach Transit Box -->
      <div class="transit-box">
        <h4 class="transit-title" style="margin-bottom: 1rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
          How to Reach
        </h4>
        <div class="transit-grid">
          <div class="transit-item">
            <span class="transit-title">By Air</span>
            <span class="transit-desc">${destination.howToReach.byAir}</span>
          </div>
          <div class="transit-item">
            <span class="transit-title">By Train</span>
            <span class="transit-desc">${destination.howToReach.byTrain}</span>
          </div>
          <div class="transit-item">
            <span class="transit-title">By Road</span>
            <span class="transit-desc">${destination.howToReach.byRoad}</span>
          </div>
        </div>
      </div>

      <!-- Modal Footer Actions -->
      <div class="modal-footer-actions">
        <span class="coordinates-pill">
          GPS: ${destination.coordinates.lat.toFixed(4)}° N, ${destination.coordinates.lng.toFixed(4)}° E
        </span>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <a href="${gmapsNavUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
            <span>Google Maps ↗</span>
          </a>

          <button class="btn-primary" onclick="closeDestinationModal(); focusDestinationOnMap('${destination.id}');">
            <span>View on Interactive Map</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  modalBackdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDestinationModal() {
  const modalBackdrop = document.getElementById("destination-modal-backdrop");
  if (modalBackdrop) {
    modalBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeDestinationModal();
    closePassportModal();
  }
});

document.addEventListener("click", (e) => {
  const backdrop = document.getElementById("destination-modal-backdrop");
  if (backdrop && e.target === backdrop) {
    closeDestinationModal();
  }
  const passBackdrop = document.getElementById("passport-modal-backdrop");
  if (passBackdrop && e.target === passBackdrop) {
    closePassportModal();
  }
});

window.openDestinationModal = openDestinationModal;
window.closeDestinationModal = closeDestinationModal;

/* ==========================================================================
   11. STAT COUNTER ANIMATION
   ========================================================================== */
function initStatCounters() {
  const statNumbers = document.querySelectorAll(".stat-number[data-target]");
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute("data-target"));
        const suffix = el.getAttribute("data-suffix") || "";
        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(easeProgress * target);

          el.textContent = currentVal.toLocaleString() + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target.toLocaleString() + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach((num) => observer.observe(num));
}

/* ==========================================================================
   12. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll(".fade-up");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   13. LIVE FALLING LEAVES ENGINE (NATURE ECO-TOURISM THEME - SIDE CORRIDORS)
   ========================================================================== */
function initFallingLeaves() {
  const canvas = document.getElementById("falling-leaves-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  function updateDimensions() {
    canvas.width = window.innerWidth || document.documentElement.clientWidth || 1200;
    canvas.height = window.innerHeight || document.documentElement.clientHeight || 800;
  }
  updateDimensions();

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateDimensions, 100);
  });

  const leafColors = [
    "#4C9A45", // Leaf Green
    "#2F6B3C", // Forest Green
    "#3E8E41", // Rich Green
    "#62995B", // Sage Meadow
    "#52874B", // Pine Accent
    "#6FA867"  // Fresh Sprout
  ];

  // Fewer leaves (8 to 14 total) for a subtle, elegant ambiance
  const leafCount = Math.min(14, Math.max(8, Math.floor(window.innerWidth / 120)));
  const leaves = [];

  function createLeaf(initial = false) {
    const w = canvas.width || window.innerWidth || 1200;
    const h = canvas.height || window.innerHeight || 800;
    const size = Math.random() * 12 + 11; // 11px to 23px

    // Place leaves primarily on the left (0 - 20% width) or right (80% - 100% width)
    const isLeft = Math.random() < 0.5;
    let startX;
    if (isLeft) {
      startX = Math.random() * (w * 0.18); // Left corridor
    } else {
      startX = w * 0.82 + Math.random() * (w * 0.18); // Right corridor
    }

    return {
      x: startX,
      y: initial ? Math.random() * h : -30,
      size: size,
      isLeft: isLeft,
      speedY: Math.random() * 0.35 + 0.28, // Slower, graceful floating speed
      speedX: (Math.random() - 0.5) * 0.2, // Subtle horizontal drift
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.012 + 0.006, // Gentle sway
      swayWidth: Math.random() * 1.2 + 0.6,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.015,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.012 + 0.006,
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
      opacity: Math.random() * 0.3 + 0.55 // Soft, clear visibility
    };
  }

  for (let i = 0; i < leafCount; i++) {
    leaves.push(createLeaf(true));
  }

  function drawLeaf(leaf) {
    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate(leaf.angle);
    ctx.scale(Math.cos(leaf.flip), 1);
    ctx.fillStyle = leaf.color;
    ctx.globalAlpha = leaf.opacity;

    // Organic Leaf Shape
    ctx.beginPath();
    ctx.moveTo(0, -leaf.size / 2);
    ctx.bezierCurveTo(leaf.size / 2, -leaf.size / 3.2, leaf.size / 2, leaf.size / 3.2, 0, leaf.size / 2);
    ctx.bezierCurveTo(-leaf.size / 2, leaf.size / 3.2, -leaf.size / 2, -leaf.size / 3.2, 0, -leaf.size / 2);
    ctx.fill();

    // Leaf Center Spine Vein
    ctx.strokeStyle = "rgba(18, 48, 30, 0.35)";
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(0, -leaf.size / 2);
    ctx.lineTo(0, leaf.size / 2);
    ctx.stroke();

    ctx.restore();
  }

  function renderLeaves() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < leaves.length; i++) {
      const leaf = leaves[i];
      leaf.sway += leaf.swaySpeed;
      leaf.x += Math.sin(leaf.sway) * leaf.swayWidth + leaf.speedX;
      leaf.y += leaf.speedY;
      leaf.angle += leaf.angleSpeed;
      leaf.flip += leaf.flipSpeed;

      // Keep leaves within their respective side corridors (don't drift into center)
      if (leaf.isLeft && leaf.x > w * 0.22) {
        leaf.speedX = -Math.abs(leaf.speedX);
      } else if (!leaf.isLeft && leaf.x < w * 0.78) {
        leaf.speedX = Math.abs(leaf.speedX);
      }

      drawLeaf(leaf);

      // Recycle leaf when it passes bottom or edges
      if (leaf.y > h + 35) {
        leaves[i] = createLeaf(false);
      }
      if (leaf.x < -30) leaf.x = leaf.isLeft ? 10 : w - 20;
      if (leaf.x > w + 30) leaf.x = leaf.isLeft ? 20 : w - 10;
    }

    requestAnimationFrame(renderLeaves);
  }

  // Start live rendering
  requestAnimationFrame(renderLeaves);
}
