import L from "leaflet";

export const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.6.0/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.6.0/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const carIcon = L.divIcon({
  html: `<div style="font-size:28px;line-height:1;">🚗</div>`,
  className: "",          // yeh zaroori hai, warna Leaflet ka default white box aa jaata hai
  iconSize: [28, 28],
  iconAnchor: [14, 14],   // car ka center, pin ki tarah neeche ka point nahi
});