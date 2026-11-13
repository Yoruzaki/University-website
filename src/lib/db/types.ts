/* ------------------------------------------------------------
   Content types. These mirror prisma/schema.prisma 1:1 — that
   schema is the documented target for a future Postgres
   migration. The runtime store (./store.ts) persists the same
   shapes as JSON files so the project runs with zero native
   dependencies and no external services.
------------------------------------------------------------- */

export type Role = "SUPER_ADMIN" | "EDITOR" | "CONTRIBUTOR";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
}

export type PageStatus = "DRAFT" | "PUBLISHED";

export type SectionType =
  | "ANNOUNCEMENTS"
  | "OPPORTUNITIES"
  | "RESOURCE_GRID"
  | "SERVICE_GRID"
  | "EVENTS_LIST"
  | "HERO"
  | "EDITORIAL"
  | "STATS"
  | "PHOTO_STORY"
  | "CARD_GRID"
  | "RESEARCH_SPOTLIGHT"
  | "NEWS_LIST"
  | "FACULTY_GRID"
  | "TIMELINE"
  | "PARTNERS"
  | "QUOTE"
  | "CONTACT_CTA"
  | "DOWNLOADS"
  | "GALLERY";

export type SectionVariant = "LIGHT" | "DARK";

export interface Section {
  hidden?: boolean;
  id: string;
  pageId: string;
  type: SectionType;
  variant: SectionVariant;
  order: number;
  dataFr: Record<string, unknown>;
  dataAr?: Record<string, unknown>;
  dataEn?: Record<string, unknown>;
}

export interface Page {
  id: string;
  slug: string; // "" for home
  status: PageStatus;
  titleFr: string;
  titleAr?: string;
  titleEn?: string;
  seoDescFr?: string;
  seoDescAr?: string;
  seoDescEn?: string;
  /** Photo of the banner at the top of the page (URL or /photos/… path). Not used when the page starts with a HERO. */
  bannerImage?: string;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}

export interface NewsItem {
  gallery?: string[];
  layout?: "article" | "reportage";
  featured?: boolean;
  id: string;
  slug: string;
  status: PageStatus;
  titleFr: string;
  titleAr?: string;
  titleEn?: string;
  excerptFr?: string;
  excerptAr?: string;
  excerptEn?: string;
  bodyFr?: string;
  bodyAr?: string;
  bodyEn?: string;
  coverImage?: string;
  category?: string;
  publishedAt: string;
  createdAt: string;
}

export type ProgramCycle = "LICENCE" | "INGENIEUR" | "MASTER" | "DOCTORAT";

export interface Program {
  id: string;
  slug: string;
  cycle: ProgramCycle;
  titleFr: string;
  titleAr?: string;
  titleEn?: string;
  summaryFr?: string;
  summaryAr?: string;
  summaryEn?: string;
  durationFr?: string;
  syllabusUrl?: string;
  order: number;
  createdAt: string;
}

export interface Lab {
  id: string;
  slug: string;
  nameFr: string;
  nameAr?: string;
  summaryFr?: string;
  summaryAr?: string;
  createdAt: string;
}

export interface FacultyMember {
  id: string;
  nameFr: string;
  nameAr?: string;
  titleFr?: string;
  titleAr?: string;
  email?: string;
  photo?: string;
  labId?: string;
  order: number;
  createdAt: string;
}

export interface DocumentFile {
  id: string;
  titleFr: string;
  titleAr?: string;
  category?: string;
  fileUrl: string;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  labelFr: string;
  labelAr?: string;
  labelEn?: string;
  href: string;
  order: number;
  parentId?: string | null;
}

export interface Media {
  id: string;
  url: string;
  altFr?: string;
  altAr?: string;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface DB {
  bulletins: Bulletin[];
  services: DigitalService[];
  events: UniversityEvent[];
  users: User[];
  pages: Page[];
  news: NewsItem[];
  programs: Program[];
  labs: Lab[];
  faculty: FacultyMember[];
  documents: DocumentFile[];
  menu: MenuItem[];
  media: Media[];
}

export interface Bulletin {
  id: string;
  kind: "annonces" | "opportunites";
  titleFr: string;
  titleAr?: string;
  titleEn?: string;
  summaryFr: string;
  summaryAr?: string;
  summaryEn?: string;
  category: string;
  audience: string;
  url: string;
  deadline?: string;
  featured: boolean;
  status: PageStatus;
  publishedAt: string;
}

export interface DigitalService {
  id: string;
  titleFr: string;
  titleAr?: string;
  titleEn?: string;
  summaryFr?: string;
  summaryAr?: string;
  summaryEn?: string;
  url: string;
  category: string;
  enabled: boolean;
  order: number;
}

export interface UniversityEvent {
  id: string;
  slug: string;
  titleFr: string;
  titleAr?: string;
  titleEn?: string;
  summaryFr?: string;
  summaryAr?: string;
  summaryEn?: string;
  bodyFr?: string;
  category: string;
  location: string;
  startsAt: string;
  endsAt?: string;
  registrationUrl?: string;
  coverImage?: string;
  status: PageStatus;
  featured: boolean;
  createdAt: string;
}
