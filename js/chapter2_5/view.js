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

export function showPage(index) {
  pages.forEach((page, i) => {
    const isActive = i === index;
    
    if (isActive) {
      // 1. まず「見える状態」にする（display:noneは使わない）
      page.style.pointerEvents = "auto";
      // 2. クラスを付けて CSS の transition を発動させる
      page.classList.add("active");
    } else {
      // 消える側も transition しながら消える
      page.classList.remove("active", "show-text");
      page.style.pointerEvents = "none";
    }
  });

  // ...DualページやDotsの処理はそのまま...
}

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
