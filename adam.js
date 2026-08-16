window.initAdamPage = function () {

  const page =
    document.querySelector(".adam-page");

  if (!page) {
    return function () {};
  }


  const heroImage =
    document.getElementById("adamHeroImage");

  const heroTitles = [
    ...page.querySelectorAll(
      ".adam-crossing-title"
    )
  ];


  const revealItems = [
    ...page.querySelectorAll(
      "[data-reveal]"
    )
  ];


  let scrollFrame = null;


  /* =====================================
     PAGE ENTRANCE
  ===================================== */

  requestAnimationFrame(() => {

    page.classList.add(
      "adam-ready"
    );

  });


  /* =====================================
     ADAM TITLE / IMAGE CROSSING
  ===================================== */

  function updateTitleColor() {

    if (!heroImage) return;


    const imageRect =
      heroImage.getBoundingClientRect();


    heroTitles.forEach(title => {

      const titleRect =
        title.getBoundingClientRect();


      const overlap =
        imageRect.bottom -
        titleRect.top;


      const ratio = Math.max(
        0,
        Math.min(
          1,
          overlap /
          titleRect.height
        )
      );


      title.style.setProperty(
        "--split",
        `${ratio * 100}%`
      );

    });

  }


  /* =====================================
     SCROLL REVEALS
  ===================================== */

  const observer =
    new IntersectionObserver(

      entries => {

        entries.forEach(entry => {

          if (
            entry.isIntersecting
          ) {

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
     IMAGE-OVER-IMAGE PARALLAX
  ===================================== */




  /* =====================================
     ONE SCROLL FRAME
  ===================================== */

  function updateFrame() {

    scrollFrame = null;

    updateTitleColor();

  }


  function handleScroll() {

    if (
      scrollFrame !== null
    ) {
      return;
    }


    scrollFrame =
      requestAnimationFrame(
        updateFrame
      );

  }


  /* =====================================
     LISTENERS
  ===================================== */

  window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
  );


  window.addEventListener(
    "resize",
    handleScroll
  );


  if (heroImage) {

    const image =
      heroImage.querySelector("img");


    if (image) {

      image.addEventListener(
        "load",
        handleScroll
      );

    }

  }


  requestAnimationFrame(
    updateFrame
  );


  /* =====================================
     CLEANUP FOR SWUP
  ===================================== */

  return function cleanupAdamPage() {

    revealItems.forEach(item => {

      observer.unobserve(item);

    });


    observer.disconnect();


    if (
      scrollFrame !== null
    ) {

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


    if (heroImage) {

      const image =
        heroImage.querySelector("img");


      if (image) {

        image.removeEventListener(
          "load",
          handleScroll
        );

      }

    }

  };

};