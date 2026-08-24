/**
 * Jharkhand Tourism - Interactive Map & Google Maps Road Connectivity Controller
 * Features:
 * 1. Full 5-Stop Connected Tour Polyline with car driving times along all legs.
 * 2. Point-to-Point Car Driving Time & Distance Estimator with Google Maps Navigation.
 * 3. Smooth flyTo camera, district filtering, and interactive destination inspection.
 */

let jharkhandMap = null;
let mapMarkers = [];
let markerLayerGroup = null;
let circuitPolylineLayer = null;
let routeBadgesLayer = null;
let customRouteHighlightLayer = null;
let isCircuitVisible = true;

// Default Geographic Center of Jharkhand
const JHARKHAND_CENTER = {
  lat: 23.6102,
  lng: 85.2799,
  defaultZoom: 8,
  focusZoom: 12
};

/**
 * Initialize the Leaflet Map with CartoDB Voyager tiles & Route Layers
 */
function initJharkhandMap() {
  const mapElement = document.getElementById("jharkhand-map");
  if (!mapElement) return;

  // Initialize Map
  jharkhandMap = L.map("jharkhand-map", {
    center: [JHARKHAND_CENTER.lat, JHARKHAND_CENTER.lng],
    zoom: JHARKHAND_CENTER.defaultZoom,
    minZoom: 6,
    maxZoom: 17,
    zoomControl: true,
    scrollWheelZoom: false
  });

  // Enable scroll zoom on focus
  jharkhandMap.on("focus", () => jharkhandMap.scrollWheelZoom.enable());
  jharkhandMap.on("blur", () => jharkhandMap.scrollWheelZoom.disable());

  // Base Map Layer (CartoDB Voyager)
  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> | &copy; Jharkhand Tourism',
    subdomains: "abcd",
    maxZoom: 19
  }).addTo(jharkhandMap);

  markerLayerGroup = L.layerGroup().addTo(jharkhandMap);
  circuitPolylineLayer = L.layerGroup().addTo(jharkhandMap);
  routeBadgesLayer = L.layerGroup().addTo(jharkhandMap);
  customRouteHighlightLayer = L.layerGroup().addTo(jharkhandMap);

  // Render Famous Destination Markers
  renderMapMarkers(FAMOUS_DESTINATIONS);

  // Render 5-Stop Connected Road Polyline & Driving Time Badges
  renderExpeditionCircuitRoad();

  // Initialize the Point-to-Point Driving Route & Time Estimator
  initRouteEstimator();

  // Map Filter Buttons Event Listener
  setupMapFilterEvents();
}

/**
 * Render custom SVG markers onto the map with Google Maps integration
 * @param {Array} destinations
 */
function renderMapMarkers(destinations) {
  if (!markerLayerGroup) return;
  markerLayerGroup.clearLayers();
  mapMarkers = [];

  destinations.forEach((dest) => {
    // Custom Icon SVG markup
    const customIconHtml = `
      <div class="custom-map-marker">
        <div class="marker-pin">
          <div class="marker-icon-inner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        </div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: customIconHtml,
      className: "custom-leaflet-div-icon",
      iconSize: [40, 40],
      iconAnchor: [20, 38],
      popupAnchor: [0, -40]
    });

    const gmapsNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${dest.coordinates.lat},${dest.coordinates.lng}&travelmode=driving`;

    // Marker Popup HTML with Direct Google Maps Link
    const popupContent = `
      <div class="map-popup-card">
        <div class="map-popup-thumb-wrap">
          <img src="${dest.thumbnail}" alt="${dest.name}" class="map-popup-img" loading="lazy" />
          <div class="map-popup-overlay"></div>
          <span class="map-popup-type-badge">Famous Place</span>
        </div>
        <div class="map-popup-info">
          <h4 class="map-popup-title">${dest.name}</h4>
          <div class="map-popup-meta">
            <span>${dest.category}</span> • <span>${dest.district}</span>
          </div>
          <div class="map-popup-actions">
            <div class="map-popup-cta" onclick="openDestinationModal('${dest.id}')">
              <span>Details →</span>
            </div>
            <a href="${gmapsNavUrl}" target="_blank" rel="noopener noreferrer" class="map-popup-gmaps-link" title="Open Google Maps Driving Directions">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              <span>Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    `;

    const marker = L.marker([dest.coordinates.lat, dest.coordinates.lng], {
      icon: customIcon,
      title: dest.name
    }).bindPopup(popupContent);

    marker.destinationId = dest.id;
    marker.destinationData = dest;

    markerLayerGroup.addLayer(marker);
    mapMarkers.push(marker);
  });
}

