// /cartoons/<story id> – an AI cartoon for every story, drawn by Grok (xAI).
//
// How it stays cheap and consistent:
//   - One copy per story lives in Netlify Blobs, shared by every visitor and every
//     edge location, so a cartoon is drawn once no matter how many people view it.
//   - Each copy gets a random lifetime of 3–7 days. When it expires the old picture
//     keeps being served while a fresh one is drawn in the background, so stories
//     are refreshed a few at a time instead of all at once.
//   - A lock per story means only one drawing happens at a time, even if many
//     visitors open the same story together; others get "try again in a few seconds".
//   - CARTOON_DAILY_LIMIT caps drawings per day; failures back off for a few hours.
//   - The scene description for each story is written once by a Grok text model (or
//     taken from cartoon-prompts.json) and reused for every redraw.
//
// Environment (Netlify → Site configuration → Environment variables):
//   XAI_API_KEY            required
//   CARTOON_DAILY_LIMIT    drawings per day, default 100
//   CARTOON_MIN_DAYS / CARTOON_MAX_DAYS   lifetime range, default 3 / 7
//   XAI_IMAGE_MODEL        default grok-imagine-image-2.0
//   XAI_TEXT_MODEL         default grok-4.7 (writes the scene descriptions)
//   XAI_IMAGE_QUALITY      low | medium | auto (default auto)
import { createHash } from "node:crypto";
import { getStore } from "@netlify/blobs";
import sharp from "sharp";
import overrides from "../../cartoon-prompts.json";

const XAI = "https://api.x.ai/v1";
const IMAGE_MODEL = process.env.XAI_IMAGE_MODEL || process.env.XAI_MODEL || "grok-imagine-image-2.0";
const TEXT_MODEL = process.env.XAI_TEXT_MODEL || "grok-4.7";
const QUALITY = process.env.XAI_IMAGE_QUALITY || "auto";
const DAILY_LIMIT = Number(process.env.CARTOON_DAILY_LIMIT || 100);
const DAY = 24 * 60 * 60 * 1000;
const MIN_LIFE = Number(process.env.CARTOON_MIN_DAYS || 3) * DAY;
const MAX_LIFE = Number(process.env.CARTOON_MAX_DAYS || 7) * DAY;
const LOCK_MS = 2 * 60 * 1000;
const FAILURE_BACKOFF = 6 * 60 * 60 * 1000;
const SIZE = 640;

const store = () => getStore("cartoons");
const sha = (text) => createHash("sha256").update(text).digest("hex").slice(0, 12);

// ---------------------------------------------------------------- stories
let storiesCache = null;
async function loadStories(origin) {
  if (storiesCache) return storiesCache;
  const text = await (await fetch(new URL("/stories.txt", origin))).text();
  const stories = new Map();
  let current = null;
  for (const line of text.replace(/\r\n/g, "\n").split("\n")) {
    const m = /^=== (\d+) (\w+)\s*$/.exec(line);
    if (m) stories.set(m[1], (current = { id: m[1], type: m[2], lines: [] }));
    else if (current) current.lines.push(line);
  }
  for (const s of stories.values()) {
    s.text = s.lines.join("\n").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
    delete s.lines;
  }
  return (storiesCache = stories);
}

