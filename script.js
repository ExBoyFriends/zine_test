const stage = document.getElementById("stage");
const img = document.getElementById("img");

let offsetX = 0;
let startX = 0;
let dragging = false;

let minOffsetX = 0;
let basePaddingLeft = 0;

function setupPortrait() {
const vw = stage.clientWidth;

// 画像サイズ：
// 画面幅の2倍 × 0.9 ＝ 少しゆったりした「半分見切れ」
const size = vw * 2 * 0.9;

img.style.width = size + "px";
img.style.height = size + "px";

img.style.left = "0";
img.style.top = "50%";
img.style.transform = "translate(0, -50%)";

// 初期の左余白を取得
const style = getComputedStyle(stage);
basePaddingLeft = parseFloat(style.paddingLeft);

// ドラッグ範囲
minOffsetX = vw - size; // これ以上左に行かない
offsetX = 0;

apply(offsetX);
}

function apply(x) {
// 範囲制限
x = Math.max(minOffsetX, Math.min(0, x));

// 進行度：0 → 左寄り、1 → 右端
const progress = Math.abs(x / minOffsetX);

// 余白を左から右へ「移動」
const leftPadding = basePaddingLeft * (1 - progress);
const rightPadding = basePaddingLeft * progress;

stage.style.paddingLeft = leftPadding + "px";
stage.style.paddingRight = rightPadding + "px";

img.style.transform = `translate(${x}px, -50%)`;
}

/* タッチ操作 */
stage.addEventListener("touchstart", e => {
dragging = true;
startX = e.touches[0].clientX;
});

stage.addEventListener("touchmove", e => {
if (!dragging) return;
e.preventDefault();

const dx = e.touches[0].clientX - startX;
apply(offsetX + dx);
});

stage.addEventListener("touchend", () => {
dragging = false;

// 現在位置を保存
const m = /translate\(([-\d.]+)px/.exec(img.style.transform);
if (m) offsetX = parseFloat(m[1]);
});

/* 初期化 */
img.onload = setupPortrait;
window.addEventListener("resize", setupPortrait);
