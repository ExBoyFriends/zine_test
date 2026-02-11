// chapter2_5/interaction.js

import { state } from "../utils/state.js";
import { showText, hideText } from "./view.js";

let startX = 0;
let startTime = 0;
let moved = false;

let goNextFn;
let goPrevFn;

export function initTapInteraction({ goNext, goPrev }) {

  goNextFn = goNext;
  goPrevFn = goPrev;

  document.removeEventListener("pointerdown", onPointerDown);
  document.addEventListener("pointerdown", onPointerDown);
}

function onPointerDown(e) {
  if (e.button !== 0 && e.pointerType === "mouse") return;

  startX = e.clientX;
  startTime = performance.now();
  moved = false;

  const onPointerUp = (ue) => {
    const dx = ue.clientX - startX;
    const dt = performance.now() - startTime;

    if (moved && Math.abs(dx) > 40 && dt < 500) {
      dx < 0 ? goNextFn() : goPrevFn();
    } else if (!moved && dt < 300) {
      handleTap();
    }

    cleanup();
  };

  const onPointerMove = (me) => {
    if (Math.abs(me.clientX - startX) > 15) moved = true;
  };

  const cleanup = () => {
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  };

  document.addEventListener("pointermove", onPointerMove);
  document.addEventListener("pointerup", onPointerUp);
}

function handleTap() {
  if (!state.showingText) {
    showText(state.index);
    state.showingText = true;
  } else {
    hideText(state.index);
    state.showingText = false;
    goNextFn();
  }
}

