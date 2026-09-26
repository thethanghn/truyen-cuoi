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

  function renderStory(story) {
    var inner = document.createElement("div");
    inner.className = "post-inner " + story.type;

    var body = document.createElement("div");
    body.className = "post-body";
    body.innerHTML = story.body; // bodies are the site's own HTML content

    var number = document.createElement("div");
    number.className = "note-id";
    number.textContent = story.id;

    inner.appendChild(body);
    inner.appendChild(number);
    return inner;
  }

  window.TruyenCuoi = { parseStories: parseStories, loadStories: loadStories, renderStory: renderStory };
})();
