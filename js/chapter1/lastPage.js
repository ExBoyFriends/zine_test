export function initLastPage(wrapper, getCurrentPage, totalPages) {
  let opened = false;
  let startX = 0;

  const TAP_THRESHOLD = 6;
  const slideTop = document.querySelector('.slide-top');
  const tapCover = document.querySelector('.tap-cover');
  const rightDot = document.querySelector('.dot.right-dot');

  const duration = '0.9s';
  
 const applyX = x => {
   slideTop.style.transition = `transform ${duration} ease-out`;
   tapCover.style.transition = `transform ${duration} ease-out`;
   
  slideTop.style.transition = 
   　　　　　　'transform 1.4s cubic-bezier(.16,1.3,.3,1)';
  slideTop.style.transform = `translateX(${x}px)`;
};


  const open = () => {
    opened = true;

 const visibleWidth = slideTop.clientWidth / 2;

    tapCover.style.width = `${visibleWidth}px`;
    tapCover.style.pointerEvents = 'auto';
    
    applyX(-visibleWidth);
    rightDot?.classList.add('active');
  };

  const close = () => {
    opened = false;

   tapCover.style.pointerEvents = 'none';
   tapCover.style.width = '0';
    
    applyX(0);
    rightDot?.classList.remove('active');
  };

  wrapper.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== totalPages - 1) return;
    startX = e.clientX;
  });

  wrapper.addEventListener('pointerup', e => {
    if (getCurrentPage() !== totalPages - 1) return;
    
    const dx = e.clientX - startX;
    if (Math.abs(dx) < TAP_THRESHOLD) {
      opened ? close() : open();
    }
  });

 /* ★ tap-cover 専用：確実に close */
  tapCover.addEventListener('pointerup', e => {
    e.stopPropagation();
    close();
  });
  
}

