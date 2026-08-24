// Controller for Unexplored Jharkhand Destination Experience
// Refined Color System: Light Sage & Deep Forest Luxury Eco-Tourism Palette
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
        <span class="font-bold text-[#F7F1E5]">${data.temp.toFixed(1)}°C</span>
        <span class="text-[11px] text-[#C7D6C8] ml-1 truncate">${data.desc}</span>
      `;
    } else if (data && data.error) {
      weatherEl.innerHTML = `<span class="text-[11px] text-[#C7D6C8]">Weather offline</span>`;
    }
  }

  /**
   * Render the 5 overlapping horizontal cards (Cinematic Dark Cards with Light Text)
   */
  function renderCards() {
    if (!elCardsDeck) return;
    elCardsDeck.innerHTML = "";

    destinations.forEach((dest) => {
      const card = document.createElement("div");
      const isInitialActive = dest.id === state.activeCardId;

      // Category badge styling
      let catBadgeBg = "bg-[#4C9A45] text-white border-white/20";
      if (dest.badgeType === "eco") catBadgeBg = "bg-[#2F6B3C] text-white border-white/20";
      if (dest.badgeType === "craft") catBadgeBg = "bg-[#3B7E48] text-white border-white/20";
      if (dest.badgeType === "geo") catBadgeBg = "bg-[#2F6B3C] text-white border-white/20";
      if (dest.badgeType === "heritage") catBadgeBg = "bg-[#4C9A45] text-white border-white/20";

      // Connectivity info badge (compact)
      let connectivityTag = "";
      if (dest.connectivity.status === "Isolated") {
        connectivityTag = `<span class="text-[10px] px-2.5 py-0.5 rounded-full bg-[#4C9A45]/90 text-white font-semibold border border-white/15">Isolated • Self-supply</span>`;
      } else if (dest.connectivity.status === "Weak") {
        connectivityTag = `<span class="text-[10px] px-2.5 py-0.5 rounded-full bg-[#2F6B3C]/90 text-white font-semibold border border-white/15">Ranchi hub (2–3h)</span>`;
      } else if (dest.proximityBundle && dest.proximityBundle.partnerName) {
        connectivityTag = `<span class="text-[10px] px-2.5 py-0.5 rounded-full bg-[#4C9A45] text-white font-semibold border border-white/15">Ghatsila Bundle</span>`;
      } else if (dest.id === "maluti-temple-village") {
        connectivityTag = `<span class="text-[10px] px-2.5 py-0.5 rounded-full bg-[#4C9A45] text-white font-semibold border border-white/15">Heritage Cluster</span>`;
      } else {
        connectivityTag = `<span class="text-[10px] px-2.5 py-0.5 rounded-full bg-white/20 text-[#F7F1E5] font-semibold border border-white/20 backdrop-blur-md">${dest.district} Hub</span>`;
      }

      card.className = `destination-card group relative flex-shrink-0 w-[290px] sm:w-[320px] md:w-[340px] h-[480px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-out border ${
        isInitialActive 
          ? "border-[#4C9A45] shadow-[0_20px_45px_rgba(76,154,69,0.32)] z-20 scale-[1.03] -translate-y-2" 
          : "border-white/80 shadow-[0_12px_30px_rgba(22,59,39,0.14)] z-10 opacity-95 hover:opacity-100"
      }`;
      card.setAttribute("data-card-id", dest.id);

      card.innerHTML = `
        <!-- Background Image with Dark Cinematic Overlay -->
        <img src="${dest.image}" alt="${dest.name}" class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#163B27] via-[#163B27]/70 to-transparent"></div>

        <!-- Top Badges Row -->
        <div class="absolute top-4 inset-x-4 flex items-center justify-between z-20">
          <span class="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border backdrop-blur-md shadow-sm ${catBadgeBg}">
            ${dest.category}
          </span>
          <span class="text-[10px] font-semibold text-[#F7F1E5] bg-black/45 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15">
            ${dest.district}
          </span>
        </div>

        <!-- Bottom Content Area -->
        <div class="absolute bottom-0 inset-x-0 p-5 z-20 flex flex-col justify-end">
          
          <!-- Location District -->
          <div class="flex items-center text-xs text-[#D8E5D9] font-bold mb-1 space-x-1">
            <svg class="w-3.5 h-3.5 text-[#4C9A45]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span>${dest.readableLocation || `${dest.district}, Jharkhand`}</span>
          </div>

          <!-- Destination Title -->
          <h3 class="text-xl sm:text-2xl font-serif font-bold text-[#F7F1E5] tracking-tight leading-tight group-hover:text-white transition-colors duration-300">
            ${dest.name}
          </h3>

          <!-- Short Hook -->
          <p class="text-xs text-[#F2F5EF] mt-2 font-light line-clamp-2 leading-relaxed">
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
              <span class="text-[11px] text-[#C7D6C8]">Loading weather...</span>
            </div>

            <!-- View Details Action Button -->
            <button class="btn-view-details inline-flex items-center text-xs font-bold text-[#D8E5D9] group-hover:text-white group-hover:bg-[#4C9A45] px-3.5 py-1.5 rounded-xl border border-transparent group-hover:border-[#4C9A45] transition-all duration-300 shadow-sm" data-view-id="${dest.id}">
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
        card.classList.add("border-[#4C9A45]", "shadow-[0_22px_50px_rgba(76,154,69,0.32)]", "z-30", "scale-[1.03]", "-translate-y-2");
        card.classList.remove("border-white/80", "shadow-[0_12px_30px_rgba(22,59,39,0.14)]", "z-10", "opacity-90");
      } else {
        card.classList.remove("border-[#4C9A45]", "shadow-[0_22px_50px_rgba(76,154,69,0.32)]", "z-30", "scale-[1.03]", "-translate-y-2");
        card.classList.add("border-white/80", "shadow-[0_12px_30px_rgba(22,59,39,0.14)]", "z-10", "opacity-90");
      }
    });
  }

  /**
   * Open the Light Destination Details Modal with High Contrast
   */
  function openModal(destId) {
    const dest = destinations.find((d) => d.id === destId);
    if (!dest || !elModalContent || !elModal) return;

    const weatherData = state.weatherData[dest.id] || { desc: "Available on sync", temp: 28, icon: "🌤️" };

    // Proximity Bundle / Support HTML (Dark Forest Green Box #173D2A for visual contrast)
    let bundleHtml = "";
    if (dest.proximityBundle) {
      const bundleHeading = dest.proximityBundle.heading || "Verified Proximity Bundle";
      bundleHtml = `
        <div class="mt-4 p-4 rounded-2xl bg-[#173D2A] border border-[rgba(47,107,60,0.3)] shadow-sm">
          <div class="flex items-center space-x-2 text-[#4C9A45] text-xs font-bold uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-[#4C9A45]"></span>
            <span>${bundleHeading}</span>
          </div>
          <p class="text-xs text-[#F7F1E5] mt-1.5 leading-relaxed font-normal">
            ${dest.proximityBundle.note}
          </p>
        </div>
      `;
    }

    // Verified Accommodations / Nearby Stay Options HTML (Dark Forest Green Box #173D2A)
    let stayHtml = "";
    if (dest.verifiedPlaces && dest.verifiedPlaces.length > 0) {
      const stayHeading = dest.stayHeading || "Verified Base Accommodation";
      stayHtml = `
        <div class="mt-4 p-4 rounded-2xl bg-[#173D2A] border border-[rgba(47,107,60,0.3)] shadow-sm">
          <div class="flex items-center space-x-2 text-[#4C9A45] text-xs font-bold uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-[#4C9A45]"></span>
            <span>${stayHeading}</span>
          </div>
          ${dest.verifiedPlaces.map(p => `
            <div class="mt-2 flex items-baseline justify-between text-xs">
              <span class="font-semibold text-[#F7F1E5]">${p.name} ${p.location ? `(${p.location})` : ""}</span>
              <span class="text-[10px] text-[#C9D8CA] font-normal">${p.source || p.type || ""}</span>
            </div>
          `).join("")}
        </div>
      `;
    }

    // Honest Warning Flag HTML
    let flagHtml = "";
    if (dest.honestFlags) {
      flagHtml = `
        <div class="mt-4 p-4 rounded-2xl bg-[#173D2A] border border-amber-600/40">
          <div class="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Traveler Planning Notice</span>
          </div>
          <p class="text-xs text-[#F7F1E5] mt-1.5 leading-relaxed font-normal">
            ${dest.honestFlags}
          </p>
        </div>
      `;
    }

    elModalContent.innerHTML = `
      <!-- Modal Header with Image -->
      <div class="relative h-64 sm:h-72 w-full overflow-hidden">
        <img src="${dest.image}" alt="${dest.name}" class="w-full h-full object-cover object-center" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#163B27] via-[#163B27]/50 to-transparent"></div>
        
        <div class="absolute top-4 left-4">
          <span class="text-xs uppercase font-bold tracking-wider px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#163B27] border border-white/40 shadow-sm">
            ${dest.category}
          </span>
        </div>

        <div class="absolute bottom-4 left-5 right-5">
          <div class="flex items-center space-x-1.5 text-xs text-[#D8E5D9] font-bold">
            <span>📍</span>
            <span>${dest.readableLocation || `${dest.district} District, Jharkhand`}</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-serif font-bold text-[#F7F1E5] mt-1">
            ${dest.name}
          </h2>
        </div>
      </div>

      <!-- Modal Body (Light Surface with Dark Forest Headings and Crisp Text) -->
      <div class="p-6 space-y-5 text-[#163B27] bg-[#F8FAF4]">
        
        <!-- One-line Hook & Description -->
        <div>
          <p class="text-sm font-semibold text-[#163B27] italic bg-[#E7F1E3] p-3.5 rounded-xl border-l-3 border-[#4C9A45]">
            "${dest.hook}"
          </p>
          <p class="text-sm text-[#344C3A] mt-3 leading-relaxed font-normal">
            ${dest.shortDesc}
          </p>
        </div>

        <!-- Key Metrics Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          
          <!-- Safety -->
          <div class="p-3.5 rounded-2xl bg-white border border-[rgba(47,107,60,0.18)] shadow-sm">
            <span class="text-[10px] text-[#6E846F] block uppercase font-bold tracking-wider">Safety Status</span>
            <span class="font-bold text-[#163B27] mt-0.5 block">${dest.safety.status}</span>
            <span class="text-[10px] text-[#6E846F]">${dest.safety.cautions}</span>
          </div>

          <!-- Connectivity Hub -->
          <div class="p-3.5 rounded-2xl bg-white border border-[rgba(47,107,60,0.18)] shadow-sm">
            <span class="text-[10px] text-[#6E846F] block uppercase font-bold tracking-wider">Connectivity Hub</span>
            <span class="font-bold text-[#163B27] mt-0.5 block">${dest.connectivity.status}</span>
            <span class="text-[10px] text-[#6E846F]">${dest.connectivity.hub}</span>
          </div>

          <!-- Live Weather -->
          <div class="p-3.5 rounded-2xl bg-white border border-[rgba(47,107,60,0.18)] shadow-sm col-span-2 sm:col-span-1">
            <span class="text-[10px] text-[#6E846F] block uppercase font-bold tracking-wider">Live Weather</span>
            <div class="flex items-center space-x-1 mt-0.5">
              <span>${weatherData.icon || "🌤️"}</span>
              <span class="font-bold text-[#4C9A45]">${weatherData.temp ? weatherData.temp.toFixed(1) + "°C" : "Live"}</span>
            </div>
            <span class="text-[10px] text-[#6E846F]">${weatherData.desc || "Conditions verified"}</span>
          </div>

        </div>

        <!-- Dark Forest Proximity / Trip Support & Accommodations Boxes for Contrast -->
        ${bundleHtml}
        ${stayHtml}
        ${flagHtml}

        <!-- Interactive Map & Action Bar -->
        <div class="pt-4 border-t border-[rgba(47,107,60,0.18)] flex flex-wrap items-center justify-between gap-3 text-xs text-[#6E846F]">
          <div class="text-[11px] text-[#6E846F]">
            <span>Location: </span><span class="text-[#163B27] font-semibold">${dest.readableLocation || `${dest.district} District, Jharkhand`}</span>
          </div>
          <div class="flex items-center space-x-2.5 flex-wrap gap-2">
            <button id="modal-add-scheduler-btn"
               data-destination-id="${dest.id}"
               class="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#E7F1E3] text-[#163B27] hover:text-[#2F6B3C] border border-[rgba(47,107,60,0.3)] font-bold transition-all duration-200 shadow-sm cursor-pointer">
              <span>+</span>
              <span>Add to Scheduler</span>
            </button>
            <button id="modal-explore-map-btn" 
               class="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#4C9A45] text-white font-bold hover:bg-[#3B7E48] transition-all duration-200 shadow-lg shadow-[#4C9A45]/25 cursor-pointer">
              <span>Explore on Map</span>
              <span>🗺️</span>
            </button>
          </div>
        </div>

      </div>
    `;

    // Attach click handler to the Add to Scheduler button
    const schedulerBtn = document.getElementById("modal-add-scheduler-btn");
    if (schedulerBtn) {
      schedulerBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        addToTripPlan(dest);
        schedulerBtn.innerHTML = `<span>✓</span><span>Added to My Trip Plan</span>`;
        schedulerBtn.classList.add("bg-[#E7F1E3]", "text-[#2F6B3C]");
      });
    }

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
        elMapModalReadiness.className = "text-[10px] font-bold px-3 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-500/30";
      } else if (dest.readiness.level === "plan-ahead") {
        elMapModalReadiness.className = "text-[10px] font-bold px-3 py-0.5 rounded-full bg-amber-500/15 text-amber-800 border border-amber-500/30";
      } else {
        elMapModalReadiness.className = "text-[10px] font-bold px-3 py-0.5 rounded-full bg-rose-500/15 text-rose-800 border border-rose-500/30";
      }
    }

    // Readiness info in right panel
    if (elMapReadinessTag && dest.readiness) {
      elMapReadinessTag.textContent = dest.readiness.badge.replace(/^[^\s]+\s/, "");
      if (dest.readiness.level === "ready") elMapReadinessTag.className = "font-bold text-emerald-800 text-[11px]";
      else if (dest.readiness.level === "plan-ahead") elMapReadinessTag.className = "font-bold text-amber-800 text-[11px]";
      else elMapReadinessTag.className = "font-bold text-rose-800 text-[11px]";
    }
    if (elMapReadinessDesc && dest.readiness) {
      elMapReadinessDesc.textContent = dest.readiness.note;
    }

    // 2. Populate Right-Side "Nearby & Trip Support" Panel (Deep Forest Green Cards #173D2A with Warm Cream Text)
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
          itemEl.className = "nearby-support-card p-3 rounded-2xl bg-[#173D2A] border border-[rgba(47,107,60,0.3)] hover:border-[#4C9A45] transition-all duration-200 cursor-pointer group shadow-sm";
          itemEl.setAttribute("data-nearby-idx", index);
          
          itemEl.innerHTML = `
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-start space-x-2.5 min-w-0">
                <span class="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_#EF4444] mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform"></span>
                <div class="min-w-0">
                  <h5 class="text-xs font-bold text-[#F7F1E5] group-hover:text-[#4C9A45] transition-colors leading-snug truncate">${item.name}</h5>
                  <span class="text-[10px] font-semibold text-[#C8D8C9] tracking-wider block mt-0.5 truncate">${item.category}</span>
                </div>
              </div>
              <span class="text-[10px] font-semibold text-[#F7F1E5] bg-[#2F6B3C]/80 px-2 py-0.5 rounded-full border border-[rgba(76,154,69,0.4)] flex-shrink-0">
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
          <div class="p-4 rounded-2xl bg-white border border-dashed border-[rgba(47,107,60,0.25)] text-center text-xs text-[#6E846F] my-auto shadow-sm">
            <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block mb-2 shadow-[0_0_8px_#10B981]"></span>
            <h5 class="font-bold text-[#163B27] mb-1">PROXIMITY / TRIP SUPPORT</h5>
            <p class="text-[11px] text-[#6E846F] leading-relaxed">
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
            <span class="text-[#4C9A45] text-sm">🛡️</span>
            <p class="text-[11px] text-[#F7F1E5] leading-relaxed font-normal">${dest.honestSupportNote}</p>
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
            <p style="color: #6E846F; font-size: 11px; margin: 0; font-weight: 500;">${dest.readableLocation || dest.district}</p>
          </div>
        `, { maxWidth: 260 });

      // Click on main marker highlights main destination
      mainMarker.on("click", () => {
        document.querySelectorAll(".nearby-support-card").forEach(el => {
          el.classList.remove("border-[#4C9A45]", "bg-[#163B27]");
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
              <div style="font-size: 10px; color: #4C9A45; font-weight: 600; text-transform: uppercase;">${item.category}</div>
              <div style="font-size: 11px; color: #163B27; margin-top: 3px;">${distText}</div>
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
      el.classList.remove("border-[#4C9A45]", "bg-[#163B27]");
    });
    const card = document.querySelector(`[data-nearby-idx="${index}"]`);
    if (card) {
      card.classList.add("border-[#4C9A45]", "bg-[#163B27]");
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function closeMapModal() {
    if (!elMapModal) return;
    elMapModal.classList.add("hidden");
    elMapModal.classList.remove("flex");
    document.body.style.overflow = "";
  }

  function showToast(message) {
    let toast = document.getElementById("jh-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "jh-toast";
      toast.className = "fixed bottom-6 right-6 z-[9999] px-4 py-3 rounded-2xl bg-[#163B27] text-[#F7F1E5] text-xs font-semibold shadow-2xl border border-[rgba(76,154,69,0.4)] transition-all duration-300 transform translate-y-10 opacity-0 flex items-center space-x-2 pointer-events-none";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>🌿</span><span>${message}</span>`;
    toast.classList.remove("translate-y-10", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
    
    setTimeout(() => {
      toast.classList.remove("translate-y-0", "opacity-100");
      toast.classList.add("translate-y-10", "opacity-0");
    }, 2800);
  }

  function promptLoginModal(message) {
    let modal = document.getElementById("auth-required-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "auth-required-modal";
      modal.className = "fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm";
      document.body.appendChild(modal);
    }
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    modal.innerHTML = `
      <div class="max-w-md w-full rounded-3xl bg-[#183325] border border-[rgba(232,201,163,0.3)] p-6 sm:p-8 text-center text-[#F3EDE2] shadow-2xl space-y-4">
        <div class="w-12 h-12 mx-auto rounded-2xl bg-[#2D5A40] border border-[#E8C9A3]/40 flex items-center justify-center text-2xl shadow-md">
          🔒
        </div>
        <h3 class="text-2xl font-serif font-bold text-[#F3EDE2]">Account Required</h3>
        <p class="text-xs sm:text-sm text-[#A3B8AC] leading-relaxed">
          ${message || "Please log in or create an account to save places to your custom Trip Plan."}
        </p>
        <div class="pt-2 flex flex-col sm:flex-row gap-2.5">
          <a
            href="auth.html?redirect=${encodeURIComponent(currentPath)}"
            class="flex-1 bg-[#E8C9A3] text-[#0F241A] font-bold py-3 rounded-xl hover:bg-[#DFB283] transition-all text-xs sm:text-sm text-center shadow-lg"
          >
            Log In / Sign Up →
          </a>
          <button
            type="button"
            onclick="document.getElementById('auth-required-modal').remove()"
            class="px-4 py-3 rounded-xl border border-[rgba(232,201,163,0.3)] text-[#A3B8AC] hover:text-white text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    `;
  }

  function getTripPlanStorageKey() {
    const uid = typeof getUserId === 'function' ? getUserId() : null;
    return uid ? `jharkhandTripPlan_${uid}` : 'jharkhandTripPlan';
  }

  function addToTripPlan(dest) {
    const uid = typeof getUserId === 'function' ? getUserId() : null;
    if (!uid) {
      promptLoginModal(`Please log in or sign up to add "${dest.name}" to your Trip Plan.`);
      return;
    }

    const storageKey = getTripPlanStorageKey();
    let plan = [];
    try {
      plan = JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch (e) {
      plan = [];
    }

    const cleanId = 'underrated-' + dest.id;
    const exists = plan.some(p => p.id === cleanId || p.id === dest.id);

    if (!exists) {
      const item = {
        id: cleanId,
        name: dest.name,
        module: "underrated",
        category: dest.category || "Underrated Place",
        location: dest.readableLocation || `${dest.district}, Jharkhand`,
        image: dest.image || "",
        description: dest.hook || dest.shortDesc || "",
        link: "index.html"
      };
      plan.push(item);
      localStorage.setItem(storageKey, JSON.stringify(plan));
      localStorage.setItem("jharkhandTripPlan", JSON.stringify(plan));
      window.dispatchEvent(new Event("storage"));
      showToast(`✓ Added to My Trip Plan: ${dest.name}`);
    } else {
      showToast(`Already in My Trip Plan: ${dest.name}`);
    }
  }

  return {
    init,
    openModal,
    closeModal,
    openMapModal,
    closeMapModal,
    showToast,
    promptLoginModal,
    addToTripPlan
  };
})();
