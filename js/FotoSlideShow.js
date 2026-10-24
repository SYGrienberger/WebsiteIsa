// --------------------------------------------------
// CONFIGURATIE: Hier kun je je foto's aanpassen
// --------------------------------------------------
const slideImages = [
  {
    src: "Afbeeldingen/foto1.webp",
    alt: "Verse broden en taart in de vitrine van Boter + Zout bakkerij",
  },
  {
    src: "Afbeeldingen/foto2.webp",
    alt: "Handgemaakte taarten en gebak in de bakkerij",
  },
  {
    src: "Afbeeldingen/foto3.webp",
    alt: "Interieur van Boter + Zout met gezellige zitplaatsen",
  },
  {
    src: "Afbeeldingen/foto4.webp",
    alt: "Lekker belegd broodje, ideaal voor lunch bij Boter + Zout",
  },
  {
    src: "Afbeeldingen/foto5.webp",
    alt: "Barista maakt een heerlijke cappuccino bij Boter + Zout",
  },
  {
    src: "Afbeeldingen/foto6.webp",
    alt: "Gezellige sfeer in de bakkerij met klanten die genieten",
  },
  {
    src: "Afbeeldingen/foto7.webp",
    alt: "Versgebakken croissants en zoet gebak in de vitrine",
  },
  {
    src: "Afbeeldingen/foto8.webp",
    alt: "Bakker aan het werk in de keuken van Boter + Zout",
  },
  {
    src: "Afbeeldingen/foto9.webp",
    alt: "Assortiment van ambachtelijke broden bij Boter + Zout",
  },
  {
    src: "Afbeeldingen/foto10.webp",
    alt: "Klant geniet van een kop koffie en een gebakje",
  },
];

// --------------------------------------------------
// LOGICA (Hier hoef je niets aan te passen)
// --------------------------------------------------

// Zodra de pagina geladen is, bouwen we een slideshow per container
document.addEventListener("DOMContentLoaded", () => {
  maakSlideshow(".slideshow-container", ".navigation-container");
  maakSlideshow(".slideshow-container-mobile", ".navigation-container-mobile");
});

function maakSlideshow(containerSelector, navigatieSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return; // Veiligheidscheck als container niet bestaat

  const aantal = slideImages.length;

  // Strook met alle foto's, plus een kopie van de laatste vooraan en de
  // eerste achteraan, zodat doorlopen van 10 naar 1 (en terug) naadloos schuift
  const strook = document.createElement("div");
  strook.className = "slide-track";
  const volgorde = [slideImages[aantal - 1], ...slideImages, slideImages[0]];
  volgorde.forEach((image, i) => {
    const slideDiv = document.createElement("div");
    slideDiv.className = "slide";
    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.draggable = false;
    if (i > 1) img.loading = "lazy"; // eerste foto direct, de rest wanneer nodig
    if (i === 0 || i === aantal + 1) slideDiv.setAttribute("aria-hidden", "true");
    slideDiv.appendChild(img);
    strook.appendChild(slideDiv);
  });
  container.innerHTML = "";
  container.appendChild(strook);

  let positie = 1; // 1 t/m aantal zijn de echte foto's
  let sleepAfstand = 0;

  function zetPositie(metAnimatie) {
    strook.classList.toggle("slepen", !metAnimatie);
    strook.style.transform = `translateX(calc(${-positie * 100}% + ${sleepAfstand}px))`;
  }

  // Staan we (nog) op een kopie, spring dan onzichtbaar naar de echte foto
  function naarOrigineel() {
    if (positie !== 0 && positie !== aantal + 1) return;
    positie = positie === 0 ? aantal : 1;
    zetPositie(false);
    strook.getBoundingClientRect(); // forceer de sprong voordat we verder animeren
  }

  function gaNaar(stap) {
    naarOrigineel(); // bij snel klikken, voordat de vorige animatie klaar is
    positie += stap;
    sleepAfstand = 0;
    zetPositie(true);
  }

  // Na het schuiven naar een kopie: onzichtbaar terugspringen naar het origineel
  strook.addEventListener("transitionend", naarOrigineel);

  // Plus en min
  const navigatie = document.querySelector(navigatieSelector);
  if (navigatie) {
    navigatie.querySelector(".prev").addEventListener("click", () => gaNaar(-1));
    navigatie.querySelector(".next").addEventListener("click", () => gaNaar(1));
  }

  // Swipen (touch) en slepen (muis): de foto volgt je vinger
  let startX = 0;
  let startY = 0;
  let startTijd = 0;
  let richting = null; // "horizontaal", "verticaal" of null (nog onbekend)

  strook.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    naarOrigineel();
    startX = e.clientX;
    startY = e.clientY;
    startTijd = Date.now();
    richting = null;
    strook.setPointerCapture(e.pointerId);
  });

  strook.addEventListener("pointermove", (e) => {
    if (!strook.hasPointerCapture(e.pointerId)) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (richting === null && Math.abs(dx) + Math.abs(dy) > 8) {
      richting = Math.abs(dx) > Math.abs(dy) ? "horizontaal" : "verticaal";
    }
    if (richting !== "horizontaal") return;
    sleepAfstand = dx;
    zetPositie(false);
  });

  function stopSlepen(e) {
    if (!strook.hasPointerCapture(e.pointerId)) return;
    strook.releasePointerCapture(e.pointerId);
    if (richting !== "horizontaal") return;
    const breedte = container.clientWidth;
    const snel = Math.abs(sleepAfstand) / (Date.now() - startTijd) > 0.5; // korte flick
    if (Math.abs(sleepAfstand) > breedte * 0.2 || (snel && Math.abs(sleepAfstand) > 20)) {
      gaNaar(sleepAfstand < 0 ? 1 : -1);
    } else {
      gaNaar(0); // niet ver genoeg: terugveren
    }
  }

  strook.addEventListener("pointerup", stopSlepen);
  strook.addEventListener("pointercancel", stopSlepen);

  zetPositie(false);
}
