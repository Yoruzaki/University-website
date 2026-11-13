"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import * as content from "@/lib/content";
import type { Section } from "@/lib/db/types";

async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!["EDITOR", "SUPER_ADMIN"].includes((session.user as { role?: string }).role ?? "")) {
    throw new Error("Accès réservé aux éditeurs.");
  }
  return session;
}

function revalidateSite() {
  revalidatePath("/", "layout");
}

/* ---------- pages ---------- */

export async function createPageAction(formData: FormData) {
  await requireSession();
  const slug = String(formData.get("slug") ?? "").trim().replace(/^\/+/, "");
  const titleFr = String(formData.get("titleFr") ?? "").trim();
  const page = await content.createPage({ slug, titleFr: titleFr || "Sans titre" });
  revalidatePath("/admin/pages");
  redirect(`/admin/pages/${page.id}`);
}

export async function updatePageMetaAction(pageId: string, formData: FormData) {
  await requireSession();
  await content.updatePageMeta(pageId, {
    slug: String(formData.get("slug") ?? "").trim().replace(/^\/+/, ""),
    titleFr: String(formData.get("titleFr") ?? ""),
    titleAr: String(formData.get("titleAr") ?? "") || undefined,
    titleEn: String(formData.get("titleEn") ?? "") || undefined,
    seoDescFr: String(formData.get("seoDescFr") ?? "") || undefined,
    bannerImage: String(formData.get("bannerImage") ?? "").trim() || undefined,
  });
  revalidatePath(`/admin/pages/${pageId}`);
  revalidateSite();
}

export async function togglePageStatusAction(pageId: string, status: "DRAFT" | "PUBLISHED") {
  await requireSession();
  await content.updatePageMeta(pageId, { status });
  revalidatePath(`/admin/pages/${pageId}`);
  revalidatePath("/admin/pages");
  revalidateSite();
}

export async function deletePageAction(pageId: string) {
  await requireSession();
  await content.deletePage(pageId);
  revalidatePath("/admin/pages");
  revalidateSite();
  redirect("/admin/pages");
}

export async function addSectionAction(
  pageId: string,
  type: Section["type"],
  variant: Section["variant"]
) {
  await requireSession();
  await content.addSection(pageId, type, variant);
  revalidatePath(`/admin/pages/${pageId}`);
  revalidateSite();
}

export async function addSectionFormAction(pageId: string, formData: FormData) {
  await requireSession();
  const type = String(formData.get("type")) as Section["type"];
  const variant = (String(formData.get("variant") ?? "LIGHT") as Section["variant"]) || "LIGHT";
  await content.addSection(pageId, type, variant);
  revalidatePath(`/admin/pages/${pageId}`);
  revalidateSite();
}

export async function updateSectionAction(
  pageId: string,
  sectionId: string,
  patch: { variant?: Section["variant"]; dataFr?: Record<string, unknown> }
) {
  await requireSession();
  await content.updateSection(pageId, sectionId, patch);
  revalidatePath(`/admin/pages/${pageId}`);
  revalidateSite();
}

function parseLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Builds a section's dataFr object from its edit form, according to its
 * type. Repeatable fields (stats, cards, timeline steps, partner names)
 * use one line per item, with "|" separating sub-fields — documented via
 * each textarea's placeholder in the editor UI. */
