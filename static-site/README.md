# Truyện Cười – static site

Plain HTML/JS in `public/`, no server and no accounts. All stories live in `public/stories.txt`.

- `public/index.html` – the story wall: random order on every visit, loads more as you scroll,
  double-click (double-tap on phones) hides a story. Hidden stories are remembered in the
  browser (localStorage) and listed under **Read**.
- `public/random.html` – one random story at a time.
- `public/stories.txt` – exported from the database with `bin/export-stories [database]`.
- `src/site.scss` – source of `public/assets/site.css` (Bootstrap 3 + site styles).

## Cartoons

Every story gets an AI cartoon above its text, served from `/cartoons/<story id>` by
`netlify/functions/cartoon.mjs`:

- The first view of a story asks Grok to draw it (a Grok text model first writes the scene
  from the story, unless `cartoon-prompts.json` has a hand-written one). The browser shows the
  card at once and the picture appears when ready.
- The picture is stored once in Netlify Blobs and shared by every visitor; a per-story lock
  means only one drawing happens at a time, however many people open the story together.
- Each picture lives a random 3–7 days. After that the old one keeps showing while a new one
  is drawn in the background, so redraws are spread out instead of all at once.
- `CARTOON_DAILY_LIMIT` caps drawings per day. Failed drawings back off for 6 hours; if the AI
  refuses a story (content policy) it isn't asked again for 30 days, and that card simply has
  no picture. The page never shows a broken image: a soft placeholder while drawing, then the
  picture, or nothing.
- Pictures live in a site-wide Netlify Blobs store, so they survive redeploys.
- `public/cartoons-static/` holds cartoons made earlier; they seed the store for free.

Netlify environment variables (Site configuration → Environment variables):

| Variable | |
| --- | --- |
| `XAI_API_KEY` | required |
| `CARTOON_DAILY_LIMIT` | drawings per day, default 100 |
| `CARTOON_MIN_DAYS` / `CARTOON_MAX_DAYS` | picture lifetime range, default 3 / 7 |
| `XAI_IMAGE_QUALITY` | `low`, `medium` or `auto` (default) |
| `XAI_IMAGE_MODEL` / `XAI_TEXT_MODEL` | defaults `grok-imagine-image-2.0` / `grok-4.7` |

## Local preview

    cd static-site && npm install && npx netlify-cli dev     # site + cartoon function
    cd static-site/public && python3 -m http.server 8000     # site only, no new cartoons

Deploy: the repo-root `netlify.toml` points Netlify at this folder (base `static-site`,
publish `public`, functions `netlify/functions`).
