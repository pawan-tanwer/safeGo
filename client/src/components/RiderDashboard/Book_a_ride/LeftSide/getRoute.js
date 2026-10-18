export async function getRoute(pickup, destination) {
  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`
    );
    const data = await res.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No route found");
    }

    // OSRM [lng, lat] deta hai, Leaflet ko [lat, lng] chahiye — swap karna zaroori hai
    const coordinates = data.routes[0].geometry.coordinates.map(
      ([lng, lat]) => [lat, lng]
    );

    const distanceKm = (data.routes[0].distance / 1000).toFixed(1);
    const durationMin = Math.round(data.routes[0].duration / 60);

    return { coordinates, distanceKm, durationMin };
  } catch (error) {
    console.error("Route fetch failed:", error);
    // fallback — seedha straight line pickup se destination tak
    return {
      coordinates: [
        [pickup.lat, pickup.lng],
        [destination.lat, destination.lng],
      ],
      distanceKm: null,
      durationMin: null,
    };
  }
}