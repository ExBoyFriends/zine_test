const pages = Array.from(document.querySelectorAll(".page"));

export function getPages() {
  return pages;
}

export function showPage(index) {
  const current = document.querySelector(".page.active");

  if (current) {
    current.classList.add("fading-out");

    setTimeout(() => {
      current.classList.remove("active", "fading-out", "show-text");
      activate(index);
    }, 700);
  } else {
    activate(index);
  }
}

function activate(index) {
  const page = pages[index];
  if (!page) return;

  page.classList.add("active");
}

export function showText(index) {
  const page = pages[index];
  if (!page) return;

  page.classList.add("show-text");
  page.dataset.textShown = "1";
}

export function hideText(index) {
  const page = pages[index];
  if (!page) return;

  page.classList.remove("show-text");
}

