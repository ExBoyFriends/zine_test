// main.js

import { initLoader } from "../loader.js";
import { initCarousel } from "./carousel.js";
import { initLastPage } from "./lastPage.js";

const pages   = document.querySelectorAll(".carousel-page");
const wrapper = document.querySelector(".carousel-wrapper");
const loader  = document.getElementById("loader");
const dots    = document.querySelector(".dots");

function startChapter1() {
  requestAnimationFrame(() => {
    pages[0]?.classList.add("active");
    dots?.classList.add("visible");
  });
}

initLoader(loader, startChapter1);

const carousel = initCarousel(wrapper, pages);

initLastPage(
  document.querySelector(".last-img-wrapper"),
  () => carousel.getCurrentPage(),
  pages.length
);

