const panels = [...document.querySelectorAll(".panel")];
const ring = document.querySelector(".ring");

let current = 0;
let startX = 0;

/* 円弧っぽい配置定義 */
const layout = {
  0:  { x:   0, z:   0, rot:  0,  scale:1,   op:1 },
  1:  { x: 140, z:-120, rot:-25, scale:.85, op:.6 },
 -1:  { x:-140, z:-120, rot: 25, scale:.85, op:.6 },
  2:  { x: 260, z:-260, rot:-45, scale:.7,  op:0 },
 -2:  { x:-260, z:-260, rot: 45, scale:.7,  op:0 }
};

function update(){
  panels.forEach((p,i)=>{
    let d = i - current;
    if(d > 2) d -= panels.length;
    if(d < -2) d += panels.length;

    const s = layout[d];
    if(!s){
      p.style.opacity = 0;
      p.style.transform = "translateZ(-600px)";
      return;
    }

    p.style.opacity = s.op;
    p.style.transform = `
      translateX(${s.x}px)
      translateZ(${s.z}px)
      rotateY(${s.rot}deg)
      scale(${s.scale})
    `;
  });
}

update();

/* ドラッグ操作 */
window.addEventListener("pointerdown",e=>{
  startX = e.clientX;
});

window.addEventListener("pointerup",e=>{
  const dx = e.clientX - startX;
  if(dx > 40) current = (current - 1 + panels.length) % panels.length;
  if(dx < -40) current = (current + 1) % panels.length;
  update();
});

/* 外側はゆっくり流すだけ */
let offset = 0;
function animate(){
  offset += 0.3;
  ring.style.backgroundPositionX = `${offset}px`;
  requestAnimationFrame(animate);
}
animate();

