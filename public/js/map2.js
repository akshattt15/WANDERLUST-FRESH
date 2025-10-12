document.addEventListener("DOMContentLoaded", () => {
  const mapToken = window.mapboxToken;
  const initialCoords = window.initialCoordinates;

  mapboxgl.accessToken = mapToken;

  const mapContainer = document.getElementById("map");

  // Initialize map
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: initialCoords,
    zoom: 12
  });

  // Draggable marker
  const marker = new mapboxgl.Marker({ color: "red", draggable: true })
    .setLngLat(initialCoords)
    .addTo(map);

  // Form inputs
  const locationInput = document.querySelector("input[name='location']");
  const lngInput = document.getElementById("geometry-lng");
  const latInput = document.getElementById("geometry-lat");

  // Update marker when location input changes
  locationInput.addEventListener("change", async () => {
    if (!locationInput.value.trim()) return;

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationInput.value)}.json?access_token=${mapToken}`
    );
    const data = await response.json();

    if (data.features.length) {
      const [lng, lat] = data.features[0].center;
      marker.setLngLat([lng, lat]);
      map.flyTo({ center: [lng, lat], zoom: 14 });
      lngInput.value = lng;
      latInput.value = lat;
    }
  });

  // Update location input & hidden coords when marker is dragged
  marker.on("dragend", async () => {
    const { lng, lat } = marker.getLngLat();
    lngInput.value = lng;
    latInput.value = lat;

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapToken}`
    );
    const data = await response.json();
    if (data.features.length) locationInput.value = data.features[0].place_name;
  });

  // Responsive map height
  const resizeMap = () => {
    const width = mapContainer.parentElement.offsetWidth;
    mapContainer.style.height = width > 768 ? "300px" : "250px";
    map.resize();
  };
  window.addEventListener("resize", resizeMap);
  resizeMap();
});
