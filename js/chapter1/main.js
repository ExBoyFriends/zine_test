// モジュール構成を想定
import { initLoader } from "./loader.js";
import { initCarousel } from "./carousel.js";
import { initLastPage } from "./lastPage.js";

// DOM取得
const pages = document.querySelectorAll(".carousel-page");
const loader = document.getElementById("loader");
const wrapper = document.querySelector(".carousel-wrapper");
const lastTop = document.querySelector(".last-img.top");
const nextBtn = document.getElementById("next-chapter-btn");
const dots = document.querySelectorAll(".dot");

// ローダー初期化
initLoader(pages, loader);

// カルーセル初期化（ドラッグ対応）
const carousel = initCarousel(wrapper, pages, dots);

// 最後ページ初期化
initLastPage(lastTop, nextBtn);