
/* base.js */

/* =====================
   Global Interaction Lock
===================== */

// Disable context menu (including images)
document.addEventListener("contextmenu", e => {
  e.preventDefault();
});

// Disable image dragging
document.addEventListener("dragstart", e => {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
});

/* =====================
   iOS Gesture & Zoom Lock
===================== */

// Disable double-tap zoom (iOS Safari)
let lastTouch = 0;

document.addEventListener(
  "touchend",
  e => {
    const now = Date.now();

    if (now - lastTouch <= 300) {
      e.preventDefault();
    }

    lastTouch = now;
  },
  { passive: false }
);

// Disable pinch zoom (iOS Safari)
["gesturestart", "gesturechange", "gestureend"].forEach(type => {
  document.addEventListener(
    type,
    e => {
      e.preventDefault();
    },
    { passive: false }
  );
});

// Prevent image long-press / selection (iOS Safari)
document.addEventListener(
  "touchstart",
  e => {
    if (e.target.tagName === "IMG") {
      e.preventDefault();
    }
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

// Initial setup
setVh();

// Recalculate on resize / orientation change
window.addEventListener("resize", setVh);
window.addEventListener("orientationchange", setVh);

// iOS specific URL bar handling
if (navigator.userAgent.match(/iPhone|iPad|iPod/)) {
  window.addEventListener("orientationchange", hideURLBar);
  window.addEventListener("resize", hideURLBar);
}

/* =====================
   Safari bfcache Restore
===================== */

window.addEventListener("pageshow", e => {
  if (!e.persisted) return;

  // Reset fade-out state
  document.body.classList.remove("fade-out");

  const fade = document.getElementById("fadeLayer");

  if (fade) {
    // Correctly hide the fade layer (open it)
    fade.classList.add("hide");
    fade.style.pointerEvents = "none";
  }

  // Reset scroll position
  window.scrollTo(0, 0);

  // Recalculate viewport height
  setVh();
});

