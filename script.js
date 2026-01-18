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

if (mode === "image") {
  let next = imgOffsetX + dx;

  if (next >= minImgOffset && next <= maxImgOffset) {
    img.style.transform = `translate(${next}px, -50%)`;
  } else {
    // 画像は端で止める
    next = Math.max(minImgOffset, Math.min(maxImgOffset, next));
    img.style.transform = `translate(${next}px, -50%)`;

    // ここで初めてページモードに移行
    mode = "page";
    pageStartX = x;
    pageTranslate = -currentPage * window.innerWidth;
  }
}

if (mode === "page") {
  const dx = e.changedTouches[0].clientX - pageStartX;
  const threshold = 80;

  let nextPage = currentPage;

  if (dx < -threshold && currentPage < pageEls.length - 1) {
    nextPage++;
  }
  if (dx > threshold && currentPage > 0) {
    nextPage--;
  }

  // ページを決定
  currentPage = nextPage;

  // ページ送りアニメーション（紙っぽく）
  pages.style.transition =
    "transform 0.5s cubic-bezier(.25,.8,.25,1)";
  pages.style.transform =
    `translateX(${-currentPage * window.innerWidth}px)`;

  // ここでは画像をリセットしない
  // ページが切り替わり終わった後にだけ初期化する
  pages.addEventListener("transitionend", () => {
    const img = imgs[currentPage];
    imgOffsets[currentPage] = 0;
    img.style.transition = "transform 0.25s ease";
    img.style.transform = `translate(0, -50%)`;
  }, { once:true });
}

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