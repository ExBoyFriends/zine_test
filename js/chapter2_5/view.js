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
      // 1. 存在を出現させる (display: flex)
      page.classList.add("active");
      
      // 2. 1フレーム待ってからフェードイン (opacity: 1)
      requestAnimationFrame(() => {
        page.classList.add("visible");
      });
      
      page.style.pointerEvents = "auto";
    } else {
      // 非アクティブなページは即座に存在を消して負荷を下げる
      page.classList.remove("active", "visible", "show-text");
      page.style.pointerEvents = "none";
    }
  });

  // Dualページの反転処理
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
