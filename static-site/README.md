# Truyện Cười – static site

Plain HTML/JS, no server and no accounts. All stories live in `stories.txt`.

- `index.html` – the story wall: random order on every visit, loads more as you scroll,
  double-click (double-tap on phones) hides a story. Hidden stories are remembered in the
  browser (localStorage) and listed under **Read**.
- `random.html` – one random story at a time.
- `stories.txt` – exported from the database with `bin/export-stories [database]`.
- `src/site.scss` – source of `assets/site.css` (Bootstrap 3 + site styles).

Preview locally (fetching `stories.txt` needs a web server, not file://):

    cd static-site && python3 -m http.server 8000   # then open http://localhost:8000

Deploy: Netlify uses `netlify.toml` in the repo root (publishes this folder).
On Vercel, set the project's Root Directory to `static-site` (no build command).
