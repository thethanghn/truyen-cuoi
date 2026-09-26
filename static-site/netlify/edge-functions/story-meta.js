// Gives every /story/<id> page its own link preview (Facebook, Zalo, Messenger,
// X, Telegram...). Crawlers don't run JavaScript, so the title, description and
// preview image have to be in the HTML itself: this takes the shared story page
// (random.html) and fills in that story's details before it is sent.
let storiesPromise = null;

function loadStories(origin) {
  storiesPromise ??= fetch(new URL("/stories.txt", origin))
    .then((response) => response.text())
    .then((text) => {
      const stories = new Map();
      let current = null;
      for (const line of text.replace(/\r\n/g, "\n").split("\n")) {
        const match = /^=== (\d+) (\w+)\s*$/.exec(line);
        if (match) stories.set(match[1], (current = { id: match[1], type: match[2], lines: [] }));
        else if (current) current.lines.push(line);
      }
      return stories;
    })
    .catch((error) => {
      storiesPromise = null;
      throw error;
    });
  return storiesPromise;
}

const escapeAttr = (text) =>
  text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function plainText(lines) {
  return lines
    .join("\n")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function excerpt(text, max = 180) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ") > 100 ? cut.lastIndexOf(" ") : max).trim() + "…";
}

function setMeta(html, attr, key, value) {
  const pattern = new RegExp(`<meta ${attr}="${key}" content="[^"]*">`);
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(value)}">`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `  ${tag}\n</head>`);
}

export default async (request, context) => {
  const response = await context.next();
  const url = new URL(request.url);
  const id = /^\/story\/(\d+)\/?$/.exec(url.pathname)?.[1];
  if (!id || !(response.headers.get("content-type") || "").includes("text/html")) return response;

  let story;
  try {
    story = (await loadStories(url.origin)).get(id);
  } catch {
    return response;
  }
  if (!story) return response;

  const pageUrl = `${url.origin}/story/${id}`;
  const title = `${story.type === "poem" ? "Thơ vui" : "Truyện cười"} #${id} – Truyện Cười`;
  const description = excerpt(plainText(story.lines));
  const image = `${url.origin}/og/${id}.jpg`;

  let html = await response.text();
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(title)}</title>`);
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
  html = html.replace("</head>", `  <link rel="canonical" href="${escapeAttr(pageUrl)}">\n</head>`);

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(html, { status: response.status, headers });
};

export const config = { path: "/story/*" };
