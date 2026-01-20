export function initLoader(pages, loader, dotsContainer){
  window.addEventListener('load', ()=>{
    const firstPage = pages[0];
    firstPage.classList.add('first-load','active');
    
    loader.style.display='block';
    loader.style.opacity = '1'; // 初期表示確実に

    // 初回フェード
    setTimeout(()=>{
      loader.style.transition='opacity 0.5s ease';
      loader.style.opacity='0';
      firstPage.classList.remove('first-load');
      
      dotsContainer.classList.add('visible');
      
      // loader を完全削除
      setTimeout(()=>loader.style.display='none', 500);
    }, 7280);
  });
}