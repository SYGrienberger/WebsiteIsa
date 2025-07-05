let slideIndex = 0;
let slides = document.querySelectorAll(".slide");
let nextBtn = document.querySelector(".next");
let prevBtn = document.querySelector(".prev");
let slideInterval = null;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.style.display = i === index ? "block" : "none";
  });
}

// Volgende slide
function nextSlide() {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}

// Vorige slide
function prevSlide() {
  slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  showSlide(slideIndex);
}

// Start automatische slideshow
function startSlideshow() {
  slideInterval = setInterval(nextSlide, 8000);
}

// Stop slideshow (bij klikken)
function stopSlideshow() {
  clearInterval(slideInterval);
}

// Event listeners
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

// Init
showSlide(slideIndex);
startSlideshow();
