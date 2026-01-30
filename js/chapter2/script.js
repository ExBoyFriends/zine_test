const panels = [...document.querySelectorAll(".panel")];
const outer  = document.querySelector(".outer");

let current = 0;
let startX  = 0;
let dragging = false;

/* 配置更新 */
function update(){
  panels.forEach((p,i)=>{
    const diff = (i - current + panels.length) % panels.length;
    const d = diff > panels.length/2 ? diff - panels.length : diff;

    if(d === 0){
      // 奥中央（主役）
      p.style.opacity = 1;
      p.style.zIndex = 3;
      p.style.filter = "brightness(1)";
      p.style.transform =
        "translateZ(-320px) scale(1)";
    }
    else if(d === -1){
      // 左
      p.style.opacity = .55;
      p.style.zIndex = 2;
      p.style.filter = "brightness(.75)";
      p.style.transform =
        "translateX(-140px) translateZ(-240px) rotateY(18deg) scale(.85)";
    }
    else if(d === 1){
      // 右
      p.style.opacity = .55;
      p.style.zIndex = 2;
      p.style.filter = "brightness(.75)";
      p.style.transform =
        "translateX(140px) translateZ(-240px) rotateY(-18deg) scale(.85)";
    }
    else{
      // 非表示
      p.style.opacity = 0;
      p.style.zIndex = 1;
      p.style.transform =
        "translateZ(-600px) scale(.6)";
    }
  });
}

update();

/* ドラッグ操作（1枚ずつ回転） */
window.addEventListener("pointerdown", e=>{
  dragging = true;
  startX = e.clientX;
});

window.addEventListener("pointerup", e=>{
  if(!dragging) return;
  dragging = false;

  const dx = e.clientX - startX;
  if(dx > 40){
    current = (current - 1 + panels.length) % panels.length;
  }
  else if(dx < -40){
    current = (current + 1) % panels.length;
  }
  update();
});

/* 外側装飾は常に回転 */
let rot = 0;
function spin(){
  rot += 0.15;
  outer.style.backgroundPositionX = `${rot}px`;
  requestAnimationFrame(spin);
}
spin();

