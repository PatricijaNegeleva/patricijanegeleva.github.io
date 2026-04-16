const navButtons = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".content-section");

const categoryButtons = document.querySelectorAll(".category-link");
const workCards = document.querySelectorAll(".work-card");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const workImages = document.querySelectorAll(".work-image");

/* one-page navigation */
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

/* category filter */
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
  });
});

/* lightbox */
workImages.forEach((button) => {
  button.addEventListener("click", () => {
    const imageSrc = button.dataset.full;
    const imageTitle = button.dataset.title || "";

    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageTitle;
    lightboxCaption.textContent = imageTitle;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  lightboxImage.alt = "";
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

/* about image hover swap */
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