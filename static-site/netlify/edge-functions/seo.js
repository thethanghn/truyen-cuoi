// /robots.txt and /sitemap.xml, built on request so every address uses the site's
// primary domain and the sitemap always lists every story in public/stories.txt.
import { loadStories, siteOrigin } from "../shared/stories.js";

function robots(origin) {
  return [
    "User-agent: *",
    "Allow: /",
    // Cartoons are drawn by AI on first request; keep crawlers from paying for them.
    "Disallow: /cartoons/",
    "Disallow: /og/",
    // A different story on every visit, and each visitor's own read list.
    "Disallow: /random",
    "Disallow: /*?read=",
    "",
    // Link-preview bots need the story cards (/og/<id>.jpg).
    "User-agent: Twitterbot",
    "User-agent: facebookexternalhit",
    "User-agent: TelegramBot",
    "User-agent: Zalo",
    "User-agent: LinkedInBot",
    "User-agent: Slackbot",
    "User-agent: Discordbot",
    "Allow: /",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n");
}

function sitemap(origin, stories) {
  const entry = (path, priority, changefreq) =>
    `  <url>\n    <loc>${origin}${path}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  const ids = [...stories.keys()].sort((a, b) => Number(a) - Number(b));
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entry("/", "1.0", "daily"),
    ...ids.map((id) => entry(`/story/${id}`, "0.8", "monthly")),
    "</urlset>",
    "",
  ].join("\n");
}

export default async (request, context) => {
  const url = new URL(request.url);
  const origin = siteOrigin(context, url);
  const cache = { "cache-control": "public, max-age=3600" };

  if (url.pathname === "/robots.txt") {
    return new Response(robots(origin), { headers: { ...cache, "content-type": "text/plain; charset=utf-8" } });
  }

  let stories;
  try {
    stories = await loadStories(url.origin);
  } catch {
    return new Response("Sitemap temporarily unavailable", { status: 503, headers: { "retry-after": "60" } });
  }
  return new Response(sitemap(origin, stories), {
    headers: { ...cache, "content-type": "application/xml; charset=utf-8" },
  });
};

export const config = { path: ["/robots.txt", "/sitemap.xml"] };
