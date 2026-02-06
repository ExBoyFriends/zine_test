// chapter2_5/interaction.js

import { state, resetTextState } from "../utils/state.js";
import { showPage, showText, hideText, getPages } from "./view.js";

const pages = getPages();
let startX = 0;
let startTime = 0;
let moved = false;

export function initTapInteraction() {
  // 二重登録を防ぐため、一度クリアしてから登録（念のため）
  document.removeEventListener("pointerdown", onPointerDown);
  document.addEventListener("pointerdown", onPointerDown);
}

function onPointerDown(e) {
  startX = e.clientX;
  startTime = performance.now();
  moved = false;

  const onPointerMove = (me) => {
    if (Math.abs(me.clientX - startX) > 15) moved = true;
  };

  const onPointerUp = (ue) => {
    const dx = ue.clientX - startX;
    const dt = performance.now() - startTime;

    if (moved && Math.abs(dx) > 40 && dt < 500) {
      dx < 0 ? goNext() : goPrev();
    } else if (!moved && dt < 300) {
      handleTap();
    }

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
    goNext();
  }
}

function goNext() {
  if (state.index >= pages.length - 1) return;
  state.index++;
  resetTextState();
  showPage(state.index);
}

function goPrev() {
  if (state.index <= 0) return;
  state.index--;
  resetTextState();
  showPage(state.index);
}
