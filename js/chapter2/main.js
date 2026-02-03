// chapter2/main.js

import "../base.js";
import { initLoader } from "../loader.js";
import { initCarousel3D } from "./carousel3d.js";
import { initDragInput } from "./inputDrag.js";
import {
  bindLongPressEvents,
  startAutoTransition,
  resetTransitionState,
  setHoldEffects
} from "./holdTransition.js";
import { playExitTransition } from "./transitionOut.js";
import {
  initGlitchLayer,
  startGlitch,
  stopGlitch
} from "./effects.js";

/* =====================
   DOM
===================== */
const scene     = document.querySelector(".scene");
const loader    = document.getElementById("loader");
const fadeLayer = document.getElementById("fadeLayer");

const dotsWrap = document.querySelector(".dots");
const dots     = [...document.querySelectorAll(".dot")];

/* =====================
   長押し bind（1回だけ）
===================== */
function bindHoldOnce() {
  if (scene && !scene.__holdBound) {
    bindLongPressEvents(scene);
    scene.__holdBound = true;
  }
}
bindHoldOnce();

/* =====================
   Dots
===================== */
function updateDots(index = 0) {
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

/* =====================
   Carousel
===================== */
const carousel = initCarousel3D({
  onIndexChange(index) {
    updateDots(index);
  }
});

if (carousel) {
  initDragInput(carousel);
  updateDots(0);
}

/* =====================
   Glitch
===================== */
initGlitchLayer?.();

/* =====================
   Chapter2 → 2.5
===================== */
function goChapter25() {
  if (goChapter25._done) return;
  goChapter25._done = true;

  playExitTransition({
    onFinish() {
      location.href = "chapt
