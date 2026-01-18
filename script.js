const stage = document.getElementById("stage");
const pages = document.getElementById("pages");
const pageEls = document.querySelectorAll(".page");
const imgs = document.querySelectorAll(".art");

let currentPage = 0;

/* ページ送り用 */
let pageStartX = 0;
let pageTranslate = 0;

/* 画像用 */
let imgStartX = 0;
let imgOffsetX = 0;

/* ページごとの画像位置を保存 */
let imgOffsets = [];

/* 状態 */
let dragging = false;
let mode = "image"; // image → page に切り替わる

/* 画像可動範囲 */
let minImgOffset = 0;
let maxImgOffset = 0;

/* 初期セットアップ */
function setupImages(){
  const vw = window.innerWidth;

  pageEls.forEach((page, index)=>{
    const img = imgs[index];

    // 画像サイズ：スクエアで「半分見切れ」
    const size = vw * 2 * 0.9;
    img.style.width  = size + "px";
    img.style.height = size + "px";

    // 各ページの初期オフセット
    imgOffsets[index] = 0;

    // 画像の可動範囲
    maxImgOffset = 0;
    minImgOffset = vw - size;

    img.style.transform = `translate(0, -50%)`;
  });

  pages.style.transform = `translateX(0)`;
}

/* タッチ開始 */
stage.addEventListener("touchstart", e=>{
  dragging = true;
  mode = "image";

  const x = e.touches[0].clientX;
  pageStartX = x;
  imgStartX = x;

  // 現在ページの画像位置を復元
  imgOffsetX = imgOffsets[currentPage] || 0;
});

/* タッチ移動 */
stage.addEventListener("touchmove", e=>{
  if(!dragging) return;
  e.preventDefault();

  const x = e.touches[0].clientX;
  const dx = x - imgStartX;

  const img = imgs[currentPage];

  if(mode === "image"){
    let next = imgOffsetX + dx;

    if(next >= minImgOffset && next <= maxImgOffset){
      // まだ画像が動ける範囲
      img.style.transform = `translate(${next}px, -50%)`;
    }else{
      // 画像が端に当たった → ページ送りへ
      mode = "page";

      // 画像は端で固定
      next = Math.max(minImgOffset, Math.min(maxImgOffset, next));
      img.style.transform = `translate(${next}px, -50%)`;

      // ページ用ドラッグ開始点をリセット
      pageStartX = x;
      pageTranslate = -currentPage * window.innerWidth;
    }
  }

  if(mode === "page"){
    const dxPage = x - pageStartX;
    pages.style.transition = "none";
    pages.style.transform =
      `translateX(${pageTranslate + dxPage}px)`;
  }
});

/* タッチ終了 */
stage.addEventListener("touchend", e=>{
  dragging = false;

  // 画像モードなら位置を保存
  if(mode === "image"){
    const img = imgs[currentPage];
    const m = /translate\(([-\d.]+)px/.exec(img.style.transform);
    if(m) imgOffsets[currentPage] = parseFloat(m[1]);
  }

  // ページ送りモードならページを確定
  if(mode === "page"){
    const dx = e.changedTouches[0].clientX - pageStartX;
    const threshold = 80;

    if(dx < -threshold && currentPage < pageEls.length - 1){
      currentPage++;
    }
    if(dx > threshold && currentPage > 0){
      currentPage--;
    }

    // ページ位置をスナップ
    pages.style.transition = "transform 0.35s ease";
    pages.style.transform =
      `translateX(${-currentPage * window.innerWidth}px)`;

    // 新しいページの画像は必ず初期位置へ
    const img = imgs[currentPage];
    imgOffsets[currentPage] = 0;
    img.style.transition = "transform 0.25s ease";
    img.style.transform = `translate(0, -50%)`;
  }
});

/* リサイズ対応 */
window.addEventListener("resize", ()=>{
  setupImages();
});

/* 初期化 */
window.addEventListener("load", ()=>{
  setupImages();
});