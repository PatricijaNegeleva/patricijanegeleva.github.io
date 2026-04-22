const navButtons = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".content-section");

const categoryButtons = document.querySelectorAll(".category-link");
const workCards = document.querySelectorAll(".work-card");
const worksGrid = document.querySelector(".works-grid");

const lightbox = document.getElementById("lightbox");
const lightboxMedia = document.getElementById("lightboxMedia");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const workImages = document.querySelectorAll(".work-image");
const backToTop = document.getElementById("backToTop");

let currentSeries = [];
let currentSeriesIndex = -1;
let currentMediaType = null;
let currentVideoUrl = null;
let currentTitle = "";

/* shuffle */
function shuffleArray(array) {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}

function shuffleWorks() {
  if (!worksGrid) return;

  const visibleCards = Array.from(document.querySelectorAll(".work-card:not(.series-only)"));
  const hiddenSeriesCards = Array.from(document.querySelectorAll(".work-card.series-only"));

  const shuffledCards = shuffleArray(visibleCards);

  shuffledCards.forEach((card) => {
    worksGrid.appendChild(card);
  });

  hiddenSeriesCards.forEach((card) => {
    worksGrid.appendChild(card);
  });
}

/* spacing */
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function applyCuratedSpacing() {
  const cards = Array.from(document.querySelectorAll(".work-card"));

  cards.forEach((card, index) => {
    let gap = randomBetween(22, 42);

    if (index % 5 === 0) gap = randomBetween(48, 78);
    if (index % 8 === 0) gap = randomBetween(60, 96);

    card.style.marginBottom = `${gap}px`;
  });
}

shuffleWorks();
applyCuratedSpacing();

/* navigation */
navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetSection = button.dataset.section;

    navButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    sections.forEach((section) => {
      section.classList.toggle("active", section.id === targetSection);
    });
  });
});

/* filter */
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    categoryButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    workCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === "all" || category === filter;
      card.classList.toggle("hidden", !shouldShow);
    });

    applyCuratedSpacing();
  });
});

function updateLightboxArrows() {
  const hasSeries =
    currentMediaType === "image" &&
    currentSeries.length > 1;

  if (lightboxPrev) {
    lightboxPrev.classList.toggle("visible", hasSeries);
  }

  if (lightboxNext) {
    lightboxNext.classList.toggle("visible", hasSeries);
  }
}
function renderCurrentMedia() {
  lightboxMedia.innerHTML = "";

  if (currentMediaType === "video") {
    lightboxMedia.innerHTML = `
      <div class="lightbox-video-wrap">
        <iframe
          src="${currentVideoUrl}"
          title="${currentTitle}"
          frameborder="0"
          allow="encrypted-media; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
    `;
    lightboxCaption.textContent = currentTitle;
    currentSeries = [];
    currentSeriesIndex = -1;
    updateLightboxArrows();
    return;
  }

  if (currentSeries.length > 0 && currentSeriesIndex >= 0) {
    const currentButton = currentSeries[currentSeriesIndex];
    const imageSrc = currentButton.dataset.full;
    const title = currentButton.dataset.title || "";

    lightboxMedia.innerHTML = `<img src="${imageSrc}" alt="${title}" />`;
    lightboxCaption.textContent = title;
    updateLightboxArrows();
  }
}

function openLightboxForButton(button) {
  const mediaType = button.dataset.type || "image";
  const title = button.dataset.title || "";

  currentMediaType = mediaType;
  currentTitle = title;
  currentVideoUrl = null;
  currentSeries = [];
  currentSeriesIndex = -1;

  if (mediaType === "video") {
    currentVideoUrl = button.dataset.video;
  } else {
    const seriesName = button.dataset.series;

    if (seriesName) {
      currentSeries = Array.from(document.querySelectorAll(`.work-image[data-series="${seriesName}"]`));
      currentSeriesIndex = currentSeries.findIndex((item) => item === button);
    } else {
      currentSeries = [button];
      currentSeriesIndex = 0;
    }
  }

  renderCurrentMedia();

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

workImages.forEach((button) => {
  button.addEventListener("click", () => {
    openLightboxForButton(button);
  });
});

function showPrevInSeries() {
  if (currentSeries.length <= 1) return;
  currentSeriesIndex = (currentSeriesIndex - 1 + currentSeries.length) % currentSeries.length;
  renderCurrentMedia();
}

function showNextInSeries() {
  if (currentSeries.length <= 1) return;
  currentSeriesIndex = (currentSeriesIndex + 1) % currentSeries.length;
  renderCurrentMedia();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxMedia.innerHTML = "";
  lightboxCaption.textContent = "";
  document.body.style.overflow = "";
  currentSeries = [];
  currentSeriesIndex = -1;
  currentMediaType = null;
  currentVideoUrl = null;
  currentTitle = "";
  updateLightboxArrows();
}

lightboxClose.addEventListener("click", closeLightbox);

if (lightboxPrev) {
  lightboxPrev.addEventListener("click", (event) => {
    event.stopPropagation();
    showPrevInSeries();
  });
}

if (lightboxNext) {
  lightboxNext.addEventListener("click", (event) => {
    event.stopPropagation();
    showNextInSeries();
  });
}

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    showPrevInSeries();
  }

  if (event.key === "ArrowRight") {
    showNextInSeries();
  }
});

/* about image hover */
const aboutImage = document.getElementById("aboutImage");

if (aboutImage) {
  const defaultSrc = aboutImage.dataset.default;
  const hoverSrc = aboutImage.dataset.hover;

  aboutImage.addEventListener("mouseenter", () => {
    aboutImage.src = hoverSrc;
  });

  aboutImage.addEventListener("mouseleave", () => {
    aboutImage.src = defaultSrc;
  });
}

/* back to top */
function toggleBackToTop() {
  if (!backToTop) return;

  if (window.scrollY > 280) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
}

window.addEventListener("scroll", toggleBackToTop);
window.addEventListener("load", toggleBackToTop);

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}