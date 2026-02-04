// chapter2_5/view.js

import { state } from "../utils/state.js";

let dualFlipped = false;
let isFading = false;

const pages = Array.from(document.querySelectorAll(".page"));
const dots  = Array.from(document.querySelectorAll(".dot"));

export function getPages() {
  return pages;
}

/* ===================== Dots update ===================== */
function updateDots(index) {
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

/* ===================== Page control ===================== */
export function showPage(index) {
  if (!pages.length || isFading) return;

  const prevPage = pages[state.index];
  const nextPage = pages[index];
  if (!nextPage) return;

  isFading = true;

  // 1. 全ページの z-index を下げ、active を外す準備
  // これにより、今見えているページ以外が「手前」に来るのを防ぐ
  pages.forEach(p => {
    p.style.zIndex = "1";
    if (p !== nextPage && p !== prevPage) {
       p.classList.remove("active", "show-text");
    }
  });

  // 2. 次のページを「一番手前」に設定して表示開始
  nextPage.style.zIndex = "10";
  nextPage.classList.add("active");

  // dualページ（4枚目）の反転処理
  if (nextPage.classList.contains("dual") && state.prevIndex !== index) {
    dualFlipped = !dualFlipped;
    nextPage.classList.toggle("flipped", dualFlipped);
  }

  // 3. 前のページを非アクティブ化
  if (prevPage && prevPage !== nextPage) {
    prevPage.classList.remove("active", "show-text");
  }

  // 4. 状態の更新とドットの同期
  updateDots(index);
  state.prevIndex = index;
  state.index = index;
  state.showingText = false;

  // 5. フェード時間（CSSの1.0s）に合わせてフラグを解除
  setTimeout(() => {
    isFading = false;
  }, 1000);
}

/* ===================== Text control ===================== */
export function showText(index) {
  const page = pages[index];
  if (!page) return;
  page.classList.add("show-text");
  state.showingText = true;
}

export function hideText(index) {
  const page = pages[index];
  if (!page) return;
  page.classList.remove("show-text");
  state.showingText = false;
}
