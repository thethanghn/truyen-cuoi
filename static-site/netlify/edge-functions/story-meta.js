// Runs on the site's HTML pages before they are sent:
//   - every /story/<id> page gets its own title, description, link preview
//     (Facebook, Zalo, Messenger, X, Telegram...) and structured data, and the story
//     itself is written into the HTML, so search engines and preview bots see the
//     content without running JavaScript;
//   - canonical links and robots rules keep search results to the home page and the
//     story pages (/random and the "Read" list are not indexed);
//   - absolute links use the site's primary domain (custom domain or *.netlify.app);
//   - the Google Analytics ID from the GA_MEASUREMENT_ID environment variable is
//     added for public/assets/analytics.js.
import { escapeHtml, excerpt, loadStories, plainText, siteOrigin, storyTitle } from "../shared/stories.js";

const DEFAULT_ORIGIN = "https://truyencuoi.netlify.app";
const SITE_NAME = "Truyện Cười";

function setMeta(html, attr, key, value) {
  const pattern = new RegExp(`<meta ${attr}="${key}" content="[^"]*">`);
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(value)}">`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `  ${tag}\n</head>`);
}

const addToHead = (html, tag) => html.replace("</head>", `  ${tag}\n</head>`);

// JSON inside <script> must not be able to close the tag.
const jsonLd = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

function storyPage(html, story, stories, origin) {
  const pageUrl = `${origin}/story/${story.id}`;
  const title = storyTitle(story);
  const text = plainText(story.body);
  const description = excerpt(text);
  const image = `${origin}/og/${story.id}.jpg`;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = setMeta(html, "name", "description", description);
  html = setMeta(html, "property", "og:type", "article");
  html = setMeta(html, "property", "og:title", title);
  html = setMeta(html, "property", "og:description", description);
  html = setMeta(html, "property", "og:url", pageUrl);
  html = setMeta(html, "property", "og:image", image);
  html = setMeta(html, "property", "og:image:width", "1200");
  html = setMeta(html, "property", "og:image:height", "630");
  html = setMeta(html, "name", "twitter:title", title);
  html = setMeta(html, "name", "twitter:description", description);
  html = setMeta(html, "name", "twitter:image", image);
  html = addToHead(html, `<link rel="canonical" href="${escapeHtml(pageUrl)}">`);
  html = addToHead(
    html,
    jsonLd({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": pageUrl,
      url: pageUrl,
      name: title,
      headline: title,
      description,
      text,
      genre: story.type === "poem" ? "Thơ vui" : "Truyện cười",
      inLanguage: "vi",
      image,
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${origin}/` },
    }),
  );

  // The story itself, as the page's script would draw it (the script redraws it).
  html = html.replace(
    /(<div class="random-story" id="random-story">)[\s\S]*?(<\/div>)/,
    (_, open, close) =>
      `${open}<div class="post-inner ${escapeHtml(story.type)}"><div class="post-body">${story.body}</div>` +
      `<div class="note-id"><a href="/story/${story.id}">${story.id}</a></div></div>${close}`,
  );

  // Links to the neighbouring stories, so crawlers can walk from one story to the next.
  const ids = [...stories.keys()].sort((a, b) => Number(a) - Number(b));
  const at = ids.indexOf(story.id);
  const prev = ids[(at - 1 + ids.length) % ids.length];
  const next = ids[(at + 1) % ids.length];
  html = html.replace(
    /(<p class="text-center story-nav" id="story-nav">)[\s\S]*?(<\/p>)/,
    (_, open, close) =>
      `${open}<a href="/story/${prev}" rel="prev">← #${prev}</a> · <a href="/story/${next}" rel="next">#${next} →</a>${close}`,
  );
  return html;
}

export default async (request, context) => {
  const response = await context.next();
  if (!(response.headers.get("content-type") || "").includes("text/html")) return response;

  const url = new URL(request.url);
  const origin = siteOrigin(context, url);
  let status = response.status;
  let html = await response.text();

  // Absolute links in the page point at the site's primary domain.
  if (origin !== DEFAULT_ORIGIN) html = html.split(DEFAULT_ORIGIN).join(origin);

  const gaId = globalThis.Netlify?.env.get("GA_MEASUREMENT_ID");
  if (gaId && /^G-[A-Z0-9]+$/i.test(gaId)) {
    html = html.replace("<head>", `<head>\n  <meta name="ga-measurement-id" content="${escapeHtml(gaId)}">`);
  }

  const id = /^\/story\/(\d+)\/?$/.exec(url.pathname)?.[1];
  if (id) {
    let stories = null;
    try {
      stories = await loadStories(url.origin);
    } catch {
      stories = null; // leave the page to its script
    }
    const story = stories?.get(id);
    if (story) {
      html = storyPage(html, story, stories, origin);
    } else if (stories) {
      // Unknown number: the script still offers another story, but it isn't a page.
      status = 404;
      html = addToHead(html, '<meta name="robots" content="noindex">');
    }
  } else if (url.pathname === "/random" || url.pathname === "/random.html") {
    // A different story every time: follow its links, but don't list it.
    html = addToHead(html, '<meta name="robots" content="noindex, follow">');
    html = addToHead(html, `<link rel="canonical" href="${origin}/">`);
  } else {
    // Home page (/ and /index.html). The "Read" list (?read=1) is per visitor.
    if (url.searchParams.has("read")) html = addToHead(html, '<meta name="robots" content="noindex, follow">');
    html = addToHead(html, `<link rel="canonical" href="${origin}/">`);
    html = addToHead(
      html,
      jsonLd({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: `${origin}/`,
        inLanguage: "vi",
      }),
    );
  }

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(html, { status, headers });
};

export const config = { path: ["/", "/index.html", "/random", "/random.html", "/story/*"] };
