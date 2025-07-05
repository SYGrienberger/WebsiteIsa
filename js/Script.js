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
              cornerLeft.textContent = "cafe";
              cornerRight.textContent = "+ bakkerij";
              cornerLeft.style.opacity = 1;
              cornerRight.style.opacity = 1;
              break;
            case "info":
              cornerLeft.textContent = "zuurdesem";
              cornerRight.textContent = "+ viennoiserie";
              cornerLeft.style.opacity = 1;
              cornerRight.style.opacity = 1;
              break;
            case "info-slides":
              cornerLeft.textContent = "zuurdesem";
              cornerRight.textContent = "";
              cornerLeft.style.opacity = 1;
              cornerRight.style.opacity = 0;
              break;
            case "info-text":
              cornerLeft.textContent = "";
              cornerRight.textContent = "+ viennoiserie";
              cornerLeft.style.opacity = 0;
              cornerRight.style.opacity = 1;
              break;
            case "contact":
              cornerLeft.style.opacity = 0;
              cornerRight.style.opacity = 0;
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
