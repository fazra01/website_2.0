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