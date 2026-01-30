const panels = [...document.querySelectorAll(".panel")];
const outer = document.querySelector(".outer");

let current = 0;
let startX = 0;

function update(){
  panels.forEach((p,i)=>{
    const d = ((i - current + panels.length) % panels.length);
    const pos = d > panels.length/2 ? d-panels.length : d;

    if(pos === 0){
      p.style.opacity = 1;
      p.style.transform = "translateZ(-280px)";
    }
    else if(pos === -1){
      p.style.opacity = .5;
      p.style.transform = "translateX(-120px) translateZ(-200px)";
    }
    else if(pos === 1){
      p.style.opacity = .5;
      p.style.transform = "translateX(120px) translateZ(-200px)";
    }
    else{
      p.style.opacity = 0;
      p.style.transform = "translateZ(-600px)";
    }
  });
}

update();

window.addEventListener("pointerdown",e=>{
  startX = e.clientX;
});

window.addEventListener("pointerup",e=>{
  const dx = e.clientX - startX;
  if(dx > 40) current = (current-1+panels.length)%panels.length;
  if(dx < -40) current = (current+1)%panels.length;
  update();
});

/* 外側は常に回る */
let rot = 0;
function spin(){
  rot += .1;
  outer.style.backgroundPositionX = `${rot}px`;
  requestAnimationFrame(spin);
}
spin();
