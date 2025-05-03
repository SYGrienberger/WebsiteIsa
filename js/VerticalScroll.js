const scrollContainer = document.querySelector('.scroll-wrapper');
const indicators = document.querySelectorAll('.dot');
const pages = scrollContainer.querySelectorAll('.screen');
const totalPages = pages.length;
let currentPage = 0;
let isScrolling = false;

// Helper: schermbreedte
const getPageWidth = () => window.innerWidth;

// Helper: blokkeren voor x ms
function setScrollBlocked(time = 600) {
  isScrolling = true;
  setTimeout(() => isScrolling = false, time);
}

// Check of naar bepaalde pagina kan
function canScrollTo(page) {
  return page >= 0 && page < totalPages;
}

// Scroll + update indicators
function scrollToPage(page) {
  const maxPage = totalPages - 1;
  currentPage = Math.max(0, Math.min(page, maxPage));

  scrollContainer.scrollTo({
    left: Math.round(currentPage * getPageWidth()),
    behavior: 'smooth'
  });

  updateIndicators();
}

// Update de dot indicators
function updateIndicators() {
  indicators.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentPage);
  });
}

// Beweeg een pagina naar links/rechts
function handlePageChange(direction) {
  if (isScrolling) return;

  const targetPage = currentPage + direction;
  if (canScrollTo(targetPage)) {
    scrollToPage(targetPage);
    setScrollBlocked();
  }
}

// === Muiswiel ===
function handleWheelEvent(evt) {
  evt.preventDefault();
  const direction = evt.deltaY > 0 ? 1 : -1;
  handlePageChange(direction);
}

scrollContainer.addEventListener('wheel', handleWheelEvent);

// === Touch swipe ===
let startX = 0;
let startY = 0;
let isTouching = false;

scrollContainer.addEventListener('touchstart', (e) => {
  isTouching = true;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, { passive: false });

scrollContainer.addEventListener('touchmove', (e) => {
  if (!isTouching || isScrolling) return;

  const currentX = e.touches[0].clientX;
  const currentY = e.touches[0].clientY;
  const deltaX = startX - currentX;
  const deltaY = startY - currentY;

  const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

  if (isHorizontalSwipe && Math.abs(deltaX) > 50) {
    const direction = deltaX > 0 ? 1 : -1;
    handlePageChange(direction);
    isTouching = false;
  } else if (!isHorizontalSwipe && Math.abs(deltaY) > 50) {
    const direction = deltaY > 0 ? 1 : -1;
    handlePageChange(direction);
    isTouching = false;
  }

  e.preventDefault();
}, { passive: false });

scrollContainer.addEventListener('touchend', () => {
  isTouching = false;
});

// === Keyboard pijlen ===
function handleKeyEvent(e) {
  if (['ArrowRight', 'ArrowDown'].includes(e.key)) {
    handlePageChange(1);
  } else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
    handlePageChange(-1);
  }
}

document.addEventListener('keydown', handleKeyEvent);

// === Indicators aanklikken ===
indicators.forEach(dot => {
  dot.addEventListener('click', () => {
    const index = parseInt(dot.getAttribute('data-index'));
    if (!isNaN(index) && index !== currentPage) {
      scrollToPage(index);
    }
  });
});

// === Resize: blijf op juiste pagina ===
window.addEventListener('resize', () => {
  scrollToPage(currentPage);
});

// // === Snap scroll ===
// scrollContainer.addEventListener('scroll', () => {
//   clearTimeout(scrollContainer._snapTimeout);
//   scrollContainer._snapTimeout = setTimeout(() => {
//     const page = Math.round(scrollContainer.scrollLeft / getPageWidth());
//     scrollToPage(page);
//   }, 200);
// });

// Initieel op pagina 0
scrollToPage(currentPage);






//SlideShow: 
