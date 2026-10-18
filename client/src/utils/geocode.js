  
  
  export async function reverseGeocode(lat, lng) {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
    );
    if (!res.ok) throw new Error("Reverse geocode request failed");
    const data = await res.json();
    return data.display_name;
  }

  export async function searchPlaces(query) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in`
  );
  if (!res.ok) throw new Error("Place search request failed");
  return res.json();
}