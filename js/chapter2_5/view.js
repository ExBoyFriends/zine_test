// chapter2_5/view.js
// 関数の外（トップレベル）では DOM 検索を行わず、変数定義のみに留める
let _pages = null;
let _dots = null;

/**
 * 必要な時にだけ DOM を検索し、結果をキャッシュする内部関数
 */
function getElements() {
  if (!_pages) {
    _pages = Array.from(document.querySelectorAll(".page"));
  }
  if (!_dots) {
    _dots = Array.from(document.querySelectorAll(".dot"));
  }
  return { pages: _pages, dots: _dots };
}

/**
 * 全ページ要素を取得する
 */
export function getPages() { 
  return getElements().pages; 
}

/**
 * ドット（インジケーター）の表示を更新する
 */
function updateDots(index) {
  const { dots } = getElements();
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

/**
 * 指定したインデックスのページを表示し、他を非表示にする
 */
export function showPage(index) {
  const { pages } = getElements(); // 実行された瞬間に初めて DOM を触る
  
  pages.forEach((page, i) => {
    const isActive = i === index;
    
    if (isActive) {
      // 1. 存在を出現させる (display: flex)
      page.classList.add("active");
      
      // 2. 描画の準備が整ってからフェードイン (opacity: 1)
      requestAnimationFrame(() => {
        page.classList.add("visible");
      });
      
      page.style.pointerEvents = "auto";
    } else {
      // 非アクティブなページは即座にクラスを外して負荷を下げる
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

/**
 * テキスト帯（詩）を表示する
 */
export function showText(index) {
  const { pages } = getElements();
  if (pages[index]) {
    pages[index].classList.add("show-text");
  }
}

/**
 * テキスト帯（詩）を非表示にする
 */
export function hideText(index) {
  const { pages } = getElements();
  if (pages[index]) {
    pages[index].classList.remove("show-text");
  }
}
