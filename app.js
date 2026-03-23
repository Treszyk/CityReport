const cameraInput = document.getElementById('camera-input');
const photoPreview = document.getElementById('photo-preview');
const photoPreviewContainer = document.getElementById('photo-preview-container');
const cameraPlaceholder = document.getElementById('camera-placeholder');
const mapSection = document.getElementById('map-section');

let map = null;

cameraInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            photoPreview.src = event.target.result;
            photoPreviewContainer.classList.remove('d-none');
            cameraPlaceholder.classList.add('d-none');
            getLocation();
        };
        reader.readAsDataURL(file);
    }
});

function getLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            document.getElementById('coords-text').textContent = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
            mapSection.classList.remove('d-none');
            initMap(lat, lng);
        });
    }
}

function initMap(lat, lng) {
    if (map) return;
    map = L.map('map').setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker([lat, lng]).addTo(map);
}
if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js'); }); }
