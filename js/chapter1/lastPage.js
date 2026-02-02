//astPage.js

export function initLastPage(wrapper, getCurrentPage, totalPages) {
  let opened = false;
  let startX = 0;

  const TAP_THRESHOLD = 6;

  const lastPage = document.getElementById('last-page');
  const slideTop = lastPage?.querySelector('.slide-top'); // 見た目用
  const topHit   = lastPage?.querySelector('.top-hit');   // 🔴 開閉用
  const tapCover = lastPage?.querySelector('.tap-cover'); // 🟢 リンク用

  if (!lastPage || !slideTop || !topHit || !tapCover) return;

  const TRANSITION =
    'transform 1.4s cubic-bezier(.16,1.3,.3,1)';
  
 /* =====================
     遷移関数
  ===================== */
  const goChapter2 = () => {
    console.log("Chapter2へ遷移");
    location.href = "chapter2.html";
  };
  /* =====================
     開閉アニメーション
  ===================== */

  const topLayer = lastPage.querySelector('.top-layer');
  
  const applyX = x => {
    topLayer.style.transition = TRANSITION;
    topLayer.style.transform = `translateX(${x}px)`;
  };

  const open = () => {
    opened = true;
    lastPage.classList.add('opened');
    console.log("OPENED", lastPage.classList.contains("opened"));

    const slideWidth = slideTop.clientWidth / 2;
    applyX(-slideWidth);
  };

  const close = () => {
    opened = false;
    lastPage.classList.remove('opened');

    applyX(0);
  };

  /* =====================
     🔴 Top-hit だけで開閉
  ===================== */
  topHit.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    if (getCurrentPage() !== totalPages - 1) return;
    startX = e.clientX;
  });

  topHit.addEventListener('pointerup', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    const dx = e.clientX - startX;
    if (Math.abs(dx) < TAP_THRESHOLD) {
      e.stopPropagation();
      opened ? close() : open();
    }
  });

  /* =====================
     🟢 リンク時は伝播停止
  ===================== */
  tapCover.addEventListener('pointerup', e => {
    e.stopPropagation();
    if (!opened) return;
    goChapter2();
  });
  
  /* =====================
     ページ離脱時リセット
  ===================== */
  document.addEventListener('pointerup', () => {
    if (getCurrentPage() !== totalPages - 1 && opened) {
      close();
    }
  });
}　　　　　　

