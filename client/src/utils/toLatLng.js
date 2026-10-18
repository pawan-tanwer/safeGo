export const toLatLng = (loc) => {
  return loc?.coordinates
    ? { lat: loc.coordinates[1], lng: loc.coordinates[0] }
    : null;
};