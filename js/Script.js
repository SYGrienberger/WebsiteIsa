document.addEventListener("DOMContentLoaded", () => {
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

  // 2. Sticky text
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
