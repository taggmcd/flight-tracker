let flightCount = document.getElementById('flightCount');

let apiUrl =
  'https://api.airplanes.live/v2/point/40.76066778224577/-111.89874212184233/50';

// Setup event listenr to run our code once the document is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize and add the map
  let map;

  async function initMap() {
    // The location of Uluru
    const position = { lat: 40.76066778224577, lng: -111.89874212184233 };
    // Request needed libraries.

    const { Map } = await google.maps.importLibrary('maps');
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

    // The map
    map = new Map(document.getElementById('map'), {
      zoom: 9,
      center: position,
      mapId: 'flight_map',
    });

    //  Call the API to get the data
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        data.ac.forEach((flight) => {
          if (typeof flight.flight != 'undefined') {
            // Custom image for each flight
            const planeImg = document.createElement('img');
            planeImg.src = 'images/airplane.png';

            // The marker, positioned at each flights lat/lon
            const marker = new AdvancedMarkerElement({
              map: map,
              position: { lat: flight.lat, lng: flight.lon },
              title: `Flight: ${flight.flight}`,
              content: planeImg,
            });

            let reg = flight.r;
            if (typeof flight.r === 'undefined') {
              reg = 'N/A';
            }
            let owner = flight.ownOp;
            if (flight.ownOp === 'undefined') {
              owner = 'N/A';
            }
            let type = flight.desc;
            if (flight.desc === 'undefined') {
              type = 'N/A';
            }
            let year = flight.year;
            if (flight.year === 'undefined') {
              year = 'N/A';
            }
            let speed = `${flight.gs}kts`;
            if (flight.gs === 'undefined') {
              speed = 'N/A';
            }
            let alt = `${flight.alt_baro}ft`;
            if (flight.alt_baro === 'ground') {
              alt = flight.alt_baro;
            }

            const contentString = `
          <h1>Flight: ${flight.flight} Details</h1>
          <p>
          Registration: ${reg}<br>
          Owner: ${owner}<br>
          Aircraft Type: ${type}<br>
          Aircraft Year: ${year}<br>
          Ground Speed: ${speed}<br>
          Altitude: ${alt}
          </p>
          `;
            const infowindow = new google.maps.InfoWindow({
              content: contentString,
              ariaLabel: `Flight: ${flight.flight}`,
            });

            marker.addListener('gmp-click', () => {
              infowindow.open({
                anchor: marker,
                map,
              });
            });
          }
        });

        document.getElementById(
          'flightCount'
        ).innerText = `There are ${data.ac.length} flights around Salt Lake City, UT.`;
      })
      .catch((error) => {
        console.error('Error fetching flight data:', error);
      });
  }

  initMap();
});
