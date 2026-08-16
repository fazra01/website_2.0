window.initHomePage = function () {    
    const stage = document.getElementById("stage");
        const preview = document.getElementById("preview");
        const previewCards = [...document.querySelectorAll(".preview-card")];
        const projectRows = [...document.querySelectorAll(".project-row")];
        const axisRows = [...document.querySelectorAll(".axis-row")];

        const identityButton = document.getElementById("identityButton");
        const lampVideo = document.getElementById("lampVideo");

        function clearProjectPreview() {
        preview.classList.remove("show");
        previewCards.forEach(card => card.classList.remove("active"));
        document.querySelectorAll(".project.is-paired")
            .forEach(el => el.classList.remove("is-paired"));

        if (lampVideo) {
            lampVideo.pause();
            lampVideo.currentTime = 0;
        }
        setNameContrast("dark");
        }

        function clearInfoPreview() {
        preview.classList.remove("show");
        previewCards.forEach(card => {
            if (card.classList.contains("info-preview")) {
            card.classList.remove("active");
            }
        });
        setNameContrast("dark");
        }

        function showInfoPreview(key) {
        if (!stage.classList.contains("info-mode")) return;

        let activeCard = null;

        previewCards.forEach(card => {
            if (!card.classList.contains("info-preview")) return;

            const isActive = card.dataset.preview === key;
            card.classList.toggle("active", isActive);

            if (isActive) activeCard = card;
        });

        if (!activeCard) {
            clearInfoPreview();
            return;
        }

        preview.classList.add("show");
        setNameContrast(activeCard.dataset.nameColor || "dark");
        }

        function setNameContrast(mode = "dark") {
        identityButton.classList.toggle("name-light", mode === "light");
        identityButton.classList.toggle("name-dark", mode !== "light");
        }

        // Default state: black name on the plain light page.
        setNameContrast("dark");
        let cascadeTimer;

    const CASCADE_STEP = 70;
    const CASCADE_FINISH = 700;

    function prepareCascade(fromTop) {
    const orderedRows = fromTop
        ? projectRows
        : [...projectRows].reverse();

    orderedRows.forEach((row, index) => {
        row.style.setProperty(
        "--cascade-delay",
        `${index * CASCADE_STEP}ms`
        );

        row.style.setProperty(
        "--cascade-offset",
        fromTop ? "-10px" : "10px"
        );
    });
    }

    function openProjects(fromTop) {
    clearTimeout(cascadeTimer);

    stage.classList.remove("collapsing");
    prepareCascade(fromTop);

    requestAnimationFrame(() => {
        stage.classList.add("revealed");
    });
    }

    function closeProjects(fromTop) {
    clearTimeout(cascadeTimer);

    prepareCascade(fromTop);
    clearProjectPreview();

    stage.classList.add("collapsing");
    stage.classList.remove("revealed");

    cascadeTimer = setTimeout(() => {
        stage.classList.remove("collapsing");
    }, CASCADE_FINISH);
    }

    // ART / ENGINEERING CASCADE
    document.querySelectorAll(".axis-label").forEach(label => {
    label.addEventListener("click", event => {
        event.stopPropagation();

        const axisRow = label.closest(".axis-row");
        const fromTop = axisRow.classList.contains("top");

        // If Fadi/About mode is open, return to project mode.
        if (stage.classList.contains("info-mode")) {
        clearInfoPreview();

        stage.classList.remove(
            "info-mode",
            "info-ar",
            "info-en"
        );

        identityButton.setAttribute(
            "aria-expanded",
            "false"
        );

        openProjects(fromTop);
        return;
        }

        if (stage.classList.contains("revealed")) {
        closeProjects(fromTop);
        } else {
        openProjects(fromTop);
        }
    });
    });

        // Language logic changes depending on mode.
        //
        // WORK MODE:
        // left = English, right = Arabic
        //
        // FADI MODE:
        // top = Arabic, bottom = English
        function handlePointerMove(event) {
        if (stage.classList.contains("info-mode")) {
            const y = event.clientY / window.innerHeight;

            if (y < 0.45) {
            stage.classList.add("info-en");
            stage.classList.remove("info-ar");
            } else if (y > 0.55) {
            stage.classList.add("info-ar");
            stage.classList.remove("info-en");
            }

            return;
        }

        const x = event.clientX / window.innerWidth;

        if (x < 0.45) {
            stage.classList.add("lang-en");
            stage.classList.remove("lang-ar");
        } else if (x > 0.55) {
            stage.classList.add("lang-ar");
            stage.classList.remove("lang-en");
        }
        }

        window.addEventListener("pointermove", handlePointerMove);

        // Art / Engineering translation arrows.
        axisRows.forEach(row => {
        const en = row.querySelector(".axis-label.en");
        const ar = row.querySelector(".axis-label.ar");

        function show(direction) {
        clearTimeout(row.hideTimer);

        row.classList.remove(
            "show-line",
            "hiding",
            "hide-to-right",
            "hide-to-left",
            "dir-right",
            "dir-left"
        );

        row.classList.toggle("dir-right", direction === "right");
        row.classList.toggle("dir-left", direction === "left");

        requestAnimationFrame(() => {
            row.classList.add("show-line");
        });
        }

        function hide() {
        clearTimeout(row.hideTimer);

        const movingRight = row.classList.contains("dir-right");

        row.classList.add("hiding");

        if (movingRight) {
            row.classList.add("hide-to-right");
        } else {
            row.classList.add("hide-to-left");
        }

        row.classList.remove("show-line");

        row.hideTimer = setTimeout(() => {
            row.classList.remove(
            "hiding",
            "hide-to-right",
            "hide-to-left",
            "dir-right",
            "dir-left"
            );
        }, 800);
        }

        en.addEventListener("mouseenter", () => show("right"));
        ar.addEventListener("mouseenter", () => show("left"));
        en.addEventListener("mouseleave", hide);
        ar.addEventListener("mouseleave", hide);
        });

        // Preview logic:
        // ONLY the visible text itself triggers the preview.
        projectRows.forEach(row => {
        const key = row.dataset.project;
        const english = row.querySelector(".project.en");
        const arabic = row.querySelector(".project.ar");
        const pair = [english, arabic];

        function projectsAreOpen() {
            return stage.classList.contains("revealed") &&
                !stage.classList.contains("info-mode");
        }

        function showProject() {
            // Absolute guard: collapsed projects do NOTHING.
            if (!projectsAreOpen()) {
            clearProjectPreview();
            return;
            }

            let activeCard = null;

            previewCards.forEach(card => {
            const isActive = card.dataset.preview === key;
            card.classList.toggle("active", isActive);
            if (isActive) activeCard = card;
            });

            pair.forEach(el => el.classList.add("is-paired"));
            preview.classList.add("show");

            if (activeCard) {
            setNameContrast(activeCard.dataset.nameColor || "dark");
            }

            if (key === "cad" && lampVideo) {
            lampVideo.currentTime = 0;
            lampVideo.play().catch(() => {});
            }
        }

        function hideProject() {
            if (!projectsAreOpen()) {
            clearProjectPreview();
            return;
            }

            pair.forEach(el => el.classList.remove("is-paired"));
            preview.classList.remove("show");
            previewCards.forEach(card => card.classList.remove("active"));

            // Return to black when the page has no thumbnail behind the name.
            setNameContrast("dark");

            if (key === "cad" && lampVideo) {
            lampVideo.pause();
            lampVideo.currentTime = 0;
            }
        }

        pair.forEach(el => {
            el.addEventListener("mouseenter", showProject);
            el.addEventListener("mouseleave", hideProject);

            // Project click target is also just the visible text.
            el.addEventListener("click", event => {
            event.stopPropagation();

            // Collapsed projects are not valid click targets.
            if (!projectsAreOpen()) return;

            
            if (key === "memory") {

            if (typeof swup !== "undefined") {
                swup.navigate("paintings.html");
            } else {
                window.location.href =
                "paintings.html";
            }

            return;
        }


        if (key === "adam") {

            if (typeof swup !== "undefined") {
                swup.navigate("adam.html");
            } else {
                window.location.href =
                "adam.html";
            }

            return;
        }


        console.log("Open project:", key);
        });
        });
        });

        // Clicking the name toggles between:
    // 1) Art / Engineering work mode
    // 2) Fadi personal-info mode
    identityButton.addEventListener("click", event => {
    event.stopPropagation();

    const isInfoMode = stage.classList.contains("info-mode");

    // OPEN FADI MODE
    if (!isInfoMode) {
        const wasArabic = stage.classList.contains("lang-ar");

        stage.classList.add("info-mode");
        stage.classList.remove(
        "info-en",
        "info-ar",
        "revealed"
        );

        // Keep whichever language the name was already using.
        stage.classList.add(
        wasArabic ? "info-ar" : "info-en"
        );

        clearProjectPreview();

        identityButton.setAttribute(
        "aria-expanded",
        "true"
        );

        return;
    }

    // CLOSE FADI MODE
    const isArabic = stage.classList.contains("info-ar");

    clearInfoPreview();

    stage.classList.remove(
        "info-mode",
        "info-en",
        "info-ar"
    );

    // Return to the homepage in the SAME language.
    stage.classList.remove("lang-en", "lang-ar");
    stage.classList.add(
        isArabic ? "lang-ar" : "lang-en"
    );

    identityButton.setAttribute(
        "aria-expanded",
        "false"
    );
    });

        // Personal links:
        // about / artist statement show center previews;
        // contact intentionally shows no image.
        document.querySelectorAll(".info-link").forEach(link => {
        const key = link.dataset.info;

        link.addEventListener("mouseenter", () => {
            showInfoPreview(key);
        });

        link.addEventListener("mouseleave", () => {
            clearInfoPreview();
        });

        link.addEventListener("click", event => {
    if (key !== "artist-statement") {
        event.stopPropagation();
    }
    });
        });
    return function cleanupHomePage() {
  window.removeEventListener(
    "pointermove",
    handlePointerMove
  );

  clearTimeout(cascadeTimer);

  axisRows.forEach(row => {
    clearTimeout(row.hideTimer);
  });

  if (lampVideo) {
    lampVideo.pause();
  }
};
};