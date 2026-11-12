/**
 * Photo resolution with automatic stock fallback.
 *
 * Content fields such as `imageCaption` / `coverImage` hold either:
 *  - a real image URL (starts with "http", "https" or "/") → used as-is, or
 *  - a text description of the photo to upload → one of the design's
 *    illustration photos, chosen by theme, is shown until a real one is set.
 *
 * Editors replace any illustration by pasting an image URL (or a path to a
 * file in /public) into the photo field in the admin.
 */

/**
 * The school's own photos, stored in /public/photos. The keys keep the
 * roles they had in the "Design ENSF University Homepage" mock-up
 * (hero landscape, forest, lab…) so every component keeps working.
 */
export const IMAGES = {
  algeria: "/photos/sortie-lac.jpg", // students by the lake under a dramatic sky — home hero
  forest: "/photos/sortie-foret-garde.jpg", // field trip in the forest with a ranger
  sapling: "/photos/serre-pepiniere.jpg", // seedlings in the nursery greenhouse
  field: "/photos/releves-gps-pins.jpg", // GPS survey in the pines
  lab: "/photos/labo-microscopes.jpg",
  labTwo: "/photos/jury-soutenance.jpg", // thesis panel
  student: "/photos/etudiants-badges.jpg",
  pines: "/photos/terrain-foret.jpg",
  sunset: "/photos/cedres-aures.webp", // cedar forests of the Aurès — final call to action
};

/** Fallbacks used when a content field only holds a description. */
const POOLS = {
  forest: [IMAGES.forest, "/photos/releves-etang.jpg", IMAGES.pines, "/photos/releves-fougeres.jpg"],
  landscape: [IMAGES.algeria, "/photos/sortie-barrage.jpg", IMAGES.sunset],
  study: [IMAGES.student, "/photos/visite-jardin.jpg", "/photos/salle-langues.jpg", "/photos/salle-informatique.jpg"],
  lab: [IMAGES.lab, "/photos/labo-equipement.jpg", "/photos/tp-laboratoire.jpg", "/photos/tp-laboratoire-2.jpg"],
};

export type Theme = keyof typeof POOLS;

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function themeFor(text: string): Theme {
  const t = text.toLowerCase();
  if (/(étudiant|etudiant|student|cours|classe|amphi|campus|inscription|licence|diplôme|admission|طالب|تسجيل)/.test(t)) return "study";
  if (/(labo|recherche|research|science|analyse|colloque|cartograph|télédétection|مخبر|بحث)/.test(t)) return "lab";
  if (/(paysage|montagne|aurès|aures|massif|vue|landscape|colline|جبل)/.test(t)) return "landscape";
  return "forest";
}

export function isImageUrl(v?: string | null): v is string {
  return !!v && /^(https?:\/\/|\/)/.test(v.trim());
}

/** Returns a ready-to-use src for a content photo field. */
export function photoSrc(
  source?: string | null,
  opts: { theme?: Theme; seed?: string; fallback?: string; width?: number } = {}
): string {
  let src: string;
  if (isImageUrl(source)) src = source.trim();
  else if (opts.fallback) src = opts.fallback;
  else {
    const text = `${source ?? ""} ${opts.seed ?? ""}`;
    const pool = POOLS[opts.theme ?? themeFor(text)];
    src = pool[hash(text) % pool.length];
  }
  return src.includes("images.unsplash.com") && !src.includes("?")
    ? `${src}?auto=format&fit=crop&w=${opts.width ?? 1600}&q=85`
    : src;
}

/** Alt text: the editor's description when it is not a URL. */
export function photoAlt(source?: string | null, fallback = "") {
  return isImageUrl(source) ? fallback : (source ?? fallback).replace(/^photo\s*:\s*/i, "");
}
