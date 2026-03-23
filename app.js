const cameraInput = document.getElementById('camera-input');
const photoPreview = document.getElementById('photo-preview');
const photoPreviewContainer = document.getElementById('photo-preview-container');
const cameraPlaceholder = document.getElementById('camera-placeholder');
const mapSection = document.getElementById('map-section');
const shareSection = document.getElementById('share-section');
const shareBtn = document.getElementById('share-btn');

let currentCoords = null;
let currentPhoto = null;
let map = null;

cameraInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        currentPhoto = file;
        const reader = new FileReader();
        reader.onload = (event) => {
            photoPreview.src = event.target.result;
            photoPreviewContainer.classList.remove('d-none');
            cameraPlaceholder.classList.add('d-none');
            document.getElementById('camera-btn-label').classList.add('d-none');
            getLocation();
        };
        reader.readAsDataURL(file);
    }
});

function getLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            currentCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
            document.getElementById('coords-text').textContent = `${currentCoords.lat.toFixed(6)}, ${currentCoords.lng.toFixed(6)}`;
            mapSection.classList.remove('d-none');
            initMap(currentCoords.lat, currentCoords.lng);
            shareSection.classList.remove('d-none');
        });
    }
}

function initMap(lat, lng) {
    if (map) return;
    map = L.map('map').setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker([lat, lng]).addTo(map);
}

shareBtn.addEventListener('click', async () => {
    try {
        await navigator.share({
            title: 'CityReport',
            text: `Zgłoszenie: https://www.google.com/maps?q=${currentCoords.lat},${currentCoords.lng}`
        });
    } catch (err) {}
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js'); });
}
