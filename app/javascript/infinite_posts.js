// Infinite loading for the posts wall: when the reader nears the bottom, fetch
// the next page (the will_paginate "next" link), append its posts to the
// Masonry grid and repeat until there are no more pages. The pagination links
// stay in the HTML as a no-JS fallback but are hidden once this is running.
export function infinitePosts(container, {
  itemSelector = ".post",
  paginationSelector = "ul.pagination",
  nextSelector = 'ul.pagination a[rel="next"]',
  rootMargin = "800px 0px",
} = {}) {
  const $ = window.jQuery;
  const $container = $(container);
  if (!$container.length) return;

  const pagination = document.querySelector(paginationSelector);
  let nextUrl = document.querySelector(nextSelector)?.href;
  if (pagination) pagination.style.display = "none";

  const status = document.createElement("div");
  status.className = "infinite-status text-center text-muted";
  $container.after(status);

  const setStatus = (text) => { status.textContent = text; };
  if (!nextUrl) { setStatus($container.find(itemSelector).length ? "No more stories." : ""); return; }

  let loading = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) loadNext();
  }, { rootMargin });
  observer.observe(status);

  async function loadNext() {
    if (loading || !nextUrl) return;
    loading = true;
    setStatus("Loading more stories…");

    try {
      const response = await fetch(nextUrl, { headers: { Accept: "text/html" }, credentials: "same-origin" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const doc = new DOMParser().parseFromString(await response.text(), "text/html");

      const items = [...doc.querySelectorAll(`${container} ${itemSelector}`)]
        .filter((item) => !document.getElementById(item.id)); // skip anything already on the page
      nextUrl = doc.querySelector(nextSelector)?.href;

      if (items.length) {
        const $items = $(items).css({ opacity: 0 });
        $container.find(".clearfix").last().before($items);
        $items.imagesLoaded(() => {
          $container.masonry("appended", $items);
          $items.animate({ opacity: 1 });
        });
      }

      if (nextUrl) {
        setStatus("");
      } else {
        setStatus("No more stories.");
        observer.disconnect();
      }
    } catch (error) {
      console.error("Infinite loading failed", error);
      setStatus("Couldn't load more stories. Scroll to try again.");
    } finally {
      loading = false;
    }

    // If the new posts didn't fill the screen, keep going.
    if (nextUrl && status.getBoundingClientRect().top < window.innerHeight + 800) loadNext();
  }
}
