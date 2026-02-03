
/* base.js */

/* =====================
   Global Interaction Lock
===================== */

document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("dragstart", e => {
  if (e.target.tagName === "IMG") e.preventDefault();
});

/* =====================
   iOS Gesture & Zoom Lock
===================== */

let lastTouch = 0;

document.addEventListener(
  "touchend",
  e => {
    const now = Date.now();
    if (now - lastTouch <= 300) e.preventDefault();
    lastTouch = now;
  },
  { passive: false }
);

["gesturestart", "gesturechange", "gestureend"].forEach(type => {
  document.addEventListener(type, e => e.preventDefault(), { passive: false });
});

document.addEventListener(
  "touchstart",
  e => {
    if (e.target.tagName === "IMG") e.preventDefault();
  },
  { passive: false }
);

/* =====================
   URL Bar Control (iOS)
===================== */

const hideURLBar = () => {
  if (window.matchMedia("(orientation: landscape)").matches) {
    window.scrollTo(0, 1);
  }
};

["orientationchange", "resize", "visibilitychange"].forEach(event => {
  window.addEventListener(event, () => {
    setTimeout(hideURLBar, 300);
  });
});

/* =====================
   Viewport Height Fix
===================== */

function setVh() {
  document.documentElement.style.setProperty(
    "--vh",
    `${window.innerHeight * 0.01}px`
  );
}

setVh();
window.addEventListener("resize", setVh);
window.addEventListener("orientationchange", setVh);

if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
  window.addEventListener("orientationchange", hideURLBar);
  window.addEventListener("resize", hideURLBar);
}

/* =====================
   Safari bfcache Restore
===================== */

window.addEventListener("pageshow", e => {
  if (!e.persisted) return;

  const fade = document.getElementById("fadeLayer");
  if (fade) {
    fade.classList.add("hide");
    fade.style.pointerEvents = "none";
  }

  window.scrollTo(0, 0);
  setVh();
});

