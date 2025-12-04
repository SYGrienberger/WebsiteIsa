// --------------------------------------------------
// CONFIGURATIE: Hier kun je je foto's aanpassen
// --------------------------------------------------
const slideImages = [
  {
    src: "Afbeeldingen/foto1.jpg",
    alt: "Verse broden en taart in de vitrine van Boter + Zout bakkerij",
  },
  {
    src: "Afbeeldingen/foto2.jpg",
    alt: "Handgemaakte taarten en gebak in de bakkerij",
  },
  {
    src: "Afbeeldingen/foto3.jpg",
    alt: "Interieur van Boter + Zout met gezellige zitplaatsen",
  },
  {
    src: "Afbeeldingen/foto4.jpg",
    alt: "Lekker belegd broodje, ideaal voor lunch bij Boter + Zout",
  },
  {
    src: "Afbeeldingen/foto5.jpg",
    alt: "Barista maakt een heerlijke cappuccino bij Boter + Zout",
  },
  {
    src: "Afbeeldingen/foto6.jpg",
    alt: "Gezellige sfeer in de bakkerij met klanten die genieten",
  },
  {
    src: "Afbeeldingen/foto7.jpg",
    alt: "Versgebakken croissants en zoet gebak in de vitrine",
  },
  {
    src: "Afbeeldingen/foto8.jpg",
    alt: "Bakker aan het werk in de keuken van Boter + Zout",
  },
  {
    src: "Afbeeldingen/foto9.jpg",
    alt: "Assortiment van ambachtelijke broden bij Boter + Zout",
  },
  {
    src: "Afbeeldingen/foto10.jpg",
    alt: "Klant geniet van een kop koffie en een gebakje",
  },
];

// --------------------------------------------------
// LOGICA (Hier hoef je niets aan te passen)
// --------------------------------------------------

let slideIndex = 1;

// Zodra de pagina geladen is, genereren we de HTML en starten we de show
document.addEventListener("DOMContentLoaded", () => {
  generateSlides();
  showSlides(slideIndex);
  setupNavigation();
});

function generateSlides() {
  const containers = [
    document.querySelector(".slideshow-container"), // Desktop container
    document.querySelector(".slideshow-container-mobile"), // Mobiele container
  ];

  containers.forEach((container) => {
    if (!container) return; // Veiligheidscheck als container niet bestaat

    // Maak de container eerst leeg
    container.innerHTML = "";

    // Voeg voor elke foto in de lijst HTML toe
    slideImages.forEach((image) => {
      const slideDiv = document.createElement("div");
      slideDiv.className = "slide fade";

      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.alt;

      // Voor mobiel willen we dat hij de hele ruimte vult, desktop ook
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";

      slideDiv.appendChild(img);
      container.appendChild(slideDiv);
    });
  });
}

function setupNavigation() {
  const prevBtn = document.querySelector(".navigation-container .prev");
  const nextBtn = document.querySelector(".navigation-container .next");

  const prevBtnMobile = document.querySelector(
    ".navigation-container-mobile .prev"
  );
  const nextBtnMobile = document.querySelector(
    ".navigation-container-mobile .next"
  );

  if (prevBtn) prevBtn.onclick = () => plusSlides(-1);
  if (nextBtn) nextBtn.onclick = () => plusSlides(1);

  if (prevBtnMobile) prevBtnMobile.onclick = () => plusSlides(-1);
  if (nextBtnMobile) nextBtnMobile.onclick = () => plusSlides(1);
}

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  updateContainerSlides(".slideshow-container", n);
  updateContainerSlides(".slideshow-container-mobile", n);
}

function updateContainerSlides(selector, n) {
  const container = document.querySelector(selector);
  if (!container) return;

  const slides = container.getElementsByClassName("slide");
  if (slides.length === 0) return;

  // Reset index als we buiten de grenzen gaan (looping effect)
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  // Verberg alle slides
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  // Toon de juiste slide (slideIndex - 1 omdat arrays bij 0 beginnen)
  slides[slideIndex - 1].style.display = "block";
}
