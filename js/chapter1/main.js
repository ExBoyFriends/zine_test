import { initLoader } from "./loader.js";
import { initCarousel } from "./carousel.js";
import { initLastPage } from "./lastPage.js";

const pages       = document.querySelectorAll(".carousel-page");
const wrapper     = document.querySelector(".carousel-wrapper");
const loader      = document.getElementById("loader");
const dots        = document.querySelector(".dots");
const lastWrapper = document.querySelector(".last-img-wrapper");

/* =====================
   Chapter1 Start Logic
===================== */

function startChapter1() {
  pages[0]?.classList.add("active");
  dots?.classList.add("visible");
}

/* =====================
   Init
===================== */

initLoader(loader, startChapter1);

const carousel = initCarousel(wrapper, pages);

initLastPage(
  lastWrapper,
  () => carousel.getCurrentPage(),
  pages.length
);
