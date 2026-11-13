import { readDb, mutateDb, newId } from "@/lib/db/store";
import type {
  Page,
  Section,
  NewsItem,
  Program,
  FacultyMember,
  Lab,
  DocumentFile,
  MenuItem,
} from "@/lib/db/types";
import type { Locale } from "@/lib/i18n";

/* ---------- localized field helpers ---------- */

export function pick(obj: object, field: string, locale: Locale): unknown {
  const suffix = locale === "fr" ? "Fr" : locale === "ar" ? "Ar" : "En";
  const record = obj as Record<string, unknown>;
  const value = record[`${field}${suffix}`];
  return value === "" || value == null ? record[`${field}Fr`] : value;
}

export function localizedText(obj: object, field: string, locale: Locale): string {
  const v = pick(obj, field, locale);
  return typeof v === "string" ? v : "";
}

/* ---------- menu ---------- */

export async function getMenu(locale: Locale): Promise<
  { id: string; label: string; href: string; children: { id: string; label: string; href: string }[] }[]
> {
  const db = readDb();
  const top = db.menu
    .filter((m) => !m.parentId)
    .sort((a, b) => a.order - b.order);
  return top.map((m) => ({
    id: m.id,
    label: localizedText(m, "label", locale),
    href: m.href,
    children: db.menu
      .filter((c) => c.parentId === m.id)
      .sort((a, b) => a.order - b.order)
      .map((c) => ({ id: c.id, label: localizedText(c, "label", locale), href: c.href })),
  }));
}

export async function getAllMenuItemsFlat(): Promise<MenuItem[]> {
  const db = readDb();
  return db.menu.sort((a, b) => a.order - b.order);
}

/* ---------- pages ---------- */

export async function getPublishedPageBySlug(slug: string): Promise<Page | null> {
  const db = readDb();
  const page = db.pages.find((p) => p.slug === slug && p.status === "PUBLISHED");
  if (!page) return null;
  return { ...page, sections: [...page.sections].sort((a, b) => a.order - b.order) };
}

export async function getAllPages(): Promise<Page[]> {
  const db = readDb();
  return [...db.pages].sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function getPageById(id: string): Promise<Page | null> {
  const db = readDb();
  return db.pages.find((p) => p.id === id) ?? null;
}

export function sectionData(section: Section, locale: Locale): Record<string, unknown> {
  const map = { fr: section.dataFr, ar: section.dataAr, en: section.dataEn };
  return map[locale] ?? section.dataFr;
}

export async function createPage(input: {
  slug: string;
  titleFr: string;
}): Promise<Page> {
  return mutateDb((db) => {
    const now = new Date().toISOString();
    const page: Page = {
      id: newId("page"),
      slug: input.slug,
      status: "DRAFT",
      titleFr: input.titleFr,
      sections: [],
      createdAt: now,
      updatedAt: now,
    };
    db.pages.push(page);
    return page;
  });
}

export async function updatePageMeta(
  id: string,
  patch: Partial<Pick<Page, "slug" | "titleFr" | "titleAr" | "titleEn" | "status" | "seoDescFr" | "bannerImage">>
): Promise<Page | null> {
  return mutateDb((db) => {
    const page = db.pages.find((p) => p.id === id);
    if (!page) return null;
    Object.assign(page, patch, { updatedAt: new Date().toISOString() });
    return page;
  });
}

export async function deletePage(id: string): Promise<void> {
  mutateDb((db) => {
    db.pages = db.pages.filter((p) => p.id !== id);
  });
}

export async function addSection(
  pageId: string,
  type: Section["type"],
  variant: Section["variant"]
): Promise<Section | null> {
  return mutateDb((db) => {
    const page = db.pages.find((p) => p.id === pageId);
    if (!page) return null;
    const section: Section = {
      id: newId("sec"),
      pageId,
      type,
      variant,
      order: page.sections.length,
      dataFr: {},
    };
    page.sections.push(section);
    page.updatedAt = new Date().toISOString();
    return section;
  });
}

export async function updateSection(
  pageId: string,
  sectionId: string,
  patch: Partial<Pick<Section, "variant" | "dataFr" | "dataAr" | "dataEn" | "hidden">>
): Promise<void> {
  mutateDb((db) => {
    const page = db.pages.find((p) => p.id === pageId);
    const section = page?.sections.find((s) => s.id === sectionId);
    if (!page || !section) return;
    Object.assign(section, patch);
    page.updatedAt = new Date().toISOString();
  });
}

export async function deleteSection(pageId: string, sectionId: string): Promise<void> {
  mutateDb((db) => {
    const page = db.pages.find((p) => p.id === pageId);
    if (!page) return;
    page.sections = page.sections
      .filter((s) => s.id !== sectionId)
      .map((s, i) => ({ ...s, order: i }));
    page.updatedAt = new Date().toISOString();
  });
}

export async function reorderSections(pageId: string, orderedIds: string[]): Promise<void> {
  mutateDb((db) => {
    const page = db.pages.find((p) => p.id === pageId);
    if (!page) return;
    const byId = new Map(page.sections.map((s) => [s.id, s]));
    page.sections = orderedIds
      .map((id, i) => {
        const s = byId.get(id);
        if (!s) return null;
        return { ...s, order: i };
      })
      .filter((s): s is Section => s !== null);
    page.updatedAt = new Date().toISOString();
  });
}

/* ---------- news ---------- */

export async function getPublishedNews(locale: Locale, limit?: number): Promise<NewsItem[]> {
  const db = readDb();
  const items = db.news
    .filter((n) => n.status === "PUBLISHED")
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || +new Date(b.publishedAt) - +new Date(a.publishedAt));
  return limit ? items.slice(0, limit) : items;
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const db = readDb();
  return db.news.find((n) => n.slug === slug) ?? null;
}

