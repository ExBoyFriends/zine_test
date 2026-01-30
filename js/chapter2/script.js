const cylinder = document.getElementById("cylinder");

let rotY = 0;
let lastX = 0;
let dragging = false;
let velocity = 0;

const DAMPING = 0.94;

/* ドラッグ */
window.addEventListener("pointerdown", e=>{
  dragging = true;
  lastX = e.clientX;
  velocity = 0;
});

window.addEventListener("pointermove", e=>{
  if(!dragging) return;
  const dx = e.clientX - lastX;
  rotY += dx * 0.3;
  velocity = dx * 0.3;
  lastX = e.clientX;
});

window.addEventListener("pointerup", ()=>{
  dragging = false;
});

/* アニメーション */
function animate(){
  if(!dragging){
    rotY += velocity;
    velocity *= DAMPING;
  }

  cylinder.style.transform =
    `rotateX(-22deg) rotateY(${rotY}deg)`;

  requestAnimationFrame(animate);
}
animate();

