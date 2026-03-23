let map = L.map("map").setView([50.0647, 19.945], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OSM",
}).addTo(map);
