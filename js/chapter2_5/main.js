// chapter2_5/main.js

import "../utils//base.js";
import { state } from "..utils/state.js";
import { initLoader } from "../loader.js";
import { startChapter } from "../chapterStart.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

/* =====================
   DOM
===================== */
const loader  = document.getElementById("loader");
const chapter = document.querySelector(".chapter");
const dots    = document.querySelector(".dots");

/* =====================
   dots
===================== */
function updateDots(index = 0) {
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

/* =====================
   Loader 完了
===================== */
initLoader(loader, () => {
  startChapter({
    chapter,
    dots,
    onStart() {
      // 表示同期
      showPage(state.index);
      updateDots(state.index);

      // interaction
      initTapInteraction();
    }
  });
});

/* =====================
   pageshow（bfcache）
===================== */
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;

  showPage(state.index);
  updateDots(state.index);
});


// js/chapter2_5/interaction.js
import { state, resetTextState } from "./state.js";
import { showPage, showText, hideText, getPages } from "./view.js";

const pages = getPages();

let startX = 0;
let startTime = 0;
let moved = false;

export function initTapInteraction() {
  document.addEventListener("pointerdown", e => {
    startX = e.clientX;
    startTime = performance.now();
    moved = false;
  });

  document.addEventListener("pointermove", e => {
    if (Math.abs(e.clientX - startX) > 15) {
      moved = true;
    }
  });

  document.addEventListener("pointerup", e => {
    const dx = e.clientX - startX;
    const dt = performance.now() - startTime;

    // ===== スワイプ =====
    if (moved && Math.abs(dx) > 40 && dt < 500) {
      dx < 0 ? goNext() : goPrev();
      return;
    }

    // ===== タップ =====
    if (!moved && dt < 300) {
      handleTap();
    }
  });
}

function handleTap() {
  const page = pages[state.index];
  if (!page) return;

  if (!state.showingText) {
    showText(state.index);
    state.showingText = true;
    return;
  }

  // テキストが開いていたら閉じて次へ
  hideText(state.index);
  state.showingText = false;
  goNext();
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



// chapter2_5/state.js

export const state = {
  index: 0,
  prevIndex: null,
  showingText: false
};

export function resetTextState() {
  state.showingText = false;
}



// chapter2_5/view.js
import { state } from "./state.js";

let dualFlipped = false;

const pages = Array.from(document.querySelectorAll(".page"));
const dots  = Array.from(document.querySelectorAll(".dot"));

export function getPages() {
  return pages;
}

/* =====================
   Dots update（chapter1準拠）
===================== */
function updateDots(index) {
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

/* =====================
   Page control
===================== */
export function showPage(index) {
  if (!pages.length) return;

  pages.forEach(p => {
    p.classList.remove("active", "show-text");
  });

  const page = pages[index];
  if (!page) return;

  /* ---- dual（joker）反転 ----
     ・同じ index の再表示では反転しない
     ・bfcache 復帰時も破綻しない
  -------------------------------- */
  if (page.classList.contains("dual") && state.prevIndex !== index) {
    dualFlipped = !dualFlipped;
  }

  // dual 以外では flipped を残さない
  pages.forEach(p => {
    if (!p.classList.contains("dual")) {
      p.classList.remove("flipped");
    }
  });

  if (page.classList.contains("dual")) {
    page.classList.toggle("flipped", dualFlipped);
  }

  /* ---- dots ---- */
  updateDots(index);

  /* ---- active ---- */
  page.classList.add("active");

  /* ---- state ---- */
  state.prevIndex   = index;
  state.index       = index;
  state.showingText = false;
}

/* =====================
   Text control
===================== */
export function showText(index) {
  const page = pages[index];
  if (!page) return;

  page.classList.add("show-text");
  state.showingText = true;
}

export function hideText(index) {
  const page = pages[index];
  if (!page) return;

  page.classList.remove("show-text");
  state.showingText = false;
}
