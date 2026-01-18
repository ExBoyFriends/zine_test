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

/* 状態 */
let dragging = false;
let mode = "image"; // image → page に切り替わる

/* 画像可動範囲 */
let minImgOffset = 0;
let maxImgOffset = 0;

function setupImages(){
  pageEls.forEach((page, index)=>{
    const img = imgs[index];
    const vw = window.innerWidth;

    // 画像サイズ：半分見切れ
    const size = vw * 2 * 0.9;
    img.style.width  = size + "px";
    img.style.height = size + "px";

    imgOffsetX = 0;

    // 左余白取得
    const style = getComputedStyle(page);
    const leftPadding = parseFloat(style.paddingLeft);

    // 画像の可動範囲
    maxImgOffset = 0;
    minImgOffset = vw - size;

    img.style.transform = `translate(${imgOffsetX}px, -50%)`;
  });
}

/* タッチ開始 */
stage.addEventListener("touchstart", e=>{
  dragging = true;
  mode = "image";
  pageStartX = e.touches[0].clientX;
  imgStartX  = pageStartX;
});

/* タッチ移動 */
stage.addEventListener("touchmove", e=>{
  if(!dragging) return;
  e.preventDefault();

  const x = e.touches[0].clientX;
  const dx = x - imgStartX;

  const img = imgs[currentPage];
  const page = pageEls[currentPage];

  if(mode === "image"){
    let next = imgOffsetX + dx;

    if(next >= minImgOffset && next <= maxImgOffset){
      // まだ画像の中で動いている
      img.style.transform = `translate(${next}px, -50%)`;
    }else{
      // 画像が端に当たった
      mode = "page";

      // 端に固定
      next = Math.max(minImgOffset, Math.min(maxImgOffset, next));
      img.style.transform = `translate(${next}px, -50%)`;

      // 余った力をページ送りに
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

  if(mode === "image"){
    // 画像の位置を保存
    const img = imgs[currentPage];
    const m = /translate\(([-\d.]+)px/.exec(img.style.transform);
    if(m) imgOffsetX = parseFloat(m[1]);
  }

  if(mode === "page"){
    const dx = e.changedTouches[0].clientX - pageStartX;
    const threshold = 80;

    if(dx < -threshold && currentPage < pageEls.length-1){
      currentPage++;
    }
    if(dx > threshold && currentPage > 0){
      currentPage--;
    }

    // ページ位置を確定
    pages.style.transition = "transform 0.35s ease";
    pages.style.transform =
      `translateX(${-currentPage * window.innerWidth}px)`;
  }
});

/* 初期化 */
window.addEventListener("load", ()=>{
  setupImages();
  pages.style.transform = "translateX(0)";
});