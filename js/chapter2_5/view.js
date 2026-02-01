const pages = Array.from(document.querySelectorAll(".page"));

export function getPages() {
  return pages;
}

export function showPage(index) {
  pages.forEach(p => {
    p.classList.remove("active", "fading-out", "show-text");
    delete p.dataset.textShown;
  });

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
  delete page.dataset.textShown;
}
