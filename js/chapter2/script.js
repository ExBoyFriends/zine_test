document.addEventListener("DOMContentLoaded", () => {

  const slides = document.querySelectorAll(".slide");
  const total = slides.length;
  let current = 0;

  const positions = {
     0: { x: 0,  z: 0,   r: 0,   o: 1 },
    -1: { x:-45, z:120, r: 30,  o: .8 },
     1: { x: 45, z:120, r:-30,  o: .8 },
    -2: { x:-90, z:260, r: 60,  o: 0 },
     2: { x: 90, z:260, r:-60,  o: 0 }
  };

  function rel(i){
    let d = i - current;
    if (d > total/2) d -= total;
    if (d < -total/2) d += total;
    return d;
  }

  function render(){
    slides.forEach((s,i)=>{
      const p = positions[rel(i)];
      if(!p){ s.style.opacity=0; return; }

      s.style.transform = `
        translate(-50%, -50%)
        translateX(${p.x}%)
        translateZ(${p.z}px)
        rotateY(${p.r}deg)
      `;
      s.style.opacity = p.o;
    });
  }

  render();

  let sx = 0;
  window.addEventListener("touchstart",e=>sx=e.touches[0].clientX);
  window.addEventListener("touchend",e=>{
    const dx = e.changedTouches[0].clientX - sx;
    if(Math.abs(dx)>30){
      current = dx<0 ? (current+1)%total : (current-1+total)%total;
      render();
    }
  });
});

