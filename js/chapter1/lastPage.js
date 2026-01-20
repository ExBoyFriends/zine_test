export function initLastPage(topImg, btn) {
  let shifted = false;

  topImg.addEventListener("click", ()=>{
    shifted = !shifted;
    if(shifted){
      topImg.style.transform = "translate(-75%, -50%)"; // 半分見切れ
      btn.style.opacity = 1;
    }else{
      topImg.style.transform = "translate(-50%, -50%)"; // 中央
      btn.style.opacity = 0;
    }
  });
}