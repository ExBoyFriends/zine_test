// chapter2/transitionOut.js

let startTime = null, rafId = null;
const TOTAL = 3000, FADE_FULL = 2500;

export function playExitTransition({ onFinish }) {
  const overlay = document.getElementById("fadeout");
  // カルーセル全体を包んでいる .chapter を取得
  const chapter = document.querySelector(".chapter"); 
  
  if (!overlay) { onFinish?.(); return; }
  cancelAnimationFrame(rafId);
  startTime = performance.now();
  
  overlay.classList.remove("active");
  overlay.style.opacity = "0";
  overlay.style.pointerEvents = "auto";

  function tick(now) {
    const t = now - startTime;
    const p = Math.min(t / FADE_FULL, 1);
    
    // 黒ベタのフェードイン
    overlay.style.opacity = p * p;
    
    // 【追加】カルーセル本体を徐々に透明にする（回転は止まらない）
    if (chapter) {
      chapter.style.opacity = (1 - p).toString();
    }

    if (t >= TOTAL) { 
      cancelAnimationFrame(rafId); 
      overlay.classList.add("active"); 
      onFinish?.(); 
      return; 
    }
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);
}
