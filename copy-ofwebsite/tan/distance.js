// Geolocation distance calculation using the Haversine formula
// Calculates distance in kilometers between two sets of GPS coordinates.

window.FootprintJH = window.FootprintJH || {};

window.FootprintJH.distance = (function () {
  const EARTH_RADIUS_KM = 6371;

  /**
   * Convert degrees to radians.
   * @param {number} degrees 
   * @returns {number}
   */
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Calculate the great-circle distance between two points on the Earth's surface.
   * @param {number} lat1 Latitude of point 1
   * @param {number} lon1 Longitude of point 1
   * @param {number} lat2 Latitude of point 2
   * @param {number} lon2 Longitude of point 2
   * @returns {number} Distance in kilometers
   */
  function calculateHaversine(lat1, lon1, lat2, lon2) {
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const rLat1 = toRadians(lat1);
    const rLat2 = toRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
              
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return EARTH_RADIUS_KM * c;
  }

  return {
    calculateHaversine
  };
})();
