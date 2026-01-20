// main.js
import { initLoader } from "./loader.js";
import { initCarousel } from "./carousel.js";
import { initLastPage } from "./lastPage.js";

const pages = document.querySelectorAll(".carousel-page");
const loader = document.getElementById("loader");
const wrapper = document.querySelector(".carousel-wrapper");
const lastImg = document.querySelector(".last-img.top");

initLoader(pages, loader);

const carousel = initCarousel(wrapper, pages);

initLastPage(lastImg, carousel.getCurrentPage, pages.length);