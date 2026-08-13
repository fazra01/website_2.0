
        const heroImage = document.getElementById("heroImage");
    const image = heroImage.querySelector("img");
    const titles = document.querySelectorAll(".crossing-title");

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

    window.addEventListener(
      "scroll",
      updateTitleColor,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateTitleColor
    );

    /*
      IMPORTANT:
      Wait until the photograph has its real dimensions
      before calculating the title color.
    */
    image.addEventListener(
      "load",
      updateTitleColor
    );

    requestAnimationFrame(updateTitleColor);