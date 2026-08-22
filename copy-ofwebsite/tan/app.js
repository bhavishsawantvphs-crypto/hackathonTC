// Controller for Unexplored Jharkhand Destination Experience
// Botanical Forest & Earth Luxury Theme
// Handles card interactions, hover depth, live weather, details modal, and embedded Leaflet interactive map.

window.FootprintJH = window.FootprintJH || {};

window.FootprintJH.app = (function () {
  const { destinations, weather, distance } = window.FootprintJH;

  const state = {
    weatherData: {}, // id -> { temp, desc, icon }
    activeCardId: "burudih-lake" // default focused center card
  };

  // Leaflet Map state
  let leafletMap = null;
  let mainMarker = null;
  let nearbyMarkers = [];

  // DOM references
  let elCardsDeck = null;
  
  // Destination Details Modal
  let elModal = null;
  let elModalContent = null;
  let elModalClose = null;

  // Interactive Map Modal
  let elMapModal = null;
  let elMapModalClose = null;
  let elMapModalTitle = null;
  let elMapModalCategory = null;
  let elMapModalReadiness = null;
  let elMapModalSubtitle = null;
  let elMapReadinessTag = null;
  let elMapReadinessDesc = null;
  let elMapNearbySupportList = null;
  let elMapHonestSupportNote = null;
  let elMapGetDirectionsBtn = null;

  function init() {
    cacheDOM();
    setupEventListeners();
    renderCards();
    loadAllWeather();
  }

  function cacheDOM() {
    elCardsDeck = document.getElementById("cards-deck");
    
    // Details Modal
    elModal = document.getElementById("destination-modal");
    elModalContent = document.getElementById("modal-content");
    elModalClose = document.getElementById("modal-close-btn");

    // Map Modal
    elMapModal = document.getElementById("map-modal");
    elMapModalClose = document.getElementById("map-modal-close-btn");
    elMapModalTitle = document.getElementById("map-modal-title");
    elMapModalCategory = document.getElementById("map-modal-category");
    elMapModalReadiness = document.getElementById("map-modal-readiness");
    elMapModalSubtitle = document.getElementById("map-modal-subtitle");
    elMapReadinessTag = document.getElementById("map-readiness-tag");
    elMapReadinessDesc = document.getElementById("map-readiness-desc");
    elMapNearbySupportList = document.getElementById("map-nearby-support-list");
    elMapHonestSupportNote = document.getElementById("map-honest-support-note");
    elMapGetDirectionsBtn = document.getElementById("map-get-directions-btn");
  }

  function setupEventListeners() {
    // Details Modal Close Handlers
    if (elModalClose) {
      elModalClose.addEventListener("click", closeModal);
    }
    if (elModal) {
      elModal.addEventListener("click", (e) => {
        if (e.target === elModal) closeModal();
      });
    }

    // Map Modal Close Handlers
    if (elMapModalClose) {
      elMapModalClose.addEventListener("click", closeMapModal);
    }
    if (elMapModal) {
      elMapModal.addEventListener("click", (e) => {
        if (e.target === elMapModal) closeMapModal();
      });
    }

    // Keyboard escape to close modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (elMapModal && !elMapModal.classList.contains("hidden")) {
          closeMapModal();
        } else if (elModal && !elModal.classList.contains("hidden")) {
          closeModal();
        }
      }
    });

    // Touch support for perspective cards on mobile/tablet
    const pCards = document.querySelectorAll(".perspective-card");
    pCards.forEach(card => {
      card.addEventListener("click", () => {
        pCards.forEach(c => {
          if (c !== card) {
            c.classList.remove("active-touch");
          }
        });
        card.classList.toggle("active-touch");
      });
    });
  }

  /**
   * Fetch live weather for all destinations asynchronously using fixed coordinates
   */
  async function loadAllWeather() {
    destinations.forEach(async (dest) => {
      try {
        const info = await weather.fetchCurrentWeather(
          dest.coordinates.latitude,
          dest.coordinates.longitude
        );
        state.weatherData[dest.id] = info;
        updateCardWeather(dest.id);
      } catch (err) {
        state.weatherData[dest.id] = { error: true };
        updateCardWeather(dest.id);
      }
    });
  }

  function updateCardWeather(destId) {
    const weatherEl = document.querySelector(`[data-weather-dest="${destId}"]`);
    if (!weatherEl) return;
    const data = state.weatherData[destId];
    if (data && !data.error) {
      weatherEl.innerHTML = `
        <span class="text-sm mr-1">${data.icon}</span>
        <span class="font-semibold text-sandGold">${data.temp.toFixed(1)}°C</span>
        <span class="text-[11px] text-mutedSage ml-1 truncate">${data.desc}</span>
      `;
    } else if (data && data.error) {
      weatherEl.innerHTML = `<span class="text-[11px] text-mutedSage">Weather offline</span>`;
    }
  }

  /**
   * Render the 5 overlapping horizontal cards (Botanical Forest Luxury)
   */
  function renderCards() {
    if (!elCardsDeck) return;
    elCardsDeck.innerHTML = "";

    destinations.forEach((dest) => {
      const card = document.createElement("div");
      const isInitialActive = dest.id === state.activeCardId;

      // Category badge styling
      let catBadgeBg = "bg-[#2D5A40]/90 text-warmEcru border-[#E8C9A3]/30";
      if (dest.badgeType === "craft") catBadgeBg = "bg-[#8B5A3E]/90 text-warmEcru border-[#E8C9A3]/30";
      if (dest.badgeType === "geo") catBadgeBg = "bg-[#2D5A40]/90 text-warmEcru border-[#E8C9A3]/30";
      if (dest.badgeType === "heritage") catBadgeBg = "bg-[#8B5A3E]/90 text-warmEcru border-[#E8C9A3]/30";
      if (dest.badgeType === "history") catBadgeBg = "bg-[#8B5A3E]/90 text-warmEcru border-[#E8C9A3]/30";

      // Connectivity info badge (compact)
      let connectivityTag = "";
      if (dest.connectivity.status === "Isolated") {
        connectivityTag = `<span class="text-[10px] px-2.5 py-0.5 rounded-full bg-[#8B5A3E]/80 text-white font-medium border border-white/15">Isolated • Self-supply</span>`;
      } else if (dest.connectivity.status === "Weak") {
        connectivityTag = `<span class="text-[10px] px-2.5 py-0.5 rounded-full bg-[#8B5A3E]/70 text-warmEcru font-medium border border-white/15">Ranchi hub (2–3h)</span>`;
      } else if (dest.proximityBundle && dest.proximityBundle.partnerName) {
        connectivityTag = `<span class="text-[10px] px-2.5 py-0.5 rounded-full bg-[#2D5A40]/80 text-white font-medium border border-[#E8C9A3]/30">Ghatsila Bundle</span>`;
      } else if (dest.id === "maluti-temple-village") {
        connectivityTag = `<span class="text-[10px] px-2.5 py-0.5 rounded-full bg-[#2D5A40]/80 text-white font-medium border border-[#E8C9A3]/30">Heritage Cluster</span>`;
      } else {
        connectivityTag = `<span class="text-[10px] px-2.5 py-0.5 rounded-full bg-white/15 text-warmEcru font-medium border border-white/15 backdrop-blur-md">${dest.district} Hub</span>`;
      }

      card.className = `destination-card group relative flex-shrink-0 w-[290px] sm:w-[320px] md:w-[340px] h-[480px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-out border ${
        isInitialActive 
          ? "border-[#E8C9A3] shadow-[0_20px_45px_rgba(232,201,163,0.28)] z-20 scale-[1.03] -translate-y-2" 
          : "border-[#2D5A40]/70 shadow-2xl z-10 opacity-90 hover:opacity-100"
      }`;
      card.setAttribute("data-card-id", dest.id);

      card.innerHTML = `
        <!-- Background Image with Overlay -->
        <img src="${dest.image}" alt="${dest.name}" class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#0F241A] via-[#0F241A]/65 to-transparent"></div>

        <!-- Top Badges Row -->
        <div class="absolute top-4 inset-x-4 flex items-center justify-between z-20">
          <span class="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border backdrop-blur-md shadow-sm ${catBadgeBg}">
            ${dest.category}
          </span>
          <span class="text-[10px] font-medium text-warmEcru bg-black/45 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15">
            ${dest.district}
          </span>
        </div>

        <!-- Bottom Content Area -->
        <div class="absolute bottom-0 inset-x-0 p-5 z-20 flex flex-col justify-end">
          
          <!-- Location District -->
          <div class="flex items-center text-xs text-sandGold font-semibold mb-1 space-x-1">
            <svg class="w-3.5 h-3.5 text-sandGold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span>${dest.readableLocation || `${dest.district}, Jharkhand`}</span>
          </div>

          <!-- Destination Title -->
          <h3 class="text-xl sm:text-2xl font-serif font-bold text-warmEcru tracking-tight leading-tight group-hover:text-sandGold transition-colors duration-300">
            ${dest.name}
          </h3>

          <!-- Short Hook -->
          <p class="text-xs text-[#D4E2D9] mt-2 font-light line-clamp-2 leading-relaxed">
            ${dest.hook}
          </p>

          <!-- Connectivity Tag Pill -->
          <div class="mt-3 flex items-center space-x-2">
            ${connectivityTag}
          </div>

          <!-- Expanded Info on Hover / Active -->
          <div class="mt-3 pt-3 border-t border-white/15 flex items-center justify-between">
            <!-- Compact Weather -->
            <div class="flex items-center" data-weather-dest="${dest.id}">
              <span class="text-[11px] text-mutedSage">Loading weather...</span>
            </div>

            <!-- View Details Action Button -->
            <button class="btn-view-details inline-flex items-center text-xs font-semibold text-sandGold group-hover:text-forestDark group-hover:bg-sandGold px-3.5 py-1.5 rounded-xl border border-transparent group-hover:border-sandGold transition-all duration-300 shadow-sm" data-view-id="${dest.id}">
              View Details <span class="ml-1 text-sm">→</span>
            </button>
          </div>

        </div>
      `;

      // Hover handler to bring this card to front and adjust neighbors
      card.addEventListener("mouseenter", () => {
        setActiveCard(dest.id);
      });

      // Click card to open modal
      card.addEventListener("click", () => {
        openModal(dest.id);
      });

      elCardsDeck.appendChild(card);
      
      // Update weather if already loaded
      if (state.weatherData[dest.id]) {
        updateCardWeather(dest.id);
      }
    });
  }

  /**
   * Set active card on hover without auto-sliding
   */
  function setActiveCard(destId) {
    state.activeCardId = destId;
    const allCards = document.querySelectorAll(".destination-card");

    allCards.forEach((card) => {
      const cardId = card.getAttribute("data-card-id");
      if (cardId === destId) {
        card.classList.add("border-[#E8C9A3]", "shadow-[0_22px_50px_rgba(232,201,163,0.3)]", "z-30", "scale-[1.04]", "-translate-y-3");
        card.classList.remove("border-[#2D5A40]/70", "shadow-2xl", "z-10", "opacity-90", "scale-[1.03]", "-translate-y-2");
      } else {
        card.classList.remove("border-[#E8C9A3]", "shadow-[0_22px_50px_rgba(232,201,163,0.3)]", "z-30", "scale-[1.04]", "-translate-y-3", "scale-[1.03]", "-translate-y-2");
        card.classList.add("border-[#2D5A40]/70", "shadow-2xl", "z-10", "opacity-90");
      }
    });
  }

  /**
   * Open the Botanical Forest View Details modal
   */
  function openModal(destId) {
    const dest = destinations.find((d) => d.id === destId);
    if (!dest || !elModalContent || !elModal) return;

    const weatherData = state.weatherData[dest.id] || { desc: "Available on sync", temp: 28, icon: "🌤️" };

    // Proximity Bundle / Support HTML
    let bundleHtml = "";
    if (dest.proximityBundle) {
      const bundleHeading = dest.proximityBundle.heading || "Verified Proximity Bundle";
      bundleHtml = `
        <div class="mt-4 p-4 rounded-2xl bg-[#1B3B2B] border border-[#2D5A40]">
          <div class="flex items-center space-x-2 text-sandGold text-xs font-bold uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-sandGold"></span>
            <span>${bundleHeading}</span>
          </div>
          <p class="text-xs text-[#D4E2D9] mt-1.5 leading-relaxed font-light">
            ${dest.proximityBundle.note}
          </p>
        </div>
      `;
    }

    // Verified Accommodations / Nearby Stay Options HTML
    let stayHtml = "";
    if (dest.verifiedPlaces && dest.verifiedPlaces.length > 0) {
      const stayHeading = dest.stayHeading || "Verified Base Accommodation";
      stayHtml = `
        <div class="mt-4 p-4 rounded-2xl bg-[#183325] border border-[#2D5A40] shadow-sm">
          <div class="flex items-center space-x-2 text-sandGold text-xs font-bold uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-sandGold"></span>
            <span>${stayHeading}</span>
          </div>
          ${dest.verifiedPlaces.map(p => `
            <div class="mt-2 flex items-baseline justify-between text-xs">
              <span class="font-semibold text-warmEcru">${p.name} ${p.location ? `(${p.location})` : ""}</span>
              <span class="text-[10px] text-mutedSage font-normal">${p.source || p.type || ""}</span>
            </div>
          `).join("")}
        </div>
      `;
    }

    // Honest Warning Flag HTML
    let flagHtml = "";
    if (dest.honestFlags) {
      flagHtml = `
        <div class="mt-4 p-4 rounded-2xl bg-[#8B5A3E]/20 border border-[#8B5A3E]/50">
          <div class="flex items-center space-x-2 text-sandGold text-xs font-bold uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-sandGold"></span>
            <span>Traveler Planning Notice</span>
          </div>
          <p class="text-xs text-[#D4E2D9] mt-1.5 leading-relaxed font-light">
            ${dest.honestFlags}
          </p>
        </div>
      `;
    }

    elModalContent.innerHTML = `
      <!-- Modal Header with Image -->
      <div class="relative h-64 sm:h-72 w-full overflow-hidden">
        <img src="${dest.image}" alt="${dest.name}" class="w-full h-full object-cover object-center" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#142C20] via-[#142C20]/50 to-transparent"></div>
        
        <div class="absolute top-4 left-4">
          <span class="text-xs uppercase font-bold tracking-wider px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-sandGold border border-[#E8C9A3]/30 shadow-sm">
            ${dest.category}
          </span>
        </div>

        <div class="absolute bottom-4 left-5 right-5">
          <div class="flex items-center space-x-1.5 text-xs text-sandGold font-semibold">
            <span>📍</span>
            <span>${dest.readableLocation || `${dest.district} District, Jharkhand`}</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-serif font-bold text-warmEcru mt-1">
            ${dest.name}
          </h2>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-6 space-y-5 text-warmEcru">
        
        <!-- One-line Hook & Description -->
        <div>
          <p class="text-sm font-medium text-sandGold italic bg-[#0F241A] p-3.5 rounded-xl border-l-3 border-sandGold">
            "${dest.hook}"
          </p>
          <p class="text-sm text-[#D4E2D9] mt-3 leading-relaxed font-light">
            ${dest.shortDesc}
          </p>
        </div>

        <!-- Key Metrics Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          
          <!-- Safety -->
          <div class="p-3.5 rounded-2xl bg-[#0F241A]/80 border border-[#2D5A40] shadow-sm">
            <span class="text-[10px] text-mutedSage block uppercase font-bold tracking-wider">Safety Status</span>
            <span class="font-bold text-warmEcru mt-0.5 block">${dest.safety.status}</span>
            <span class="text-[10px] text-mutedSage">${dest.safety.cautions}</span>
          </div>

          <!-- Connectivity Hub -->
          <div class="p-3.5 rounded-2xl bg-[#0F241A]/80 border border-[#2D5A40] shadow-sm">
            <span class="text-[10px] text-mutedSage block uppercase font-bold tracking-wider">Connectivity Hub</span>
            <span class="font-bold text-warmEcru mt-0.5 block">${dest.connectivity.status}</span>
            <span class="text-[10px] text-mutedSage">${dest.connectivity.hub}</span>
          </div>

          <!-- Live Weather -->
          <div class="p-3.5 rounded-2xl bg-[#0F241A]/80 border border-[#2D5A40] shadow-sm col-span-2 sm:col-span-1">
            <span class="text-[10px] text-mutedSage block uppercase font-bold tracking-wider">Live Weather</span>
            <div class="flex items-center space-x-1 mt-0.5">
              <span>${weatherData.icon || "🌤️"}</span>
              <span class="font-bold text-sandGold">${weatherData.temp ? weatherData.temp.toFixed(1) + "°C" : "Live"}</span>
            </div>
            <span class="text-[10px] text-mutedSage">${weatherData.desc || "Conditions verified"}</span>
          </div>

        </div>

        <!-- Proximity / Trip Support & Accommodations -->
        ${bundleHtml}
        ${stayHtml}
        ${flagHtml}

        <!-- Interactive Map Action Bar -->
        <div class="pt-4 border-t border-[#2D5A40] flex items-center justify-between gap-3 text-xs text-mutedSage">
          <div class="text-[11px] text-mutedSage">
            <span>Location: </span><span class="text-warmEcru font-medium">${dest.readableLocation || `${dest.district} District, Jharkhand`}</span>
          </div>
          <button id="modal-explore-map-btn" 
             class="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-sandGold text-forestDark font-bold hover:bg-sandGoldDark transition-all duration-200 shadow-lg shadow-sandGold/20 cursor-pointer">
            <span>Explore on Map</span>
            <span>🗺️</span>
          </button>
        </div>

      </div>
    `;

    // Attach click handler to the in-page map button
    const mapBtn = document.getElementById("modal-explore-map-btn");
    if (mapBtn) {
      mapBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeModal();
        openMapModal(dest.id);
      });
    }

    elModal.classList.remove("hidden");
    elModal.classList.add("flex");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!elModal) return;
    elModal.classList.add("hidden");
    elModal.classList.remove("flex");
    document.body.style.overflow = "";
  }

  /**
   * Open the In-Page Interactive Leaflet Map Modal (Two-Column Layout)
   */
  function openMapModal(destId) {
    const dest = destinations.find((d) => d.id === destId);
    if (!dest || !elMapModal) return;

    // 1. Update Header Metadata
    if (elMapModalTitle) elMapModalTitle.textContent = dest.name;
    if (elMapModalCategory) elMapModalCategory.textContent = dest.category;
    if (elMapModalSubtitle) elMapModalSubtitle.textContent = `📍 ${dest.readableLocation || `${dest.district} District, Jharkhand`}`;
    
    // Readiness badge in header
    if (elMapModalReadiness && dest.readiness) {
      elMapModalReadiness.textContent = dest.readiness.badge;
      if (dest.readiness.level === "ready") {
        elMapModalReadiness.className = "text-[10px] font-bold px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40";
      } else if (dest.readiness.level === "plan-ahead") {
        elMapModalReadiness.className = "text-[10px] font-bold px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40";
      } else {
        elMapModalReadiness.className = "text-[10px] font-bold px-3 py-0.5 rounded-full bg-[#8B5A3E]/30 text-sandGold border border-[#8B5A3E]/50";
      }
    }

    // Readiness info in right panel
    if (elMapReadinessTag && dest.readiness) {
      elMapReadinessTag.textContent = dest.readiness.badge.replace(/^[^\s]+\s/, "");
      if (dest.readiness.level === "ready") elMapReadinessTag.className = "font-bold text-emerald-300 text-[11px]";
      else if (dest.readiness.level === "plan-ahead") elMapReadinessTag.className = "font-bold text-amber-300 text-[11px]";
      else elMapReadinessTag.className = "font-bold text-rose-300 text-[11px]";
    }
    if (elMapReadinessDesc && dest.readiness) {
      elMapReadinessDesc.textContent = dest.readiness.note;
    }

    // 2. Populate Right-Side "Nearby & Trip Support" Panel with RED location dots
    if (elMapNearbySupportList) {
      elMapNearbySupportList.innerHTML = "";
      
      const supportItems = dest.nearbySupport || [];
      if (supportItems.length > 0) {
        supportItems.forEach((item, index) => {
          const distKM = distance.calculateHaversine(
            dest.coordinates.latitude,
            dest.coordinates.longitude,
            item.coordinates.latitude,
            item.coordinates.longitude
          );

          const distLabel = distKM < 0.3 ? "Within walking range" : `~${distKM.toFixed(1)} km away`;

          const itemEl = document.createElement("div");
          itemEl.className = "nearby-support-card p-3 rounded-2xl bg-[#0F241A]/90 hover:bg-[#1B3B2B] border border-[#2D5A40] hover:border-[#E8C9A3] transition-all duration-200 cursor-pointer group shadow-sm";
          itemEl.setAttribute("data-nearby-idx", index);
          
          itemEl.innerHTML = `
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-start space-x-2.5 min-w-0">
                <span class="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_#EF4444] mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform"></span>
                <div class="min-w-0">
                  <h5 class="text-xs font-bold text-warmEcru group-hover:text-sandGold transition-colors leading-snug truncate">${item.name}</h5>
                  <span class="text-[10px] font-semibold text-mutedSage tracking-wider block mt-0.5 truncate">${item.category}</span>
                </div>
              </div>
              <span class="text-[10px] font-semibold text-sandGold bg-sandGold/10 px-2 py-0.5 rounded-full border border-sandGold/20 flex-shrink-0">
                ${distLabel}
              </span>
            </div>
          `;

          // Card hover & click events to highlight RED marker on map
          itemEl.addEventListener("mouseenter", () => {
            focusNearbyMarker(index);
          });
          itemEl.addEventListener("click", () => {
            focusNearbyMarker(index, true);
          });

          elMapNearbySupportList.appendChild(itemEl);
        });
      } else {
        // Clean empty state message for destinations with no verified proximity data (e.g. Mandro)
        elMapNearbySupportList.innerHTML = `
          <div class="p-4 rounded-2xl bg-[#0F241A]/80 border border-dashed border-[#2D5A40] text-center text-xs text-mutedSage my-auto shadow-sm">
            <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block mb-2 shadow-[0_0_8px_#10B981]"></span>
            <h5 class="font-bold text-warmEcru mb-1">PROXIMITY / TRIP SUPPORT</h5>
            <p class="text-[11px] text-mutedSage leading-relaxed">
              No verified nearby places added yet.<br>
              Nearby facilities and attractions will be shown here once verified.
            </p>
          </div>
        `;
      }
    }

    // Honest note in panel
    if (elMapHonestSupportNote) {
      if (dest.honestSupportNote && (dest.nearbySupport && dest.nearbySupport.length > 0)) {
        elMapHonestSupportNote.classList.remove("hidden");
        elMapHonestSupportNote.innerHTML = `
          <div class="flex items-start space-x-2">
            <span class="text-sandGold text-sm">🛡️</span>
            <p class="text-[11px] text-warmEcru leading-relaxed font-normal">${dest.honestSupportNote}</p>
          </div>
        `;
      } else {
        elMapHonestSupportNote.classList.add("hidden");
        elMapHonestSupportNote.innerHTML = "";
      }
    }

    // 3. Configure Get Directions Button (Opens Google Maps Directions with fixed destination coordinates)
    if (elMapGetDirectionsBtn) {
      const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${dest.coordinates.latitude},${dest.coordinates.longitude}`;
      elMapGetDirectionsBtn.setAttribute("href", gmapsUrl);
    }

    // 4. Display Modal
    elMapModal.classList.remove("hidden");
    elMapModal.classList.add("flex");
    document.body.style.overflow = "hidden";

    // 5. Initialize or Update Leaflet Map with GREEN (Main) & RED (Nearby) Markers
    setTimeout(() => {
      const container = document.getElementById("leaflet-map-container");
      if (!container) return;

      const mainLat = dest.coordinates.latitude;
      const mainLon = dest.coordinates.longitude;

      if (!leafletMap) {
        // Initialize Map
        leafletMap = L.map(container, {
          center: [mainLat, mainLon],
          zoom: 12,
          zoomControl: true
        });

        // Add OpenStreetMap Tile Layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
          maxZoom: 18
        }).addTo(leafletMap);
      } else {
        // Clear previous markers
        if (mainMarker) leafletMap.removeLayer(mainMarker);
        nearbyMarkers.forEach(m => leafletMap.removeLayer(m));
      }

      nearbyMarkers = [];

      // 1. GREEN Marker for Main Destination
      const mainIcon = L.divIcon({
        className: "custom-main-pin-wrapper",
        html: `<div class="marker-green-circle"></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -13]
      });

      // Add Main Destination Marker with clean popup
      mainMarker = L.marker([mainLat, mainLon], { icon: mainIcon })
        .addTo(leafletMap)
        .bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 2px;">
            <h4 style="color: #10B981; font-weight: 700; font-size: 14px; margin: 0 0 2px 0;">${dest.name}</h4>
            <p style="color: #A3B8AC; font-size: 11px; margin: 0; font-weight: 500;">${dest.readableLocation || dest.district}</p>
          </div>
        `, { maxWidth: 260 });

      // Click on main marker highlights main destination
      mainMarker.on("click", () => {
        document.querySelectorAll(".nearby-support-card").forEach(el => {
          el.classList.remove("border-[#E8C9A3]", "bg-[#1B3B2B]");
        });
        document.querySelectorAll(".marker-red-circle").forEach(el => el.classList.remove("active-highlight"));
      });

      // 2. RED Markers for Nearby Places
      const allPoints = [[mainLat, mainLon]];
      const supportItems = dest.nearbySupport || [];

      supportItems.forEach((item, index) => {
        const itemLat = item.coordinates.latitude;
        const itemLon = item.coordinates.longitude;
        allPoints.push([itemLat, itemLon]);

        const distKM = distance.calculateHaversine(mainLat, mainLon, itemLat, itemLon);
        const distText = distKM < 0.3 ? "Within walking range" : `~${distKM.toFixed(1)} km away`;

        const nearbyIcon = L.divIcon({
          className: `custom-nearby-pin-wrapper nearby-pin-${index}`,
          html: `<div class="marker-red-circle"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
          popupAnchor: [0, -9]
        });

        // Clean popup
        const marker = L.marker([itemLat, itemLon], { icon: nearbyIcon })
          .addTo(leafletMap)
          .bindPopup(`
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 2px;">
              <h4 style="color: #EF4444; font-weight: 700; font-size: 13px; margin: 0 0 2px 0;">${item.name}</h4>
              <div style="font-size: 10px; color: #E8C9A3; font-weight: 600; text-transform: uppercase;">${item.category}</div>
              <div style="font-size: 11px; color: #F3EDE2; margin-top: 3px;">${distText}</div>
            </div>
          `, { maxWidth: 240 });

        // Click marker to highlight card in panel
        marker.on("click", () => {
          highlightCardInPanel(index);
        });

        nearbyMarkers.push(marker);
      });

      // Fit map viewport to include destination and all its nearby places
      if (allPoints.length > 1) {
        leafletMap.fitBounds(allPoints, { padding: [40, 40], maxZoom: 13 });
      } else {
        leafletMap.setView([mainLat, mainLon], 12);
      }

      mainMarker.openPopup();
      leafletMap.invalidateSize();
    }, 150);
  }

  /**
   * Highlight RED nearby marker when hovering/clicking on right-side card
   */
  function focusNearbyMarker(index, panToMarker = false) {
    if (!nearbyMarkers[index] || !leafletMap) return;
    const marker = nearbyMarkers[index];
    
    // Open popup
    marker.openPopup();
    
    if (panToMarker) {
      leafletMap.panTo(marker.getLatLng(), { animate: true, duration: 0.4 });
    }

    // Add visual highlight class to RED pin
    document.querySelectorAll(".marker-red-circle").forEach(el => el.classList.remove("active-highlight"));
    const pinEl = document.querySelector(`.nearby-pin-${index} .marker-red-circle`);
    if (pinEl) pinEl.classList.add("active-highlight");
  }

  function highlightCardInPanel(index) {
    document.querySelectorAll(".nearby-support-card").forEach(el => {
      el.classList.remove("border-[#E8C9A3]", "bg-[#1B3B2B]");
    });
    const card = document.querySelector(`[data-nearby-idx="${index}"]`);
    if (card) {
      card.classList.add("border-[#E8C9A3]", "bg-[#1B3B2B]");
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function closeMapModal() {
    if (!elMapModal) return;
    elMapModal.classList.add("hidden");
    elMapModal.classList.remove("flex");
    document.body.style.overflow = "";
  }

  return {
    init,
    openModal,
    closeModal,
    openMapModal,
    closeMapModal
  };
})();