export async function getAllNews(): Promise<NewsItem[]> {
  const db = readDb();
  return [...db.news].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export async function upsertNews(item: Partial<NewsItem> & { id?: string }): Promise<NewsItem> {
  return mutateDb((db) => {
    if (db.news.some(n => n.slug === item.slug && n.id !== item.id)) throw new Error("Adresse déjà utilisée.");
    if (item.id) {
      const existing = db.news.find((n) => n.id === item.id);
      if (existing) {
        Object.assign(existing, item);
        return existing;
      }
      throw new Error("Publication supprimée.");
    }
    const now = new Date().toISOString();
    const created: NewsItem = {

      slug: item.slug ?? newId(),
      status: item.status ?? "DRAFT",
      titleFr: item.titleFr ?? "Sans titre",
      excerptFr: item.excerptFr,
      bodyFr: item.bodyFr,
      coverImage: item.coverImage,
      category: item.category,
      publishedAt: item.publishedAt ?? now,
      createdAt: now,
      ...item,
      id: newId("news"),
    };
    db.news.push(created);
    return created;
  });
}

export async function deleteNews(id: string): Promise<void> {
  mutateDb((db) => {
    db.news = db.news.filter((n) => n.id !== id);
  });
}

/* ---------- programs ---------- */

export async function getProgramsByCycle(cycle?: Program["cycle"]): Promise<Program[]> {
  const db = readDb();
  const items = cycle ? db.programs.filter((p) => p.cycle === cycle) : db.programs;
  return [...items].sort((a, b) => a.order - b.order);
}

export async function getAllPrograms(): Promise<Program[]> {
  const db = readDb();
  return [...db.programs].sort((a, b) => a.order - b.order);
}

export async function upsertProgram(item: Partial<Program> & { id?: string }): Promise<Program> {
  return mutateDb((db) => {
    if (item.id) {
      const existing = db.programs.find((p) => p.id === item.id);
      if (existing) {
        Object.assign(existing, item);
        return existing;
      }
    }
    const created: Program = {

      slug: item.slug ?? newId(),
      cycle: item.cycle ?? "LICENCE",
      titleFr: item.titleFr ?? "Sans titre",
      order: item.order ?? db.programs.length,
      createdAt: new Date().toISOString(),
      ...item,
      id: newId("prog"),
    };
    db.programs.push(created);
    return created;
  });
}

export async function deleteProgram(id: string): Promise<void> {
  mutateDb((db) => {
    db.programs = db.programs.filter((p) => p.id !== id);
  });
}

/* ---------- faculty & labs ---------- */

export async function getAllFaculty(): Promise<FacultyMember[]> {
  const db = readDb();
  return [...db.faculty].sort((a, b) => a.order - b.order);
}

export async function getAllLabs(): Promise<Lab[]> {
  const db = readDb();
  return db.labs;
}

export async function upsertFaculty(
  item: Partial<FacultyMember> & { id?: string }
): Promise<FacultyMember> {
  return mutateDb((db) => {
    if (item.id) {
      const existing = db.faculty.find((f) => f.id === item.id);
      if (existing) {
        Object.assign(existing, item);
        return existing;
      }
    }
    const created: FacultyMember = {

      nameFr: item.nameFr ?? "Sans nom",
      order: item.order ?? db.faculty.length,
      createdAt: new Date().toISOString(),
      ...item,
      id: newId("fac"),
    };
    db.faculty.push(created);
    return created;
  });
}

export async function deleteFaculty(id: string): Promise<void> {
  mutateDb((db) => {
    db.faculty = db.faculty.filter((f) => f.id !== id);
  });
}

/* ---------- documents ---------- */

export async function getAllDocuments(): Promise<DocumentFile[]> {
  const db = readDb();
  return db.documents;
}

export async function upsertDocument(
  item: Partial<DocumentFile> & { id?: string }
): Promise<DocumentFile> {
  return mutateDb((db) => {
    if (item.id) {
      const existing = db.documents.find((d) => d.id === item.id);
      if (existing) {
        Object.assign(existing, item);
        return existing;
      }
    }
    const created: DocumentFile = {

      titleFr: item.titleFr ?? "Document",
      fileUrl: item.fileUrl ?? "#",
      createdAt: new Date().toISOString(),
      ...item,
      id: newId("doc"),
    };
    db.documents.push(created);
    return created;
  });
}

export async function deleteDocument(id: string): Promise<void> {
  mutateDb((db) => {
    db.documents = db.documents.filter((d) => d.id !== id);
  });
}

/* ---------- menu mutations ---------- */

export async function upsertMenuItem(item: Partial<MenuItem> & { id?: string }): Promise<MenuItem> {
  return mutateDb((db) => {
    if (item.id) {
      const existing = db.menu.find((m) => m.id === item.id);
      if (existing) {
        Object.assign(existing, item);
        return existing;
      }
    }
    const created: MenuItem = {

      labelFr: item.labelFr ?? "Lien",
      href: item.href ?? "/",
      order: item.order ?? db.menu.length,
      parentId: item.parentId ?? null,
      ...item,
      id: newId("menu"),
    };
    db.menu.push(created);
    return created;
  });
}

export async function deleteMenuItem(id: string): Promise<void> {
  mutateDb((db) => {
    db.menu = db.menu.filter((m) => m.id !== id && m.parentId !== id);
  });
}
