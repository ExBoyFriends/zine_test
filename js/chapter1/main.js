// chapter1/main.js
import { initCarousel } from "../carousel.js";  // carousel.js をインポート

// ここで `state` を定義する (もし未定義の場合)
let state = {
  index: 0
};

// ページが変更されたときに state.index を更新する
function updateStateIndex(newIndex) {
  state.index = newIndex;
  updateDots();  // ドットの状態を更新
  normalize();   // 表示状態を更新
}

// carousel の初期化
const wrapper = document.querySelector(".carousel-wrapper");
const pages = document.querySelectorAll(".carousel-page");

initCarousel(wrapper, pages);

// state.index を更新するときにドットを更新する
function updateDots() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === state.index);
  });
}

// ページの表示を更新する関数
function normalize() {
  pages.forEach((p, i) => {
    p.style.transition = "opacity .8s ease";
    p.style.opacity = i === state.index ? 1 : 0;
    p.classList.toggle("active", i === state.index);

    const inner = p.querySelector(".carousel-inner");
    if (inner) {
      inner.style.transition = "transform .8s ease";
      inner.style.transform = "translateX(0)";
    }
  });
}

// 例えば、state.index が更新される時に以下のように使う
updateStateIndex(2); // ページを 2 番目に設定
