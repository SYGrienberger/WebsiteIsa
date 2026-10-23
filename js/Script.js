// Openingstijden: pas hier aan (ook in de JSON-LD in index.html bijwerken)
const openingstijden = {
  dagen: "wo \u2013 zo",
  tijden: "09:00 \u2013 16:00",
  extra: "tweede paasdag ook geopend",
};

document.addEventListener("DOMContentLoaded", () => {
  ["openingstijden-desktop", "openingstijden-mobiel"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = `Openingstijden:<br />${openingstijden.dagen}<br />${openingstijden.tijden}<br />${openingstijden.extra}`;
    }
  });
  // Alle code hier binnen
  const contactLink = document.querySelector(".contact-link");
  if (contactLink) {
    contactLink.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
    });
  }
  // 1. Viewport fix
  const setVh = () => {
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`
    );
  };
  window.addEventListener("resize", setVh);
  setVh();

  // 2. Google Maps pas laden na klik (geen cookies van Google tot die tijd)
  const kaartKnop = document.getElementById("kaart-laden");
  if (kaartKnop) {
    kaartKnop.addEventListener("click", () => {
      const kaart = document.createElement("iframe");
      kaart.src =
        "https://www.google.com/maps?q=Boter%20%2B%20Zout%2C%20Wielakkerstraat%2014%2C%206811%20AJ%20Arnhem&z=16&output=embed";
      kaart.title = "Locatie van Boter + Zout op Google Maps";
      kaart.loading = "lazy";
      kaart.referrerPolicy = "no-referrer-when-downgrade";
      kaart.allowFullscreen = true;
      kaartKnop.replaceWith(kaart);
    });
  }

  // 3. Sticky text
  const cornerLeft = document.getElementById("corner-left");
  const cornerRight = document.getElementById("corner-right");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const screenId = entry.target.id;
          switch (screenId) {
            case "home":
              cornerLeft.textContent = "kantine";
              cornerRight.textContent = "+ bakkerij";
              cornerLeft.style.opacity = 1;
              cornerRight.style.opacity = 1;
              checkIfCornerLiftIsAllowed();
              break;
            case "info":
              cornerLeft.textContent = "zuurdesem";
              cornerRight.textContent = "+ viennoiserie";
              cornerLeft.style.opacity = 1;
              cornerRight.style.opacity = 1;
              checkIfCornerLiftIsAllowed();
              break;
            case "info-slides":
              cornerLeft.textContent = "";
              cornerRight.textContent = "";
              cornerLeft.style.opacity = 0;
              cornerRight.style.opacity = 0;
              checkIfCornerLiftIsAllowed();
              break;
            case "info-text":
              cornerLeft.textContent = "";
              cornerRight.textContent = "";
              cornerLeft.style.opacity = 0;
              cornerRight.style.opacity = 0;
              checkIfCornerLiftIsAllowed();
              break;
            case "locatie":
            case "contact":
              cornerLeft.style.opacity = 0;
              cornerRight.style.opacity = 0;
              checkIfCornerLiftIsAllowed();
              break;
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  document
    .querySelectorAll(".screen")
    .forEach((screen) => observer.observe(screen));
});

function checkIfCornerLiftIsAllowed() {
  const cornerLeft = document.getElementById("corner-left");
  if (window.innerWidth < 400 && cornerLeft.textContent == "kantine") {
    cornerLeft.classList.add("corner-lifted");
  } else {
    cornerLeft.classList.remove("corner-lifted");
  }
}

function openMenu(type) {
  const overlay = document.getElementById("side-menu-overlay");
  const drinksSection = document.getElementById("menu-drinks");
  const foodSection = document.getElementById("menu-food");

  // Reset: verberg alles eerst
  drinksSection.classList.remove("active");
  foodSection.classList.remove("active");

  // Toon het menu
  overlay.classList.add("open");

  // Toon de juiste sectie (of allebei als je dat liever hebt, maar dit is netter)
  if (type === "drinks") {
    drinksSection.classList.add("active");
  } else if (type === "food") {
    foodSection.classList.add("active");
  } else {
    // Fallback: toon beide als er geen type is meegegeven
    drinksSection.classList.add("active");
    foodSection.classList.add("active");
  }
}

function closeMenu() {
  const overlay = document.getElementById("side-menu-overlay");
  overlay.classList.remove("open");
}

// Sluit menu als je op de donkere achtergrond klikt (buiten het menu)
document
  .getElementById("side-menu-overlay")
  .addEventListener("click", function (e) {
    if (e.target === this) {
      closeMenu();
    }
  });

// Sluit menu met Escape toets
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeMenu();
  }
});
