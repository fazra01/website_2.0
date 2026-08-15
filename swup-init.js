function initPaintingsPage() {
  const gallery =
    document.getElementById("paintingsGallery");

  if (!gallery) {
    return function () {};
  }


  const slides = [
    ...gallery.querySelectorAll(".painting-slide")
  ];

  const images = [
    ...gallery.querySelectorAll(".painting-image")
  ];

  const metaTitle =
    document.getElementById("paintingMetaTitle");

  const metaDetails =
    document.getElementById("paintingMetaDetails");

  const counter =
    document.getElementById("paintingCounter");

  const lightbox =
    document.getElementById("paintingLightbox");

  const lightboxImage =
    document.getElementById("paintingLightboxImage");

  const closeButton =
    lightbox.querySelector(
      ".painting-lightbox-close"
    );


  let activeIndex = 0;
  let scrollFrame = null;


  /* =====================================
     UPDATE CURRENT WORK
  ===================================== */

  function updatePaintingInfo() {

    const width =
      gallery.clientWidth || window.innerWidth;

    const nextIndex = Math.max(
      0,
      Math.min(
        slides.length - 1,
        Math.round(
          gallery.scrollLeft / width
        )
      )
    );


    activeIndex = nextIndex;

    const slide =
      slides[activeIndex];


    metaTitle.textContent =
      slide.dataset.title || "";

    metaDetails.textContent =
      slide.dataset.details || "";


    counter.textContent =
      `${String(activeIndex + 1).padStart(2, "0")}` +
      `/` +
      `${String(slides.length).padStart(2, "0")}`;
  }


  function handleScroll() {

    if (scrollFrame) {
      cancelAnimationFrame(scrollFrame);
    }

    scrollFrame =
      requestAnimationFrame(
        updatePaintingInfo
      );

  }


  /* =====================================
     MOUSE WHEEL → HORIZONTAL MOVEMENT
  ===================================== */

  function handleWheel(event) {

    /*
      Normal trackpad horizontal gestures still work.
      Vertical mouse-wheel movement becomes horizontal.
    */

    if (
      Math.abs(event.deltaY) >
      Math.abs(event.deltaX)
    ) {

      event.preventDefault();

      gallery.scrollLeft +=
        event.deltaY;

    }

  }


  /* =====================================
     KEYBOARD
  ===================================== */

  function goToPainting(index) {

    const clampedIndex =
      Math.max(
        0,
        Math.min(
          slides.length - 1,
          index
        )
      );


    gallery.scrollTo({
      left:
        clampedIndex *
        gallery.clientWidth,

      behavior: "smooth"
    });

  }


  function handleKeydown(event) {

    if (lightbox.classList.contains("open")) {

      if (event.key === "Escape") {
        closeLightbox();
      }

      return;
    }


    if (event.key === "ArrowRight") {

      event.preventDefault();

      goToPainting(
        activeIndex + 1
      );

    }


    if (event.key === "ArrowLeft") {

      event.preventDefault();

      goToPainting(
        activeIndex - 1
      );

    }

  }


  /* =====================================
     ZOOM
  ===================================== */

  function openLightbox(event) {

    const image =
      event.currentTarget;

    lightboxImage.src =
      image.src;

    lightboxImage.alt =
      image.alt;

    lightbox.classList.add(
      "open"
    );

    lightbox.setAttribute(
      "aria-hidden",
      "false"
    );

  }


  function closeLightbox() {

    lightbox.classList.remove(
      "open"
    );

    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );

    lightboxImage.removeAttribute(
      "src"
    );

  }


  function handleLightboxClick(event) {

    if (
      event.target === lightbox ||
      event.target === lightboxImage
    ) {
      closeLightbox();
    }

  }


  /* =====================================
     LISTENERS
  ===================================== */

  gallery.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
  );


  gallery.addEventListener(
    "wheel",
    handleWheel,
    { passive: false }
  );


  window.addEventListener(
    "keydown",
    handleKeydown
  );


  images.forEach(image => {

    image.addEventListener(
      "click",
      openLightbox
    );

  });


  lightbox.addEventListener(
    "click",
    handleLightboxClick
  );


  closeButton.addEventListener(
    "click",
    closeLightbox
  );


  updatePaintingInfo();


  /* =====================================
     SWUP CLEANUP
  ===================================== */

  return function cleanupPaintingsPage() {

    if (scrollFrame) {
      cancelAnimationFrame(scrollFrame);
    }


    gallery.removeEventListener(
      "scroll",
      handleScroll
    );


    gallery.removeEventListener(
      "wheel",
      handleWheel
    );


    window.removeEventListener(
      "keydown",
      handleKeydown
    );


    images.forEach(image => {

      image.removeEventListener(
        "click",
        openLightbox
      );

    });


    lightbox.removeEventListener(
      "click",
      handleLightboxClick
    );


    closeButton.removeEventListener(
      "click",
      closeLightbox
    );

  };
}

function initContactPage() {
  const form =
    document.getElementById("contactForm");

  const status =
    document.getElementById("contactStatus");

  if (!form) {
    return function () {};
  }

  const button =
    form.querySelector('button[type="submit"]');


  async function handleSubmit(event) {
    event.preventDefault();

    button.disabled = true;
    button.textContent = "sending…";

    status.textContent = "";


    try {

      const response = await fetch(
        form.action,
        {
          method: form.method,

          body: new FormData(form),

          headers: {
            Accept: "application/json"
          }
        }
      );


      if (response.ok) {

        form.reset();

        status.textContent =
          "Thank you — I'll be in touch.";

      } else {

        status.textContent =
          "Something went wrong. Please try again.";

      }

    } catch (error) {

      status.textContent =
        "Something went wrong. Please try again.";

    } finally {

      button.disabled = false;
      button.textContent = "send →";

    }
  }


  form.addEventListener(
    "submit",
    handleSubmit
  );


  return function cleanupContactPage() {

    form.removeEventListener(
      "submit",
      handleSubmit
    );

  };
}

let cleanupCurrentPage = function () {};


function initCurrentPage() {

  cleanupCurrentPage();
  cleanupCurrentPage = function () {};

  if (
    document.getElementById("stage") &&
    window.initHomePage
  ) {
    cleanupCurrentPage =
      window.initHomePage();

    return;
  }


  if (
    document.getElementById("heroImage") &&
    window.initArtistStatementPage
  ) {
    cleanupCurrentPage =
      window.initArtistStatementPage();
  }
  if (
  document.querySelector(".about-page") &&
  window.initAboutPage
) {
  cleanupCurrentPage =
    window.initAboutPage();

  return;
}
if (
  document.querySelector(".contact-page")
) {

  cleanupCurrentPage =
    initContactPage();

  return;
}
if (
  document.querySelector(".paintings-page")
) {

  cleanupCurrentPage =
    initPaintingsPage();

  return;
}
}


const swup = new Swup({
  plugins: [
    new SwupHeadPlugin({
      awaitAssets: true
    })
  ]
});


swup.hooks.before(
  "content:replace",
  () => {
    cleanupCurrentPage();
    cleanupCurrentPage = function () {};
  }
);


swup.hooks.on(
  "page:view",
  () => {
    initCurrentPage();
  }
);


if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initCurrentPage,
    { once: true }
  );

} else {

  initCurrentPage();

}