export function initLoader(pages, loader, dotsContainer){
  window.addEventListener('load', ()=>{
    const firstPage = pages[0];
    firstPage.classList.add('first-load','active');

    loader.style.display='block';
    loader.style.opacity='1';

    setTimeout(()=>{
      loader.style.transition='opacity 0.5s ease';
      loader.style.opacity='0';

      setTimeout(()=>loader.style.display='none', 500);

      dotsContainer.classList.add('visible');
    }, 7280);
  });
}