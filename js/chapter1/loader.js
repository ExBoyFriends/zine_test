export function initLoader(pages, loader){
  window.addEventListener("load", ()=>{
    pages[0].classList.add("active");
    loader.style.opacity = 1;

    setTimeout(()=>{
      loader.style.opacity = 0;
      loader.style.pointerEvents = "none";
    }, 2000);

    setTimeout(()=>loader.remove(), 3500);
  });
}