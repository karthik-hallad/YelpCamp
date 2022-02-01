mapboxgl.accessToken = mapbox;
let loc=c
console.log(loc.geometry.coordinates)
 if(loc.geometry.coordinates.length){
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: loc.geometry.coordinates,
    zoom: 9 // starting zoom
  });
  const marker1 = new mapboxgl.Marker()
  .setLngLat(loc.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
      `<h3>${loc.name}</h3><p>${loc.location}</p>`
    )
  )
  .addTo(map);
 }else{
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [ -110.68000896069303,44.436590118210766],
    zoom: 9 // starting zoom
  });
 }
