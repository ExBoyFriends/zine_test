// lastPage.js
export function initLastPage(lastImg, getCurrentPage, totalPages) {
  let shifted = false;
  lastImg.style.transition = "transform 0.4s ease";

  lastImg.addEventListener("click", () => {
    if (getCurrentPage() !== totalPages - 1) return;

    shifted = !shifted;
    lastImg.style.transform = shifted
      ? "translateX(-50%)"
      : "translateX(0)";
  });
}