// loader.js
export function initLoader(pages, loader) {
  window.addEventListener("load", () => {
    const firstPage = pages[0];
    loader.style.display = "block";
    firstPage.classList.add("active");

    setTimeout(() => {
      loader.style.opacity = 0;
      loader.style.pointerEvents = "none";
      firstPage.style.transition = "opacity 5s ease";
    }, 2000);

    setTimeout(() => {
      loader.remove();
    }, 3500);
  });
}