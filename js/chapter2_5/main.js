// js/chapter2_5/main.js
// Chapter 2.5
// tap:
// ① テキスト非表示 → 表示
// ② テキスト表示中 → 非表示
// ③ テキスト非表示で再tap → 次のページ

const pages = Array.from(document.querySelectorAll(".page"));

let index = 0;
let showingText = false;

function showPage(i) {
  pages.forEach(p => {
    p.classList.remove("active", "show-text");
  });

  const page = pages[i];
  if (!page) return;

  page.classList.add("active");
  showingText = false;
}

function toggleText() {
  const page = pages[index];
  if (!page) return;

  showingText = !showingText;
  page.classList.toggle("show-text", showingText);
}

function nextPage() {
  if (index >= pages.length - 1) return;
  index++;
  showPage(index);
}

document.addEventListener("pointerdown", () => {
  const page = pages[index];
  if (!page) return;

  if (showingText) {
    // テキストを閉じる
    toggleText();
    return;
  }

  // まだ一度もテキストを出していない場合
  if (!page.dataset.textShown) {
    page.dataset.textShown = "1";
    toggleText();
    return;
  }

  // 読まずに次へ行くこともできる
  nextPage();
});

// 初期表示
showPage(index);
