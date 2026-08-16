window.initAdamPage = function () {
  const page = document.querySelector(".adam-page");

  if (!page) {
    return function () {};
  }

  const revealItems = [
    ...page.querySelectorAll("[data-reveal]")
  ];

  const layered =
    document.getElementById("adamLayered");

  let scrollFrame = null;


  /* =====================================
     PAGE ENTRANCE
  ===================================== */

  requestAnimationFrame(() => {
    page.classList.add("adam-ready");
  });


  /* =====================================
     SCROLL REVEALS
  ===================================== */

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(
            "is-visible"
          );

          observer.unobserve(
            entry.target
          );
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin:
        "0px 0px -8% 0px"
    }
  );


  revealItems.forEach(item => {
    observer.observe(item);
  });


  /* =====================================
     VERY SUBTLE IMAGE-OVER-IMAGE PARALLAX
  ===================================== */

  function updateLayerProgress() {
    scrollFrame = null;

    if (!layered) return;

    const rect =
      layered.getBoundingClientRect();

    const viewport =
      window.innerHeight;

    const total =
      rect.height + viewport;

    const passed =
      viewport - rect.top;

    const progress =
      Math.max(
        0,
        Math.min(
          1,
          passed / total
        )
      );


    layered.style.setProperty(
      "--adam-layer-progress",
      progress.toFixed(4)
    );
  }


  function handleScroll() {
    if (scrollFrame !== null) {
      return;
    }

    scrollFrame =
      requestAnimationFrame(
        updateLayerProgress
      );
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


  updateLayerProgress();


  /* =====================================
     CLEANUP FOR SWUP
  ===================================== */

  return function cleanupAdamPage() {

    revealItems.forEach(item => {
      observer.unobserve(item);
    });

    observer.disconnect();


    if (scrollFrame !== null) {
      cancelAnimationFrame(
        scrollFrame
      );
    }


    window.removeEventListener(
      "scroll",
      handleScroll
    );


    window.removeEventListener(
      "resize",
      handleScroll
    );

  };
};
