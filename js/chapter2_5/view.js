

// chapter2_5/view.js

const pages = Array.from(document.querySelectorAll(".page"));
const dots  = Array.from(document.querySelectorAll(".dot"));

export function getPages() { return pages; }

function updateDots(index) {
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

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

    if (isActive) {
      page.classList.add("active");
      // アクティブな時だけ visibility を visible に戻す
      page.style.visibility = "visible";
    } else {
      page.classList.remove("active", "show-text");
      // 非アクティブ時は visibility: hidden。これで flex の計算を崩さず負荷を下げる
      page.style.visibility = "hidden";
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
