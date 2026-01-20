export function initLoader(pages, loader, dotsContainer){
  window.addEventListener('load', ()=>{
    const firstPage = pages[0];
    firstPage.classList.add('first-load','active');
    loader.style.display='block';

    setTimeout(()=>{
      loader.style.display='none';
      firstPage.classList.remove('first-load');
      firstPage.style.transition='opacity 5.2s ease';
      dotsContainer.classList.add('visible');
    },7280);
  });
}