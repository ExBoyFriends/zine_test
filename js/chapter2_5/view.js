

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
      // 表示するページだけを描画対象にする
      page.style.display = "flex";
      // 1フレーム遅らせてactiveクラスをつけることでtransitionを確実に発動
      requestAnimationFrame(() => {
        page.classList.add("active");
      });
    } else {
      // 非アクティブなページは完全に消す（メモリ解放）
      page.classList.remove("active", "show-text");
      page.style.display = "none";
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
