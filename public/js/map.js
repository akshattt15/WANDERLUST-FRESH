document.addEventListener("DOMContentLoaded", () => {
  // ✅ Access the values passed from show.ejs
  const mapToken = window.mapboxToken;
  const listing = window.listingData;

  if (!mapToken || !listing.geometry || !listing.geometry.coordinates) {
    console.error("❌ Missing map token or coordinates.");
    return;
  }

  // ✅ Coordinates must be [longitude, latitude]
  const coordinates = listing.geometry.coordinates;

  // ✅ Initialize Mapbox
  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: coordinates,
    zoom: 9
  });

  // ✅ Add zoom & rotation controls
  map.addControl(new mapboxgl.NavigationControl());

  // ✅ Add marker + popup
  new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h6>${listing.title}</h6><p>${listing.location}</p>`)
    )
    .addTo(map);

  console.log("🗺️ Map initialized at:", coordinates);
});
