// Story wall: random order on every visit, loads more while scrolling, and
// double click / double tap hides a story once read. Hidden stories are kept in
// this browser's localStorage and listed under "Read" (double click there to
// bring one back).
(function () {
  var BATCH_SIZE = 30;
  var STORAGE_KEY = "truyencuoi.readIds";
  var LEAVE_MS = 250; // matches .post-card transition in site.scss

  var container = document.getElementById("masonry-container");
  var status = document.querySelector(".infinite-status");
  var hint = document.getElementById("hint");
  var showRead = new URLSearchParams(location.search).has("read");
  var isTouch = window.matchMedia("(hover: none)").matches;

  document.querySelectorAll("[data-view]").forEach(function (link) {
    link.classList.toggle("active", link.dataset.view === (showRead ? "read" : "unread"));
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

  function saveReadIds() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(readIds))); } catch (e) { /* private mode */ }
    updateReadCount();
  }

  function updateReadCount() {
    document.querySelectorAll(".read-count").forEach(function (el) {
      el.textContent = readIds.size ? String(readIds.size) : "";
    });
  }
  updateReadCount();

  // --- helpers --------------------------------------------------------------
  function shuffle(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = list[i]; list[i] = list[j]; list[j] = tmp;
    }
    return list;
  }

  function setStatus(text) { status.textContent = text; }

  // Analytics: a story counts as viewed when at least half of its card has been
  // on screen for a second (once per page load).
  var viewed = {};
  var viewTimers = {};
  var viewObserver = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var post = entry.target;
      var id = post.dataset.id;
      if (entry.isIntersecting) {
        viewTimers[id] = setTimeout(function () {
          if (viewed[id]) return;
          viewed[id] = true;
          viewObserver.unobserve(post);
          TruyenCuoi.track("story_view", { story_id: id, story_type: post.dataset.type, source: "wall" });
        }, 1000);
      } else {
        clearTimeout(viewTimers[id]);
      }
    });
  }, { threshold: 0.5 }) : null;

  function buildPost(story) {
    var post = document.createElement("div");
    post.className = "post";
    post.dataset.id = story.id;
    post.dataset.type = story.type;
    if (viewObserver) viewObserver.observe(post);

    var card = document.createElement("div");
    card.className = "post-card";

    var divider = document.createElement("div");
    divider.className = "divider";
    divider.textContent = "****";

    card.appendChild(divider);
    card.appendChild(TruyenCuoi.renderStory(story));
    post.appendChild(card);
    return post;
  }

  // --- wall -----------------------------------------------------------------
  var masonry = new Masonry(container, {
    itemSelector: ".post",
    gutter: 5,
    transitionDuration: "0.3s",
    stagger: 0,
  });
  var queue = [];
  var observer = null;
  // A cartoon appeared or was dropped (no picture for that story): re-pack the grid.
  var relayoutTimer = null;
  window.addEventListener("cartoon:changed", function () {
    clearTimeout(relayoutTimer);
    relayoutTimer = setTimeout(function () { masonry.layout(); }, 50);
  });
  var firstBatch = true;

  function renderNextBatch() {
    var batch = queue.splice(0, BATCH_SIZE);
    if (!batch.length) return;

    var elements = batch.map(buildPost);
    var fragment = document.createDocumentFragment();
    elements.forEach(function (el) { fragment.appendChild(el); });
    container.appendChild(fragment);
    if (firstBatch) {
      // Show the first screen fully laid out straight away (no fade-in), so the
      // page never looks half-built, e.g. in link-preview screenshots.
      // layoutInstant: otherwise Masonry animates every story in from the
      // top-left corner on the first render.
      firstBatch = false;
      masonry.reloadItems();
      masonry.options.layoutInstant = true;
      masonry.layout();
      masonry.options.layoutInstant = undefined;
    } else {
      masonry.appended(elements);
    }
    imagesLoaded(elements, function () { masonry.layout(); });

    updateStatus();
  }

  function updateStatus() {
    if (queue.length) {
      setStatus("");
    } else if (!container.querySelector(".post:not(.is-leaving)")) {
      setStatus(showRead ? "Nothing here yet. Stories you hide will show up here." : "You've read everything!");
    } else {
      setStatus("No more stories.");
    }
  }

  function startInfiniteLoading() {
    observer = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) renderNextBatch();
    }, { rootMargin: "800px 0px" });
    observer.observe(status);
  }

  // Fade the card out, then let Masonry slide the others into the gap.
  function removePost(post) {
    if (post.classList.contains("is-leaving")) return;
    var id = Number(post.dataset.id);
    if (showRead) readIds.delete(id); else readIds.add(id);
    TruyenCuoi.track(showRead ? "story_unhide" : "story_read", { story_id: String(id), story_type: post.dataset.type });
    saveReadIds();

    post.classList.add("is-leaving");
    setTimeout(function () {
      masonry.remove(post);
      masonry.layout();
      if (queue.length && status.getBoundingClientRect().top < window.innerHeight + 800) renderNextBatch();
      else updateStatus();
    }, LEAVE_MS);
  }

  container.addEventListener("dblclick", function (event) {
    var post = event.target.closest(".post");
    if (!post) return;
    var selection = window.getSelection && window.getSelection();
    if (selection) selection.removeAllRanges(); // don't leave a highlighted word behind
    removePost(post);
  });

  var lastTap = { el: null, at: 0 };
  container.addEventListener("touchend", function (event) {
    var post = event.target.closest(".post");
    if (!post) return;
    var now = Date.now();
    if (lastTap.el === post && now - lastTap.at < 300) {
      event.preventDefault();
      removePost(post);
      lastTap = { el: null, at: 0 };
    } else {
      lastTap = { el: post, at: now };
    }
  });

  var action = isTouch ? "Double-tap" : "Double-click";
  hint.textContent = showRead
    ? "Stories you've marked as read. " + action + " one to put it back."
    : action + " a story when you've read it to hide it. Hidden stories move to Read.";

  TruyenCuoi.loadStories().then(function (stories) {
    queue = shuffle(stories.filter(function (s) { return showRead === readIds.has(s.id); }));
    renderNextBatch();
    updateStatus();
    if (queue.length) startInfiniteLoading();
  }).catch(function (error) {
    console.error(error);
    setStatus("Couldn't load stories.");
  });
})();