export async function updateSectionFieldsAction(
  pageId: string,
  sectionId: string,
  type: Section["type"],
  formData: FormData
) {
  await requireSession();
  const f = (name: string) => String(formData.get(name) ?? "").trim();
  const variant = (formData.get("variant") as Section["variant"]) || "LIGHT";

  let dataFr: Record<string, unknown> = {};

  switch (type) {
    case "RESOURCE_GRID":
      dataFr = { eyebrow: f("eyebrow"), title: f("title"), intro: f("intro"), image: f("image"), items: parseLines(f("items")).map((line) => {
        const [tag, title, body, href] = line.split("|").map((s) => s.trim());
        return { tag, title: title || "", body, href };
      }) };
      break;
    case "SERVICE_GRID":
    case "ANNOUNCEMENTS":
    case "OPPORTUNITIES":
    case "EVENTS_LIST":
      dataFr = { eyebrow: f("eyebrow"), title: f("title"), intro: f("intro"), count: Math.max(1, Math.min(12, Number(f("count")) || 3)) };
      break;
    case "HERO":
      dataFr = {
        eyebrow: f("eyebrow"),
        title: f("title"),
        subtitle: f("subtitle"),
        imageCaption: f("imageCaption"),
        ctaLabel: f("ctaLabel"),
        ctaHref: f("ctaHref"),
        scrollCue: f("scrollCue"),
      };
      break;
    case "EDITORIAL":
      dataFr = { index: f("index"), eyebrow: f("eyebrow"), title: f("title"), body: f("body") };
      break;
    case "PHOTO_STORY":
      dataFr = {
        eyebrow: f("eyebrow"),
        title: f("title"),
        body: f("body"),
        imageCaption: f("imageCaption"),
        imagePosition: f("imagePosition") || "left",
        caption: f("caption"),
        ctaLabel: f("ctaLabel"),
        ctaHref: f("ctaHref"),
      };
      break;
    case "STATS":
      dataFr = {
        eyebrow: f("eyebrow"),
        title: f("title"),
        items: parseLines(f("items")).map((line) => {
          const [value, label] = line.split("|").map((s) => s.trim());
          return { value: value ?? "", label: label ?? "" };
        }),
      };
      break;
    case "CARD_GRID":
      dataFr = {
        eyebrow: f("eyebrow"),
        title: f("title"),
        intro: f("intro"),
        cards: parseLines(f("cards")).map((line) => {
          const [tag, title, body, href, imageCaption] = line.split("|").map((s) => s.trim());
          return { tag, title: title ?? "", body, href, imageCaption };
        }),
      };
      break;
    case "RESEARCH_SPOTLIGHT":
      dataFr = {
        eyebrow: f("eyebrow"),
        title: f("title"),
        body: f("body"),
        imageCaption: f("imageCaption"),
        statValue: f("statValue"),
        statLabel: f("statLabel"),
        ctaLabel: f("ctaLabel"),
        ctaHref: f("ctaHref"),
      };
      break;
    case "NEWS_LIST":
      dataFr = { eyebrow: f("eyebrow"), title: f("title"), count: Number(f("count") || 3) };
      break;
    case "FACULTY_GRID":
      dataFr = { eyebrow: f("eyebrow"), title: f("title") };
      break;
    case "TIMELINE":
      dataFr = {
        eyebrow: f("eyebrow"),
        title: f("title"),
        items: parseLines(f("items")).map((line) => {
          const [year, title, body] = line.split("|").map((s) => s.trim());
          return { year: year ?? "", title: title ?? "", body };
        }),
      };
      break;
    case "PARTNERS":
      dataFr = {
        title: f("title"),
        imageCaption: f("imageCaption"),
        logos: parseLines(f("logos")).map((name) => ({ name })),
      };
      break;
    case "QUOTE":
      dataFr = { quote: f("quote"), author: f("author"), role: f("role") };
      break;
    case "CONTACT_CTA":
      dataFr = {
        eyebrow: f("eyebrow"),
        title: f("title"),
        body: f("body"),
        address: f("address"),
        email: f("email"),
        phone: f("phone"),
        imageCaption: f("imageCaption"),
      };
      break;
    case "DOWNLOADS":
      dataFr = { eyebrow: f("eyebrow"), title: f("title") };
      break;
    case "GALLERY":
      dataFr = {
        eyebrow: f("eyebrow"),
        title: f("title"),
        intro: f("intro"),
        ctaLabel: f("ctaLabel"),
        ctaHref: f("ctaHref"),
        images: parseLines(f("images")).map((line) => {
          const [src, caption] = line.split("|").map((s) => s.trim());
          return { src: src ?? "", caption: caption ?? "" };
        }),
      };
      break;
  }

  const language = f("language");
  const dataKey = language === "ar" ? "dataAr" : language === "en" ? "dataEn" : "dataFr";
  await content.updateSection(pageId, sectionId, { variant, hidden: formData.has("hidden"), [dataKey]: dataFr });
  revalidatePath(`/admin/pages/${pageId}`);
  revalidateSite();
}

export async function deleteSectionAction(pageId: string, sectionId: string) {
  await requireSession();
  await content.deleteSection(pageId, sectionId);
  revalidatePath(`/admin/pages/${pageId}`);
  revalidateSite();
}

export async function moveSectionAction(pageId: string, sectionId: string, direction: "up" | "down") {
  await requireSession();
  const page = await content.getPageById(pageId);
  if (!page) return;
  const ordered = [...page.sections].sort((a, b) => a.order - b.order);
  const idx = ordered.findIndex((s) => s.id === sectionId);
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (idx === -1 || swapWith < 0 || swapWith >= ordered.length) return;
  const ids = ordered.map((s) => s.id);
  [ids[idx], ids[swapWith]] = [ids[swapWith], ids[idx]];
  await content.reorderSections(pageId, ids);
  revalidatePath(`/admin/pages/${pageId}`);
  revalidateSite();
}

/* ---------- news ---------- */

