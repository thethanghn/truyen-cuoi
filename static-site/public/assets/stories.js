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
    return fetch("stories.txt", { cache: "no-cache" }).then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.text();
    }).then(parseStories);
  }

  // While a cartoon is being drawn the server answers 503; keep trying with growing
  // pauses (about 2 minutes in total), then give up quietly.
  var RETRY_DELAYS = [4000, 6000, 8000, 10000, 15000, 20000, 30000, 30000];

  function cartoonFor(story) {
    var src = "cartoons/" + story.id;
    var img = document.createElement("img");
    img.className = "cartoon";
    img.src = src;
    img.alt = "";
    img.width = 640;  // reserves the square space before it loads,
    img.height = 640; // so the grid doesn't jump when the picture arrives
    img.loading = "lazy";
    img.decoding = "async";

    var attempt = 0;
    img.addEventListener("error", function () {
      if (attempt >= RETRY_DELAYS.length) {
        img.remove();
        window.dispatchEvent(new CustomEvent("cartoon:removed"));
        return;
      }
      setTimeout(function () { img.src = src + "?try=" + (attempt + 1); }, RETRY_DELAYS[attempt++]);
    });
    return img;
  }

  function renderStory(story, options) {
    options = options || {};
    var inner = document.createElement("div");
    inner.className = "post-inner " + story.type;

    var body = document.createElement("div");
    body.className = "post-body";
    body.innerHTML = story.body; // bodies are the site's own HTML content

    var number = document.createElement("div");
    number.className = "note-id";
    number.textContent = story.id;

    // Every story has a cartoon at /cartoons/<id>, drawn on first view by a
    // Netlify Function (netlify/functions/cartoon.mjs) and shared by all visitors.
    if (options.cartoons !== false) inner.appendChild(cartoonFor(story));

    inner.appendChild(body);
    inner.appendChild(number);
    return inner;
  }

  window.TruyenCuoi = { parseStories: parseStories, loadStories: loadStories, renderStory: renderStory };
})();
