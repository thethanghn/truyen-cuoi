// Story wall: random order on every visit, infinite loading, and "read" stories
// (double click / double tap) remembered in this browser's localStorage.
(function () {
  var BATCH_SIZE = 30;
  var STORAGE_KEY = "truyencuoi.readIds";

  var container = document.getElementById("masonry-container");
  var status = document.getElementById("infinite-status") || document.querySelector(".infinite-status");
  var showRead = new URLSearchParams(location.search).has("read");

  document.querySelectorAll("[data-view]").forEach(function (li) {
    li.classList.toggle("active", li.dataset.view === (showRead ? "read" : "unread"));
  });

  // --- read tracking -------------------------------------------------------
  function loadReadIds() {
    try {
      return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").map(Number));
    } catch (e) {
      return new Set();
    }
  }
  var readIds = loadReadIds();

  function markRead(id) {
    readIds.add(id);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(readIds))); } catch (e) { /* private mode */ }
  }

  // --- helpers --------------------------------------------------------------
  function shuffle(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = list[i]; list[i] = list[j]; list[j] = tmp;
    }
    return list;
  }

  function setStatus(text) { status.textContent = text; }

  function buildPost(story) {
    var post = document.createElement("div");
    post.className = "post";
    post.dataset.id = story.id;

    var divider = document.createElement("div");
    divider.className = "divider";
    divider.textContent = "****";

    post.appendChild(divider);
    post.appendChild(TruyenCuoi.renderStory(story));
    return post;
  }

  // --- wall -----------------------------------------------------------------
  var masonry = new Masonry(container, { itemSelector: ".post", gutter: 5, transitionDuration: "0.3s" });
  var queue = [];
  var observer = null;

  function renderNextBatch() {
    var batch = queue.splice(0, BATCH_SIZE);
    if (!batch.length) return;

    var elements = batch.map(buildPost);
    var fragment = document.createDocumentFragment();
    elements.forEach(function (el) { fragment.appendChild(el); });
    container.appendChild(fragment);
    masonry.appended(elements);
    imagesLoaded(elements, function () { masonry.layout(); });

    if (queue.length) {
      setStatus("");
    } else {
      setStatus("No more stories.");
      if (observer) observer.disconnect();
    }
  }

  function startInfiniteLoading() {
    observer = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) renderNextBatch();
    }, { rootMargin: "800px 0px" });
    observer.observe(status);
  }

  function hidePost(post) {
    markRead(Number(post.dataset.id));
    post.classList.add("is-leaving");
    setTimeout(function () {
      masonry.remove(post);
      masonry.layout();
      // Keep the screen filled if we removed the last visible ones.
      if (queue.length && status.getBoundingClientRect().top < window.innerHeight) renderNextBatch();
    }, 400);
  }

  if (!showRead) {
    container.addEventListener("dblclick", function (event) {
      var post = event.target.closest(".post");
      if (post) hidePost(post);
    });

    var lastTap = { el: null, at: 0 };
    container.addEventListener("touchend", function (event) {
      var post = event.target.closest(".post");
      if (!post) return;
      var now = Date.now();
      if (lastTap.el === post && now - lastTap.at < 300) {
        event.preventDefault();
        hidePost(post);
        lastTap = { el: null, at: 0 };
      } else {
        lastTap = { el: post, at: now };
      }
    });
  }

  TruyenCuoi.loadStories().then(function (stories) {
    queue = shuffle(stories.filter(function (s) { return showRead === readIds.has(s.id); }));
    if (!queue.length) {
      setStatus(showRead ? "You haven't hidden any stories yet." : "You've read everything!");
      return;
    }
    renderNextBatch();
    startInfiniteLoading();
  }).catch(function (error) {
    console.error(error);
    setStatus("Couldn't load stories.");
  });
})();
