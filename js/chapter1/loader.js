export function initLoader(pages, loader, dotsContainer){
  window.addEventListener('load', ()=>{
    pages[0].classList.add('first-load','active');
    loader.style.display = 'block';

    setTimeout(()=>{
      loader.style.display = 'none';
      pages[0].classList.remove('first-load');
      pages[0].style.transition = 'opacity 5.2s ease';
      dotsContainer.classList.add('visible');
    },7280);
  });
}