/**
 * Render the full 5-stop connected expedition circuit route line on the map
 */
function renderExpeditionCircuitRoad() {
  if (!circuitPolylineLayer || !routeBadgesLayer || typeof EXPEDITION_CIRCUIT_STOPS === "undefined") return;

  circuitPolylineLayer.clearLayers();
  routeBadgesLayer.clearLayers();

  // Build sequential polyline coordinates (connecting in circuit loop)
  const circuitCoords = EXPEDITION_CIRCUIT_STOPS.map((id) => {
    const d = FAMOUS_DESTINATIONS.find((dest) => dest.id === id);
    return [d.coordinates.lat, d.coordinates.lng];
  });
  // Close loop back to starting destination
  circuitCoords.push(circuitCoords[0]);

  // Glow line background
  const glowPolyline = L.polyline(circuitCoords, {
    color: "#C5A059",
    weight: 7,
    opacity: 0.35,
    lineCap: "round",
    lineJoin: "round"
  });

  // Main dashed route line
  const mainPolyline = L.polyline(circuitCoords, {
    color: "#DFC27D",
    weight: 3.5,
    opacity: 0.9,
    dashArray: "8, 10",
    lineCap: "round",
    lineJoin: "round"
  });

  circuitPolylineLayer.addLayer(glowPolyline);
  circuitPolylineLayer.addLayer(mainPolyline);

  // Add segment badges with driving times at midpoints of adjacent legs
  for (let i = 0; i < EXPEDITION_CIRCUIT_STOPS.length; i++) {
    const fromId = EXPEDITION_CIRCUIT_STOPS[i];
    const toId = EXPEDITION_CIRCUIT_STOPS[(i + 1) % EXPEDITION_CIRCUIT_STOPS.length];

    const fromDest = FAMOUS_DESTINATIONS.find((d) => d.id === fromId);
    const toDest = FAMOUS_DESTINATIONS.find((d) => d.id === toId);

    if (fromDest && toDest) {
      // Calculate midpoint
      let midLat = (fromDest.coordinates.lat + toDest.coordinates.lat) / 2;
      let midLng = (fromDest.coordinates.lng + toDest.coordinates.lng) / 2;

      // Slight perpendicular offset to prevent badge from colliding with route pins
      const dLat = toDest.coordinates.lat - fromDest.coordinates.lat;
      const dLng = toDest.coordinates.lng - fromDest.coordinates.lng;
      const len = Math.sqrt(dLat * dLat + dLng * dLng) || 1;
      // Perpendicular vector (-dLng, dLat) offset by ~0.08 degrees
      midLat += (-dLng / len) * 0.08;
      midLng += (dLat / len) * 0.08;

      const routeInfo = getRouteInfo(fromId, toId);

      const badgeIcon = L.divIcon({
        className: "route-time-div-icon",
        html: `<div class="route-time-marker-badge">${routeInfo.durationText}</div>`,
        iconSize: [95, 22],
        iconAnchor: [47, 11]
      });

      const badgeMarker = L.marker([midLat, midLng], {
        icon: badgeIcon,
        interactive: false
      });

      routeBadgesLayer.addLayer(badgeMarker);
    }
  }
}

/**
 * Toggle visibility of the connected circuit route line and badges
 */
function toggleCircuitRouteLine() {
  const toggleBtn = document.getElementById("toggle-circuit-btn");
  if (!circuitPolylineLayer || !routeBadgesLayer) return;

  isCircuitVisible = !isCircuitVisible;

  if (isCircuitVisible) {
    jharkhandMap.addLayer(circuitPolylineLayer);
    jharkhandMap.addLayer(routeBadgesLayer);
    if (toggleBtn) toggleBtn.innerHTML = `<span>Tour Route Line: ON</span>`;
  } else {
    jharkhandMap.removeLayer(circuitPolylineLayer);
    jharkhandMap.removeLayer(routeBadgesLayer);
    if (toggleBtn) toggleBtn.innerHTML = `<span>Tour Route Line: OFF</span>`;
  }
}

/**
 * Initialize Route Estimator Dropdown Selectors
 */
function initRouteEstimator() {
  const fromSelect = document.getElementById("route-from-select");
  const toSelect = document.getElementById("route-to-select");
  if (!fromSelect || !toSelect) return;

  const optionsHtml = FAMOUS_DESTINATIONS.map(
    (dest) => `<option value="${dest.id}">${dest.name} (${dest.district})</option>`
  ).join("");

  fromSelect.innerHTML = optionsHtml;
  toSelect.innerHTML = optionsHtml;

  // Set default initial selection: Hundru Falls -> Patratu Valley
  fromSelect.value = "hundru-falls";
  toSelect.value = "patratu-valley";

  // Calculate & Display Default Route
  updateRouteCalculation();
}

