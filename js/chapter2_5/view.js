// chapter2_5/view.js

const pages = Array.from(document.querySelectorAll(".page"));
const dots  = Array.from(document.querySelectorAll(".dot"));

export function getPages() { return pages; }

function updateDots(index) {
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

export function showPage(index) {
  pages.forEach((page, i) => {
    const isActive = i === index;
    page.classList.toggle("active", isActive);
    
    if (!isActive) {
      page.classList.remove("show-text");
      page.style.visibility = "hidden";
      page.style.pointerEvents = "none";
    } else {
      page.style.visibility = "visible";
      page.style.pointerEvents = "auto";
      page.style.zIndex = 10;
    }
  });

  const page = pages[index];
  if (page && page.classList.contains("dual")) {
    const flipped = page.dataset.flipped === "true";
    page.dataset.flipped = (!flipped).toString();
    page.classList.toggle("flipped", !flipped);
  }

  updateDots(index);
}

export function showText(index) {
  pages[index]?.classList.add("show-text");
}

export function hideText(index) {
  pages[index]?.classList.remove("show-text");
}
