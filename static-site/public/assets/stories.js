// Loads and parses stories.txt (see bin/export-stories) and renders one story.
(function () {
  var HEADER = /^=== (\d+) (\w+)\s*$/;

  // "=== <id> <type>" starts a story; everything until the next header is its HTML body.
  function parseStories(text) {
    var stories = [];
    var current = null;
    text.replace(/\r\n/g, "\n").split("\n").forEach(function (line) {
      var match = HEADER.exec(line);
      if (match) {
        current = { id: Number(match[1]), type: match[2], lines: [] };
        stories.push(current);
      } else if (current) {
        current.lines.push(line);
      }
    });
    return stories.map(function (s) {
      return { id: s.id, type: s.type, body: s.lines.join("\n").trim() };
    });
  }

  function loadStories() {
    return fetch("/stories.txt", { cache: "no-cache" }).then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.text();
    }).then(parseStories);
  }

  // Cartoons come from /cartoons/<id> (netlify/functions/cartoon.mjs):
  //   200 -> the picture;  503 -> still being drawn, ask again soon;
  //   404 -> this story has no picture (the AI refused, or today's budget is used up).
  // We ask with fetch() so we can read that status: the card shows a soft placeholder
  // while drawing and never a broken-image icon. Nothing is requested until the card
  // is near the screen, so scrolling past doesn't trigger drawings.
  var RETRY_DELAYS = [4000, 6000, 8000, 10000, 15000, 20000, 30000, 30000];
  var cartoonObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          cartoonObserver.unobserve(entry.target);
          entry.target._startCartoon();
        });
      }, { rootMargin: "600px 0px" })
    : null;

  function cartoonFor(story) {
    var src = "/cartoons/" + story.id;
    var slot = document.createElement("div");
    slot.className = "cartoon-slot is-loading";
    slot.setAttribute("aria-hidden", "true");

    function give_up() {
      slot.remove();
      window.dispatchEvent(new CustomEvent("cartoon:changed"));
    }

    function attempt(n) {
      fetch(src, { cache: "default" }).then(function (response) {
        if (response.status === 503 && n < RETRY_DELAYS.length) {
          setTimeout(function () { attempt(n + 1); }, RETRY_DELAYS[n]);
          return;
        }
        if (!response.ok) { give_up(); return; }
        return response.blob().then(function (blob) {
          var img = document.createElement("img");
          img.className = "cartoon";
          img.alt = "";
          img.width = 640;
          img.height = 640;
          img.onload = function () {
            slot.classList.remove("is-loading");
            window.dispatchEvent(new CustomEvent("cartoon:changed"));
          };
          img.onerror = give_up;
          img.src = URL.createObjectURL(blob);
          slot.appendChild(img);
        });
      }).catch(function () {
        if (n < RETRY_DELAYS.length) setTimeout(function () { attempt(n + 1); }, RETRY_DELAYS[n]);
        else give_up();
      });
    }

    slot._startCartoon = function () { attempt(0); };
    if (cartoonObserver) cartoonObserver.observe(slot);
    else attempt(0);
    return slot;
  }

  function renderStory(story, options) {
    options = options || {};
    var inner = document.createElement("div");
    inner.className = "post-inner " + story.type;

    var body = document.createElement("div");
    body.className = "post-body";
    body.innerHTML = story.body; // bodies are the site's own HTML content

    // The story number links to its own page, /story/<id>, for sharing.
    var number = document.createElement("div");
    number.className = "note-id";
    var link = document.createElement("a");
    link.href = "/story/" + story.id;
    link.title = "Link to this story";
    link.textContent = story.id;
    number.appendChild(link);

    // Every story has a cartoon at /cartoons/<id>, drawn on first view by a
    // Netlify Function (netlify/functions/cartoon.mjs) and shared by all visitors.
    if (options.cartoons !== false) inner.appendChild(cartoonFor(story));

    inner.appendChild(body);
    inner.appendChild(number);
    return inner;
  }

  window.TruyenCuoi = { parseStories: parseStories, loadStories: loadStories, renderStory: renderStory };
})();
