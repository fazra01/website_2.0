function initPaintingsPage() {
  const page =
    document.querySelector(".paintings-page");

  const gallery =
    document.getElementById("paintingsGallery");

  if (!page || !gallery) {
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


  const fullscreen =
    document.getElementById("paintingFullscreen");

  const fullscreenImage =
    document.getElementById("paintingFullscreenImage");


  let mode = "strip";
  let activeIndex = 0;
  let scrollFrame = null;


  /* =====================================
     META
  ===================================== */

  function updateMeta(index) {
    const slide = slides[index];

    if (!slide) return;


    metaTitle.textContent =
      slide.dataset.title || "";

    metaDetails.textContent =
      slide.dataset.details || "";
  }


  /* =====================================
     FIND CURRENT FOCUSED WORK
  ===================================== */

  function updateFocusedIndex() {
    if (mode !== "focus") return;


    const width =
      gallery.clientWidth ||
      window.innerWidth;


    activeIndex = Math.max(
      0,
      Math.min(
        slides.length - 1,

        Math.round(
          gallery.scrollLeft / width
        )
      )
    );


    updateMeta(activeIndex);
  }


  function handleScroll() {
    if (scrollFrame) {
      cancelAnimationFrame(scrollFrame);
    }


    scrollFrame =
      requestAnimationFrame(
        updateFocusedIndex
      );
  }


  /* =====================================
     STRIP → FOCUS
  ===================================== */

  function enterFocus(index) {
    activeIndex = index;
    mode = "focus";


    page.classList.remove(
      "mode-strip"
    );

    page.classList.add(
      "mode-focus"
    );


    updateMeta(activeIndex);


    /*
      Wait one frame so each work has
      become exactly 100vw before
      moving to the selected painting.
    */

    requestAnimationFrame(() => {

      gallery.scrollTo({
        left:
          activeIndex *
          gallery.clientWidth,

        behavior: "auto"
      });

    });
  }


  /* =====================================
     FOCUS → STRIP
  ===================================== */

  function enterStrip() {
    mode = "strip";


    page.classList.remove(
      "mode-focus"
    );

    page.classList.add(
      "mode-strip"
    );


    /*
      Keep the painting we were viewing
      roughly centered when returning
      to the strip.
    */

    requestAnimationFrame(() => {

      const slide =
        slides[activeIndex];


      if (!slide) return;


      const target =
        slide.offsetLeft -
        (
          gallery.clientWidth -
          slide.offsetWidth
        ) / 2;


      gallery.scrollTo({
        left: Math.max(0, target),
        behavior: "auto"
      });

    });
  }


  /* =====================================
     FULL SCREEN
  ===================================== */

  function openFullscreen(image) {
    mode = "fullscreen";


    fullscreenImage.src =
      image.src;

    fullscreenImage.alt =
      image.alt;


    fullscreen.classList.add(
      "open"
    );


    fullscreen.setAttribute(
      "aria-hidden",
      "false"
    );
  }


  function closeFullscreen() {
    mode = "focus";


    fullscreen.classList.remove(
      "open"
    );


    fullscreen.setAttribute(
      "aria-hidden",
      "true"
    );


    fullscreenImage.removeAttribute(
      "src"
    );
  }


  /* =====================================
     PAINTING CLICK
  ===================================== */

  function handlePaintingClick(event) {
    const image =
      event.currentTarget;


    const index =
      images.indexOf(image);


    /*
      FIRST CLICK:
      strip → focused painting
    */

    if (mode === "strip") {
      enterFocus(index);
      return;
    }


    /*
      SECOND CLICK:
      focused painting → full screen
    */

    if (mode === "focus") {
      activeIndex = index;

      updateMeta(activeIndex);

      openFullscreen(image);
    }
  }


  /*
    THIRD CLICK:
    full screen → back to focused view
  */

  function handleFullscreenClick() {
    if (mode === "fullscreen") {
      closeFullscreen();
    }
  }


  /* =====================================
     HORIZONTAL SCROLLING
  ===================================== */

  function handleWheel(event) {
    if (mode === "fullscreen") {
      return;
    }


    /*
      Trackpads that are already moving
      horizontally keep their native motion.

      Vertical wheel motion becomes
      horizontal gallery movement.
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
     MOVE ONE WORK
  ===================================== */

  function goToPainting(index) {
    if (mode !== "focus") return;


    activeIndex = Math.max(
      0,
      Math.min(
        slides.length - 1,
        index
      )
    );


    gallery.scrollTo({
      left:
        activeIndex *
        gallery.clientWidth,

      behavior: "smooth"
    });


    updateMeta(activeIndex);
  }


  /* =====================================
     KEYBOARD
  ===================================== */

  function handleKeydown(event) {

    if (mode === "fullscreen") {

      if (event.key === "Escape") {
        closeFullscreen();
      }

      return;
    }


    if (mode === "focus") {

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


      if (event.key === "Escape") {

        event.preventDefault();

        enterStrip();

      }

    }

  }


  /* =====================================
     RESIZE
  ===================================== */

  function handleResize() {
    if (mode !== "focus") return;


    gallery.scrollTo({
      left:
        activeIndex *
        gallery.clientWidth,

      behavior: "auto"
    });
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


  window.addEventListener(
    "resize",
    handleResize
  );


  images.forEach(image => {

    image.addEventListener(
      "click",
      handlePaintingClick
    );

  });


  fullscreen.addEventListener(
    "click",
    handleFullscreenClick
  );


  /* =====================================
     INITIAL STATE
  ===================================== */

  page.classList.remove(
    "mode-focus"
  );

  page.classList.add(
    "mode-strip"
  );


  /* =====================================
     SWUP CLEANUP
  ===================================== */

  return function cleanupPaintingsPage() {

    if (scrollFrame) {
      cancelAnimationFrame(
        scrollFrame
      );
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


    window.removeEventListener(
      "resize",
      handleResize
    );


    images.forEach(image => {

      image.removeEventListener(
        "click",
        handlePaintingClick
      );

    });


    fullscreen.removeEventListener(
      "click",
      handleFullscreenClick
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
/* =====================================
   TAZEWELL PAGE
===================================== */

function initTazewellPage() {

  const page = document.querySelector(".tazewell-page");

  if (!page) {
    return function () {};
  }

  const revealItems = [
    ...page.querySelectorAll("[data-reveal]")
  ];

  const movingTitle =
    document.getElementById("tzMovingTitle");

  const opening =
    document.getElementById("tzOpening");

  let scrollFrame = null;


  /* REVEALS */

  const observer = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        observer.unobserve(entry.target);

      });

    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -5% 0px"
    }
  );


  revealItems.forEach(item => {

    /*
      If something is already on-screen when
      the page loads, reveal it immediately.
    */

    const rect = item.getBoundingClientRect();

    if (
      rect.top < window.innerHeight &&
      rect.bottom > 0
    ) {
      item.classList.add("is-visible");
    } else {
      observer.observe(item);
    }

  });



  /* MOVING "THE GRIFFIN MSI" */

  function updateMovingTitle() {

    if (!movingTitle || !opening) return;


    if (window.innerWidth <= 760) {

      movingTitle.style.transform =
        "translateY(0)";

      return;
    }


    const rect =
      opening.getBoundingClientRect();


    const distance =
      opening.offsetHeight * 0.75;


    const progress =
      Math.max(
        0,
        Math.min(
          1,
          -rect.top / distance
        )
      );


    const movement =
      progress * 15;


    movingTitle.style.transform =
      `translateY(${movement}vh)`;
  }



  function updateFrame() {

    scrollFrame = null;

    updateMovingTitle();
  }


  function handleScroll() {

    if (scrollFrame !== null) return;

    scrollFrame =
      requestAnimationFrame(updateFrame);
  }


  window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    handleScroll
  );


  updateMovingTitle();



  /* CLEANUP FOR SWUP */

  return function cleanupTazewellPage() {

    observer.disconnect();

    window.removeEventListener(
      "scroll",
      handleScroll
    );

    window.removeEventListener(
      "resize",
      handleScroll
    );

    if (scrollFrame !== null) {
      cancelAnimationFrame(scrollFrame);
    }

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
  document.querySelector(".adam-page") &&
  window.initAdamPage
) {

  cleanupCurrentPage =
    window.initAdamPage();

  return;
}
if (
  document.querySelector(".tazewell-page")
) {

  cleanupCurrentPage =
    initTazewellPage();

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