// ---------------------------------------------------------------- xAI calls
async function xai(path, body) {
  const response = await fetch(`${XAI}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.XAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(json.error?.message || json.error || `xAI HTTP ${response.status}`);
  return json;
}

async function sceneFor(story) {
  if (overrides.stories?.[story.id]) return overrides.stories[story.id];

  const key = `scene-${story.id}-${sha(story.text)}`;
  const saved = await store().get(key, { consistency: "strong" });
  if (saved) return saved;

  const json = await xai("/chat/completions", {
    model: TEXT_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You turn short Vietnamese jokes and funny poems into a scene description for ONE single-panel cartoon. " +
          "Pick the moment that best shows the punchline and describe, in English and in 2-4 sentences, who is in the scene, " +
          "what they are doing and their exaggerated facial expressions. Keep it family-friendly: no nudity, no sexual acts, " +
          "no gore; hint at risqué jokes only through reactions and situations. Do not ask for any text, captions or speech bubbles. " +
          "Reply with the scene description only.",
      },
      { role: "user", content: story.text.slice(0, 4000) },
    ],
    max_tokens: 300,
    temperature: 0.7,
  });
  const scene = json.choices?.[0]?.message?.content?.trim();
  if (!scene) throw new Error("no scene description returned");
  await store().set(key, scene);
  return scene;
}

async function draw(scene) {
  const json = await xai("/images/generations", {
    model: IMAGE_MODEL,
    prompt: `${overrides.style}\n\nScene: ${scene}`,
    n: 1,
    aspect_ratio: "1:1",
    resolution: "1k",
    quality: QUALITY,
    response_format: "b64_json",
  });
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("xAI returned no image");
  return sharp(Buffer.from(b64, "base64")).resize(SIZE, SIZE, { fit: "cover" }).webp({ quality: 80 }).toBuffer();
}

// ---------------------------------------------------------------- bookkeeping
const randomLifetime = () => MIN_LIFE + Math.random() * (MAX_LIFE - MIN_LIFE);

async function saveImage(id, bytes, source) {
  const now = Date.now();
  await store().set(`image-${id}`, bytes, {
    metadata: { type: "image/webp", source, createdAt: now, expiresAt: Math.round(now + randomLifetime()) },
  });
}

async function takeLock(id) {
  const locks = getStore("cartoon-locks");
  const { modified } = await locks.set(id, "1", { onlyIfNew: true, metadata: { at: Date.now() } });
  if (modified) return true;
  const lock = await locks.getWithMetadata(id, { consistency: "strong" });
  if (lock && Date.now() - lock.metadata.at < LOCK_MS) return false;
  await locks.set(id, "1", { metadata: { at: Date.now() } }); // stale lock from a crashed run
  return true;
}
const releaseLock = (id) => getStore("cartoon-locks").delete(id);

async function takeBudget() {
  const key = `budget-${new Date().toISOString().slice(0, 10)}`;
  const used = Number((await store().get(key, { consistency: "strong" })) || 0);
  if (used >= DAILY_LIMIT) return false;
  await store().set(key, String(used + 1));
  return true;
}

async function recentlyFailed(id) {
  const failure = await store().getWithMetadata(`failed-${id}`, { consistency: "strong" });
  return Boolean(failure && Date.now() < failure.metadata.until);
}

// Draw (or redraw) one story's cartoon. Safe to call from many visitors at once.
async function refresh(id, story) {
  if (!process.env.XAI_API_KEY) return;
  if (!(await takeLock(id))) return;
  try {
    if (await recentlyFailed(id)) return;
    if (!(await takeBudget())) {
      console.log(`cartoon ${id}: daily limit reached, skipping`);
      return;
    }
    const scene = await sceneFor(story);
    await saveImage(id, await draw(scene), "xai");
    await store().delete(`failed-${id}`);
    console.log(`cartoon ${id}: drawn`);
  } catch (error) {
    console.error(`cartoon ${id} failed:`, error.message);
    await store().set(`failed-${id}`, error.message.slice(0, 500), { metadata: { until: Date.now() + FAILURE_BACKOFF } });
  } finally {
    await releaseLock(id);
  }
}

// Cartoons made before this function existed (public/cartoons-static) seed the store.
async function seedFromStatic(id, origin) {
  try {
    const index = await (await fetch(new URL("/cartoons-static/index.json", origin))).json();
    if (!index[id]) return null;
    const response = await fetch(new URL(`/cartoons-static/${index[id]}`, origin));
    if (!response.ok) return null;
    const bytes = Buffer.from(await response.arrayBuffer());
    await saveImage(id, bytes, "static");
    return bytes;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- responses
function imageResponse(bytes, type, seconds) {
  const cache = `public, max-age=${Math.max(60, Math.floor(seconds))}`;
  return new Response(bytes, {
    headers: {
      "Content-Type": type,
      "Cache-Control": cache,
      // Netlify's CDN keeps it (durable = shared across edge nodes) until it expires.
      "Netlify-CDN-Cache-Control": `${cache}, durable`,
    },
  });
}

const notYet = (seconds = 8) =>
  new Response("Drawing this cartoon, try again shortly.", {
    status: 503,
    headers: { "Retry-After": String(seconds), "Cache-Control": "no-store" },
  });

export default async (req, context) => {
  const id = context.params.id;
  if (!/^\d+$/.test(id)) return new Response("Not found", { status: 404 });

  const origin = new URL(req.url).origin;
  const story = (await loadStories(origin)).get(id);
  if (!story) return new Response("Not found", { status: 404 });

  const cached = await store().getWithMetadata(`image-${id}`, { type: "arrayBuffer", consistency: "strong" });
  if (cached) {
    const left = cached.metadata.expiresAt - Date.now();
    if (left > 0) return imageResponse(cached.data, cached.metadata.type, left / 1000);
    // Expired: keep showing the old picture while a new one is drawn.
    context.waitUntil(refresh(id, story));
    return imageResponse(cached.data, cached.metadata.type, 5 * 60);
  }

  const seeded = await seedFromStatic(id, origin);
  if (seeded) return imageResponse(seeded, "image/webp", MIN_LIFE / 1000);

  if (!process.env.XAI_API_KEY || (await recentlyFailed(id))) {
    return new Response("No cartoon for this story", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  // First time: draw in the background and ask the browser to come back.
  context.waitUntil(refresh(id, story));
  return notYet();
};

export const config = {
  path: "/cartoons/:id",
};
