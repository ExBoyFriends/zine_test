// ページ内画像ドラッグ（カルーセルページ個別スクロール）
document.querySelectorAll('.carousel-inner').forEach(inner => {
  let isDrag=false, startX=0, scrollLeft=0;

  inner.addEventListener('mousedown', e => {
    isDrag=true;
    inner.classList.add('dragging');
    startX = e.pageX - inner.offsetLeft;
    scrollLeft = inner.scrollLeft;
  });
  inner.addEventListener('mouseleave', () => { 
    isDrag=false; 
    inner.classList.remove('dragging'); 
  });
  inner.addEventListener('mouseup', () => { 
    isDrag=false; 
    inner.classList.remove('dragging'); 
  });
  inner.addEventListener('mousemove', e => { 
    if(!isDrag) return; 
    e.preventDefault();
    inner.scrollLeft = scrollLeft + (startX - (e.pageX - inner.offsetLeft));
  });

  // タッチ対応
  inner.addEventListener('touchstart', e => {
    isDrag=true;
    startX = e.touches[0].pageX - inner.offsetLeft;
    scrollLeft = inner.scrollLeft;
  });
  inner.addEventListener('touchmove', e => {
    if(!isDrag) return;
    inner.scrollLeft = scrollLeft + (startX - (e.touches[0].pageX - inner.offsetLeft));
  });
  inner.addEventListener('touchend', () => { isDrag=false; });
});