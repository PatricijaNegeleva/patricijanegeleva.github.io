const navButtons = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".content-section");
const backToTop = document.getElementById("backToTop");
const categoryButtons = document.querySelectorAll(".category-link");
const workCards = document.querySelectorAll(".work-card");
const worksGrid = document.querySelector(".works-grid");

const lightbox = document.getElementById("lightbox");
const lightboxMedia = document.getElementById("lightboxMedia");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const workImages = document.querySelectorAll(".work-image");

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

  const cards = Array.from(document.querySelectorAll(".work-card"));
  const shuffledCards = shuffleArray(cards);

  shuffledCards.forEach((card) => {
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

/* lightbox */
workImages.forEach((button) => {
  button.addEventListener("click", () => {
    const mediaType = button.dataset.type || "image";
    const title = button.dataset.title || "";

    lightboxCaption.textContent = title;
    lightboxMedia.innerHTML = "";

    if (mediaType === "video") {
      const videoUrl = button.dataset.video;

      lightboxMedia.innerHTML = `
        <div class="lightbox-video-wrap">
          <iframe
            src="${videoUrl}"
            title="${title}"
            frameborder="0"
            allow="encrypted-media; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>
      `;
    } else {
      const imageSrc = button.dataset.full;

      lightboxMedia.innerHTML = `
        <img src="${imageSrc}" alt="${title}" />
      `;
    }

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

/* close */
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxMedia.innerHTML = "";
  lightboxCaption.textContent = "";
  document.body.style.overflow = "";
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    closeLightbox();
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