function onRouteSelectorChange() {
  updateRouteCalculation();
}

function swapRouteEndpoints() {
  const fromSelect = document.getElementById("route-from-select");
  const toSelect = document.getElementById("route-to-select");
  if (!fromSelect || !toSelect) return;

  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;

  updateRouteCalculation();
}

/**
 * Calculate driving time, distance & highway route info between two destinations
 */
function getRouteInfo(fromId, toId) {
  if (fromId === toId) {
    return {
      distanceKm: 0,
      durationText: "0 mins",
      highway: "Same location selected",
      roadQuality: "Local Area",
      highlights: "You are already at this destination"
    };
  }

  // Check direct pair or reverse pair in matrix
  const key1 = `${fromId}_${toId}`;
  const key2 = `${toId}_${fromId}`;

  if (typeof CAR_DRIVING_ROUTES !== "undefined") {
    if (CAR_DRIVING_ROUTES[key1]) return CAR_DRIVING_ROUTES[key1];
    if (CAR_DRIVING_ROUTES[key2]) return CAR_DRIVING_ROUTES[key2];
  }

  // Fallback dynamic Haversine distance calculation
  const fromDest = FAMOUS_DESTINATIONS.find((d) => d.id === fromId);
  const toDest = FAMOUS_DESTINATIONS.find((d) => d.id === toId);

  if (!fromDest || !toDest) {
    return {
      distanceKm: 50,
      durationText: "1 hr 15 mins",
      highway: "via State & National Highways",
      roadQuality: "State Highway",
      highlights: "Scenic drive through Jharkhand plateau"
    };
  }

  // Haversine formula
  const R = 6371; // Earth radius in km
  const dLat = ((toDest.coordinates.lat - fromDest.coordinates.lat) * Math.PI) / 180;
  const dLng = ((toDest.coordinates.lng - fromDest.coordinates.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((fromDest.coordinates.lat * Math.PI) / 180) *
      Math.cos((toDest.coordinates.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDistKm = R * c;

  // Road winding factor (mountain/plateau roads are ~1.35x straight line)
  const roadDistKm = Math.round(straightDistKm * 1.35);
  // Average car speed on mixed terrain ~45 km/h
  const totalMinutes = Math.round((roadDistKm / 45) * 60);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const durationStr = hours > 0 ? `${hours} hr${hours > 1 ? "s" : ""} ${mins} min${mins > 1 ? "s" : ""}` : `${mins} mins`;

  return {
    distanceKm: roadDistKm,
    durationText: durationStr,
    highway: `via NH routes (${fromDest.district} to ${toDest.district})`,
    roadQuality: "Well-paved National Highway",
    highlights: `Direct scenic transit connecting ${fromDest.name} and ${toDest.name}`
  };
}

/**
 * Update the Route Estimator Result Card & Highlight path on Map
 */
function updateRouteCalculation() {
  const fromSelect = document.getElementById("route-from-select");
  const toSelect = document.getElementById("route-to-select");
  const resultCard = document.getElementById("route-result-card");
  if (!fromSelect || !toSelect || !resultCard) return;

  const fromId = fromSelect.value;
  const toId = toSelect.value;

  const fromDest = FAMOUS_DESTINATIONS.find((d) => d.id === fromId);
  const toDest = FAMOUS_DESTINATIONS.find((d) => d.id === toId);
  if (!fromDest || !toDest) return;

  const route = getRouteInfo(fromId, toId);

  // Google Maps Turn-by-Turn Driving Directions URL
  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${fromDest.coordinates.lat},${fromDest.coordinates.lng}&destination=${toDest.coordinates.lat},${toDest.coordinates.lng}&travelmode=driving`;

  resultCard.innerHTML = `
    <div class="route-stats-grid">
      <div class="route-stat-item">
        <span class="route-stat-label">Estimated Driving Time</span>
        <span class="route-stat-value">${route.durationText}</span>
      </div>
      <div class="route-stat-item">
        <span class="route-stat-label">Driving Distance</span>
        <span class="route-stat-value">${route.distanceKm} km</span>
      </div>
      <div class="route-stat-item">
        <span class="route-stat-label">Recommended Route</span>
        <span class="route-stat-detail">${route.highway}</span>
      </div>
    </div>

    <div>
      <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-gmaps-navigate" title="Open real-time navigation in Google Maps">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
        </svg>
        <span>Open in Google Maps ↗</span>
      </a>
    </div>
  `;

  // Draw custom highlighted line between selected Origin & Destination on map
  highlightSelectedRouteOnMap(fromDest, toDest);
}

/**
 * Highlight specific Origin-to-Destination line on Leaflet map
 */
function highlightSelectedRouteOnMap(fromDest, toDest) {
  if (!customRouteHighlightLayer || !jharkhandMap) return;
  customRouteHighlightLayer.clearLayers();

  if (fromDest.id === toDest.id) return;

  const coords = [
    [fromDest.coordinates.lat, fromDest.coordinates.lng],
    [toDest.coordinates.lat, toDest.coordinates.lng]
  ];

  // Glow line
  const glow = L.polyline(coords, {
    color: "#10B981",
    weight: 8,
    opacity: 0.4,
    lineCap: "round"
  });

  // Solid highlight line
  const line = L.polyline(coords, {
    color: "#34D399",
    weight: 4,
    opacity: 0.95,
    lineCap: "round"
  });

  customRouteHighlightLayer.addLayer(glow);
  customRouteHighlightLayer.addLayer(line);

  // Smoothly fit map bounds to show both endpoints
  const bounds = L.latLngBounds(coords);
  jharkhandMap.flyToBounds(bounds, {
    padding: [60, 60],
    duration: 1.2,
    maxZoom: 11
  });
}

/**
 * Focus and smooth fly-to on a specific destination
 * @param {string} destinationId
 */
function focusDestinationOnMap(destinationId) {
  const destination = FAMOUS_DESTINATIONS.find((d) => d.id === destinationId);
  if (!destination || !jharkhandMap) return;

  // Scroll to Map Section smoothly with fixed navbar offset consideration
  const mapSection = document.getElementById("map-section");
  if (mapSection) {
    const navOffset = 90;
    const elementPosition = mapSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }

  // Set as Destination in the Estimator
  const toSelect = document.getElementById("route-to-select");
  if (toSelect && toSelect.value !== destinationId) {
    toSelect.value = destinationId;
    updateRouteCalculation();
  }

  // Smooth camera flyTo
  setTimeout(() => {
    jharkhandMap.flyTo(
      [destination.coordinates.lat, destination.coordinates.lng],
      JHARKHAND_CENTER.focusZoom,
      {
        duration: 1.4,
        easeLinearity: 0.25
      }
    );

    // Open matching marker popup
    const targetMarker = mapMarkers.find((m) => m.destinationId === destinationId);
    if (targetMarker) {
      setTimeout(() => targetMarker.openPopup(), 1200);
    }
  }, 350);
}

/**
 * Reset map view back to entire Jharkhand overview
 */
function resetJharkhandMapView() {
  if (!jharkhandMap) return;
  jharkhandMap.closePopup();
  jharkhandMap.flyTo(
    [JHARKHAND_CENTER.lat, JHARKHAND_CENTER.lng],
    JHARKHAND_CENTER.defaultZoom,
    {
      duration: 1.2
    }
  );
}

/**
 * Setup filter chip event listeners on the map
 */
function setupMapFilterEvents() {
  const filterButtons = document.querySelectorAll(".map-filter-btn");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterType = btn.dataset.filter.toLowerCase();
      if (filterType === "all") {
        renderMapMarkers(FAMOUS_DESTINATIONS);
      } else if (filterType === "waterfalls") {
        const filtered = FAMOUS_DESTINATIONS.filter((d) =>
          d.category.toLowerCase().includes("waterfall")
        );
        renderMapMarkers(filtered);
      } else if (filterType === "wildlife") {
        const filtered = FAMOUS_DESTINATIONS.filter((d) =>
          d.category.toLowerCase().includes("wildlife") || d.category.toLowerCase().includes("nature")
        );
        renderMapMarkers(filtered);
      } else if (filterType === "spiritual") {
        const filtered = FAMOUS_DESTINATIONS.filter((d) =>
          d.category.toLowerCase().includes("spiritual") || d.category.toLowerCase().includes("heritage")
        );
        renderMapMarkers(filtered);
      } else if (filterType === "scenic") {
        const filtered = FAMOUS_DESTINATIONS.filter((d) =>
          d.category.toLowerCase().includes("scenic") || d.category.toLowerCase().includes("lake") || d.category.toLowerCase().includes("mountain")
        );
        renderMapMarkers(filtered);
      }
    });
  });
}

// Export functions to global scope
window.initJharkhandMap = initJharkhandMap;
window.focusDestinationOnMap = focusDestinationOnMap;
window.resetJharkhandMapView = resetJharkhandMapView;
window.toggleCircuitRouteLine = toggleCircuitRouteLine;
window.onRouteSelectorChange = onRouteSelectorChange;
window.swapRouteEndpoints = swapRouteEndpoints;

