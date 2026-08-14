window.initArtistStatementPage = function () {
  const heroImage = document.getElementById("heroImage");

  if (!heroImage) {
    return function () {};
  }

  const image = heroImage.querySelector("img");
  const titles = document.querySelectorAll(".crossing-title");
  const lyric = document.querySelector(".lyric-hover-target");

  let switchTimer = null;
  let flickerTimer = null;
  let isArabic = false;


  /* =====================================
     EXISTING TITLE / IMAGE EFFECT
  ===================================== */

  function updateTitleColor() {
    const imageRect = heroImage.getBoundingClientRect();

    titles.forEach(title => {
      const titleRect = title.getBoundingClientRect();

      const overlap =
        imageRect.bottom - titleRect.top;

      const ratio = Math.max(
        0,
        Math.min(
          1,
          overlap / titleRect.height
        )
      );

      title.style.setProperty(
        "--split",
        `${ratio * 100}%`
      );
    });
  }


  /* =====================================
     LANGUAGE SWITCH
  ===================================== */

  function changeLanguage(toArabic) {
    if (toArabic === isArabic) return;

    clearTimeout(switchTimer);
    clearTimeout(flickerTimer);

    document.body.classList.remove("artist-flicker");

    void document.body.offsetWidth;

    document.body.classList.add("artist-flicker");


    switchTimer = setTimeout(() => {
      document.body.classList.toggle(
        "artist-arabic",
        toArabic
      );

      isArabic = toArabic;
    }, 55);


    flickerTimer = setTimeout(() => {
      document.body.classList.remove(
        "artist-flicker"
      );
    }, 130);
  }


  function handleEnter() {
    changeLanguage(true);
  }


  function handleLeave() {
    changeLanguage(false);
  }


  /* =====================================
     LISTENERS
  ===================================== */

  window.addEventListener(
    "scroll",
    updateTitleColor,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    updateTitleColor
  );

  image.addEventListener(
    "load",
    updateTitleColor
  );

  if (lyric) {
    lyric.addEventListener(
      "mouseenter",
      handleEnter
    );

    lyric.addEventListener(
      "mouseleave",
      handleLeave
    );
  }

  requestAnimationFrame(updateTitleColor);


  /* =====================================
     CLEANUP
  ===================================== */

  return function cleanupArtistStatementPage() {
    clearTimeout(switchTimer);
    clearTimeout(flickerTimer);

    document.body.classList.remove(
      "artist-arabic",
      "artist-flicker"
    );

    window.removeEventListener(
      "scroll",
      updateTitleColor
    );

    window.removeEventListener(
      "resize",
      updateTitleColor
    );

    image.removeEventListener(
      "load",
      updateTitleColor
    );

    if (lyric) {
      lyric.removeEventListener(
        "mouseenter",
        handleEnter
      );

      lyric.removeEventListener(
        "mouseleave",
        handleLeave
      );
    }
  };
};