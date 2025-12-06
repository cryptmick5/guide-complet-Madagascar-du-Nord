document.addEventListener('DOMContentLoaded', function () {
    const map = L.map('map').setView([-12.5, 49.3], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const markers = L.markerClusterGroup();

    LIEUX_DATA.forEach(lieu => {
        if (lieu.lat && lieu.lng && lieu.nom) {
            const marker = L.marker([lieu.lat, lieu.lng]);
            marker.bindPopup(getPopupContent(lieu));
            markers.addLayer(marker);
        }
    });

    map.addLayer(markers);
});
