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