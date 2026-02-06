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
      // 表示フロー：まずvisibleにしてから、CSSのtransition（opacity）を効かせる
      page.style.visibility = "visible";
      page.classList.add("active");
    } else {
      // 非表示フロー：クラスを外して、visibilityを隠す
      page.classList.remove("active", "show-text");
      page.style.visibility = "hidden";
    }
  });

  // Dualページの反転処理（datasetを使用して状態を保持）
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