export async function saveNewsAction(_previous: { message: string }, formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "") || undefined;
  const photos = formData.getAll("photos").map(String);
  const slug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("titleFr") ?? "").trim();
  const publishedAt = String(formData.get("publishedAt") ?? "");
  if (!title || title.length > 200) return { message: "Renseignez un titre de 200 caractères maximum." };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { message: "L’adresse doit contenir des lettres minuscules, chiffres et tirets." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt) || !Number.isFinite(Date.parse(publishedAt))) return { message: "Vérifiez la date de publication." };
  const existing = await content.getAllNews();
  const original = existing.find(n => n.id === id);
  if (photos.length > 5 || photos.some(src => src.length > 2048 || (!/^(https?:\/\/|\/(?!\/))/.test(src) && src !== original?.coverImage))) return { message: "Ajoutez jusqu’à cinq photos valides." };
  if (id && !existing.some(n => n.id === id)) return { message: "Cette publication a été supprimée." };
  if (existing.some(n => n.slug === slug && n.id !== id)) return { message: "Cette adresse est déjà utilisée. Choisissez une autre adresse." };
  try {
  await content.upsertNews({
    id,
    featured: formData.has("featured"),
    publishedAt: String(formData.get("publishedAt") || new Date().toISOString()),
    slug,
    titleFr: title,
    titleAr: String(formData.get("titleAr") ?? "").trim(),
    titleEn: String(formData.get("titleEn") ?? "").trim(),
    excerptAr: String(formData.get("excerptAr") ?? "").trim(),
    excerptEn: String(formData.get("excerptEn") ?? "").trim(),
    bodyAr: String(formData.get("bodyAr") ?? "").trim(),
    bodyEn: String(formData.get("bodyEn") ?? "").trim(),
    excerptFr: String(formData.get("excerptFr") ?? "") || undefined,
    bodyFr: String(formData.get("bodyFr") ?? "") || undefined,
    category: String(formData.get("category") ?? "") || undefined,
    coverImage: photos[0],
    gallery: photos.slice(1),
    layout: formData.get("layout") === "reportage" ? "reportage" : "article",
    status: formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
  });
  } catch {
    return { message: "L’enregistrement a échoué. Votre texte est conservé dans le formulaire. Réessayez." };
  }
  revalidatePath("/admin/news");
  revalidateSite();
  redirect("/admin/news?saved=1");
}

export async function deleteNewsAction(id: string) {
  await requireSession();
  await content.deleteNews(id);
  revalidatePath("/admin/news");
  revalidateSite();
}

/* ---------- programs ---------- */

export async function saveProgramAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "") || undefined;
  await content.upsertProgram({
    id,
    slug: String(formData.get("slug") ?? "").trim(),
    cycle: String(formData.get("cycle") ?? "LICENCE") as never,
    titleFr: String(formData.get("titleFr") ?? ""),
    summaryFr: String(formData.get("summaryFr") ?? "") || undefined,
    durationFr: String(formData.get("durationFr") ?? "") || undefined,
  });
  revalidatePath("/admin/programs");
  revalidateSite();
  redirect("/admin/programs");
}

export async function deleteProgramAction(id: string) {
  await requireSession();
  await content.deleteProgram(id);
  revalidatePath("/admin/programs");
  revalidateSite();
}

/* ---------- faculty ---------- */

export async function saveFacultyAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "") || undefined;
  await content.upsertFaculty({
    id,
    nameFr: String(formData.get("nameFr") ?? ""),
    titleFr: String(formData.get("titleFr") ?? "") || undefined,
    email: String(formData.get("email") ?? "") || undefined,
  });
  revalidatePath("/admin/faculty");
  revalidateSite();
  redirect("/admin/faculty");
}

export async function deleteFacultyAction(id: string) {
  await requireSession();
  await content.deleteFaculty(id);
  revalidatePath("/admin/faculty");
  revalidateSite();
}

/* ---------- documents ---------- */

export async function saveDocumentAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "") || undefined;
  await content.upsertDocument({
    id,
    titleFr: String(formData.get("titleFr") ?? ""),
    category: String(formData.get("category") ?? "") || undefined,
    fileUrl: String(formData.get("fileUrl") ?? "#"),
  });
  revalidatePath("/admin/documents");
  revalidateSite();
  redirect("/admin/documents");
}

export async function deleteDocumentAction(id: string) {
  await requireSession();
  await content.deleteDocument(id);
  revalidatePath("/admin/documents");
  revalidateSite();
}

/* ---------- menu ---------- */

export async function saveMenuItemAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "") || undefined;
  await content.upsertMenuItem({
    id,
    labelFr: String(formData.get("labelFr") ?? ""),
    href: String(formData.get("href") ?? "/"),
    parentId: String(formData.get("parentId") ?? "") || null,
    order: Number(formData.get("order") ?? 0),
  });
  revalidatePath("/admin/menu");
  revalidateSite();
  redirect("/admin/menu");
}

export async function deleteMenuItemAction(id: string) {
  await requireSession();
  await content.deleteMenuItem(id);
  revalidatePath("/admin/menu");
  revalidateSite();
}
