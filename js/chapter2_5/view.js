// chapter2_5/view.js

let dualFlipped = false;

const pages = Array.from(document.querySelectorAll(".page"));
const dots  = Array.from(document.querySelectorAll(".dot"));

export function getPages() {
  return pages;
}

/* ===================== Dots ===================== */
function updateDots(index) {
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

/* ===================== Page control ===================== */
export function showPage(index) {
  pages.forEach((page, i) => {
    const isActive = i === index;

    page.classList.toggle("active", isActive);
    page.style.pointerEvents = isActive ? "auto" : "none";
    page.style.zIndex = isActive ? 2 : 1;

    if (!isActive) {
      page.classList.remove("show-text");
    }
  });

  const page = pages[index];
  if (!page) return;

  if (page.classList.contains("dual")) {
    const flipped = page.dataset.flipped === "true";
    page.dataset.flipped = (!flipped).toString();
    page.classList.toggle("flipped", !flipped);
  }

  updateDots(index);
}


/* ===================== Text ===================== */
export function showText(index) {
  pages[index]?.classList.add("show-text");
}

export function hideText(index) {
  pages[index]?.classList.remove("show-text");
}

