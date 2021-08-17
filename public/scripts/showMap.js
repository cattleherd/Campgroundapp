
mapboxgl.accessToken = mapbox_token;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: camp.geoJSON.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});

const popup = new mapboxgl.Popup({ closeOnClick: false })
.setLngLat(camp.geoJSON.coordinates)
.setHTML(`<h3>${camp.location}</h3>`)
.addTo(map);

const marker = new mapboxgl.Marker()
.setLngLat(camp.geoJSON.coordinates)
.setPopup(popup)
.addTo(map);


