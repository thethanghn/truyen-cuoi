// Shared by the edge functions: reads public/stories.txt and describes each story.
let storiesPromise = null;

export function loadStories(origin) {
  storiesPromise ??= fetch(new URL("/stories.txt", origin))
    .then((response) => {
      if (!response.ok) throw new Error(`stories.txt: ${response.status}`);
      return response.text();
    })
    .then((text) => {
      const stories = new Map();
      let current = null;
      for (const line of text.replace(/\r\n/g, "\n").split("\n")) {
        const match = /^=== (\d+) (\w+)\s*$/.exec(line);
        if (match) stories.set(match[1], (current = { id: match[1], type: match[2], lines: [] }));
        else if (current) current.lines.push(line);
      }
      for (const story of stories.values()) story.body = story.lines.join("\n").trim();
      return stories;
    })
    .catch((error) => {
      storiesPromise = null;
      throw error;
    });
  return storiesPromise;
}

// The address search engines should list: the site's primary domain when Netlify
// knows it (custom domain once it is set as primary), otherwise the one visited.
// SITE_URL in the Netlify environment variables overrides both.
export function siteOrigin(context, url) {
  const configured = globalThis.Netlify?.env.get("SITE_URL") || context?.site?.url;
  try {
    if (configured) return new URL(configured).origin;
  } catch {
    // fall through
  }
  return url.origin;
}

export const escapeHtml = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function plainText(html) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function excerpt(text, max = 180) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ") > 100 ? cut.lastIndexOf(" ") : max).trim() + "…";
}

export const storyTitle = (story) =>
  `${story.type === "poem" ? "Thơ vui" : "Truyện cười"} #${story.id} – Truyện Cười`;
