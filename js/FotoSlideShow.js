document.addEventListener("DOMContentLoaded", () => {
  const allSlideshows = document.querySelectorAll(
    ".slideshow-container, .slideshow-container-mobile"
  );

  allSlideshows.forEach((container) => {
    let slideIndex = 0;
    const slides = container.querySelectorAll(".slide");
    const nextBtn = container.parentElement.querySelector(".next");
    const prevBtn = container.parentElement.querySelector(".prev");
    let slideInterval;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.style.display = i === index ? "block" : "none";
      });
    }

    function nextSlide() {
      slideIndex = (slideIndex + 1) % slides.length;
      showSlide(slideIndex);
    }

    function prevSlide() {
      slideIndex = (slideIndex - 1 + slides.length) % slides.length;
      showSlide(slideIndex);
    }

    function startSlideshow() {
      slideInterval = setInterval(nextSlide, 8000);
    }

    function stopSlideshow() {
      clearInterval(slideInterval);
    }

    // Init
    showSlide(slideIndex);
    startSlideshow();

    if (nextBtn && prevBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        stopSlideshow();
        startSlideshow();
      });

      prevBtn.addEventListener("click", () => {
        prevSlide();
        stopSlideshow();
        startSlideshow();
      });
    }
  });
});
