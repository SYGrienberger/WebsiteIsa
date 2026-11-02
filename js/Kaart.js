// --------------------------------------------------
// KAART: Google Maps in de kleuren van de website
// --------------------------------------------------

// Sleutel uit de Google Cloud Console (beperkt tot boterzout.nl, zie CLAUDE.md)
const GOOGLE_MAPS_SLEUTEL = "AIzaSyBS43uSFyPVq1Tdbo4Dacoa6xTH8hxAW2E";

const KAART_LOCATIE = { lat: 51.9813, lng: 5.9084 }; // Wielakkerstraat 14
const KAART_ADRES = "Boter + Zout, Wielakkerstraat 14, 6811 DB Arnhem";

// Kleuren uit css/styles.css: beige achtergrond, blauwe straten, geen labels
const KAART_STIJL = [
  { elementType: "geometry", stylers: [{ color: "#f5e3b3" }] },
  { elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#f0dba5" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#ead497" }] },
  { featureType: "landscape.man_made", elementType: "geometry.fill", stylers: [{ color: "#f1dca7" }] },
  { featureType: "landscape.man_made", elementType: "geometry.stroke", stylers: [{ color: "#e2c684" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#7ebaf5" }] },
  { featureType: "road.arterial", elementType: "geometry.fill", stylers: [{ color: "#59a0e5" }] },
  { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#59a0e5" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#bcd9f5" }] },
];

// Roestrode speld (zelfde vorm als eerder op de site)
const KAART_SPELD =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="30" height="40">' +
      '<path fill="#ac3723" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z"/>' +
      '<circle fill="#faf3e0" cx="12" cy="12" r="5"/></svg>'
  );

const kaartElement = document.getElementById("kaart");

// Terugval: de gewone ingesloten kaart (als de sleutel niet werkt of Google niet laadt)
function toonGewoneKaart() {
  if (!kaartElement || kaartElement.dataset.terugval) return;
  kaartElement.dataset.terugval = "ja";
  kaartElement.innerHTML =
    '<iframe src="https://www.google.com/maps?q=' +
    encodeURIComponent(KAART_ADRES) +
    '&amp;z=16&amp;output=embed" title="Locatie van Boter + Zout op Google Maps"' +
    ' referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
}

// Google roept dit aan als de sleutel ongeldig is of dit domein niet mag
window.gm_authFailure = toonGewoneKaart;

window.initKaart = function () {
  if (!kaartElement || kaartElement.dataset.terugval) return;
  const kaart = new google.maps.Map(kaartElement, {
    center: KAART_LOCATIE,
    zoom: 16,
    styles: KAART_STIJL,
    disableDefaultUI: true,
    zoomControl: true,
    clickableIcons: false,
    gestureHandling: "cooperative", // scrollen over de pagina zoomt de kaart niet
    backgroundColor: "#f5e3b3",
  });

  const speld = new google.maps.Marker({
    position: KAART_LOCATIE,
    map: kaart,
    title: KAART_ADRES,
    icon: {
      url: KAART_SPELD,
      scaledSize: new google.maps.Size(30, 40),
      anchor: new google.maps.Point(15, 40),
    },
  });

  // Klik op de speld: route in Google Maps
  speld.addListener("click", () => {
    window.open(
      "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(KAART_ADRES),
      "_blank",
      "noopener"
    );
  });
};

function laadGoogleMaps() {
  if (!GOOGLE_MAPS_SLEUTEL) {
    toonGewoneKaart();
    return;
  }
  const script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=" +
    GOOGLE_MAPS_SLEUTEL +
    "&callback=initKaart&loading=async&language=nl&region=NL";
  script.async = true;
  script.onerror = toonGewoneKaart;
  document.head.appendChild(script);
}

// Pas laden als je in de buurt van de contactgegevens bent (scheelt laadtijd)
if (kaartElement) {
  const kaartObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        kaartObserver.disconnect();
        laadGoogleMaps();
      }
    },
    { root: document.querySelector(".scroll-wrapper"), rootMargin: "100% 0px" }
  );
  kaartObserver.observe(kaartElement);
}
