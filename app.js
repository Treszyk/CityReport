const cameraInput = document.getElementById("camera-input");
const photoPreview = document.getElementById("photo-preview");
const photoPreviewContainer = document.getElementById("photo-preview-container");
const cameraPlaceholder = document.getElementById("camera-placeholder");
const mapSection = document.getElementById("map-section");
const shareSection = document.getElementById("share-section");
const shareBtn = document.getElementById("share-btn");

let currentCoords = null;
let currentPhoto = null;
let map = null;

cameraInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    currentPhoto = file;
    const reader = new FileReader();
    reader.onload = (event) => {
      photoPreview.src = event.target.result;
      photoPreviewContainer.classList.remove("d-none");
      cameraPlaceholder.classList.add("d-none");
      document.getElementById("camera-btn-label").classList.add("d-none");
      shareSection.classList.remove("d-none");
      getLocation();
    };
    reader.readAsDataURL(file);
  }
});

function getLocation() {
  document.getElementById("map-loader").classList.remove("d-none");
  mapSection.classList.remove("d-none");

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        document.getElementById("coords-text").textContent =
          `${currentCoords.lat.toFixed(6)}, ${currentCoords.lng.toFixed(6)}`;
        initMap(currentCoords.lat, currentCoords.lng);
      },
      (error) => {
        document.getElementById("map-loader").classList.add("d-none");
        alert("GPS Error: " + error.message);
      },
      { enableHighAccuracy: true },
    );
  }
}

function initMap(lat, lng) {
  if (map) return;
  map = L.map("map").setView([lat, lng], 15);
  const tiles = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "© OSM",
    },
  ).addTo(map);

  tiles.on("load", () => {
    document.getElementById("map-loader").classList.add("d-none");
  });

  L.marker([lat, lng]).addTo(map);
}

shareBtn.addEventListener("click", async () => {
  if (!currentPhoto) return;

  const shareData = {
    title: "CityReport",
    files: [new File([currentPhoto], "problem.jpg", { type: "image/jpeg" })],
  };

  if (currentCoords) {
    shareData.text = `Zgłoszenie z CityReport: https://www.google.com/maps?q=${currentCoords.lat},${currentCoords.lng}`;
  } else {
    shareData.text = "Zgłoszenie z CityReport (brak lokalizacji GPS)";
  }

  try {
    if (navigator.canShare && navigator.canShare({ files: shareData.files })) {
      await navigator.share(shareData);
    } else {
      await navigator.share({
        title: shareData.title,
        text: shareData.text,
      });
    }
  } catch (err) {}
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

function updateOnlineStatus() {
  const offlineBadge = document.getElementById("offline-badge");
  if (navigator.onLine) {
    offlineBadge.classList.add("d-none");
  } else {
    offlineBadge.classList.remove("d-none");
  }
}

updateOnlineStatus();

document.getElementById("cancel-btn").addEventListener("click", () => {
  photoPreviewContainer.classList.add("d-none");
  mapSection.classList.add("d-none");
  shareSection.classList.add("d-none");
  cameraPlaceholder.classList.remove("d-none");
  document.getElementById("camera-btn-label").classList.remove("d-none");
  document.getElementById("coords-text").textContent = "";
  if (map) {
    map.remove();
    map = null;
  }
});
