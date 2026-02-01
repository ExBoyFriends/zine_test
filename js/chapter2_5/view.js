// js/chapter2_5/view.js

const pages = Array.from(document.querySelectorAll(".page"));

export function getPages() {
  return pages;
}

export function showPage(index) {
  const current = document.querySelector(".page.active");

  if (current) {
    current.classList.add("fading-out");

    // フェードアウト完了後に切り替え
    setTimeout(() => {
      current.classList.remove("active", "fading-out");

      activate(index);
    }, 700); // ← フェードアウト時間（体感）
  } else {
    activate(index);
  }
}

function activate(index) {
  const page = pages[index];
  if (!page) return;

  // フェードインはCSS任せ
  page.classList.add("active");
}
