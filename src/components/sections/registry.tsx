import type { Section, SectionType } from "@/lib/db/types";
import type { Locale } from "@/lib/i18n";
import { sectionData } from "@/lib/content";

import Hero, { type HeroData } from "./hero";
import Editorial, { type EditorialData } from "./editorial";
import Stats, { type StatsData } from "./stats";
import PhotoStory, { type PhotoStoryData } from "./photo-story";
import CardGrid, { type CardGridData } from "./card-grid";
import ResearchSpotlight, { type ResearchSpotlightData } from "./research-spotlight";
import NewsList, { type NewsListData } from "./news-list";
import FacultyGrid, { type FacultyGridData } from "./faculty-grid";
import TimelineSection, { type TimelineData } from "./timeline";
import Partners, { type PartnersData } from "./partners";
import Quote, { type QuoteData } from "./quote";
import ContactCta, { type ContactCtaData } from "./contact-cta";
import Downloads, { type DownloadsData } from "./downloads";
import Gallery, { type GalleryData } from "./gallery";

export const sectionLibrary: { type: SectionType; label: string; description: string }[] = [
  { type: "HERO", label: "En-tête plein écran", description: "Grande photo, titre sur deux voix, deux boutons" },
  { type: "EDITORIAL", label: "Bloc éditorial", description: "Grand titre et texte en deux colonnes" },
  { type: "PHOTO_STORY", label: "Récit photographique", description: "Photo encadrée + texte, sur fond clair" },
  { type: "STATS", label: "Chiffres clés", description: "Lignes de grands chiffres numérotés" },
  { type: "CARD_GRID", label: "Grille de parcours", description: "Une grande carte photo et des cartes secondaires" },
  { type: "RESEARCH_SPOTLIGHT", label: "Mise en avant recherche", description: "Fond vert forêt, photo et chiffre clé" },
  { type: "NEWS_LIST", label: "Actualités", description: "Dernières actualités publiées, une à la une" },
  { type: "FACULTY_GRID", label: "Équipe / enseignants", description: "Grille de fiches enseignants" },
  { type: "TIMELINE", label: "Chronologie", description: "Grandes dates sur filets" },
  { type: "PARTNERS", label: "Partenaires", description: "Liste numérotée de partenaires + photo" },
  { type: "QUOTE", label: "Citation", description: "Grande citation en italique" },
  { type: "CONTACT_CTA", label: "Contact", description: "Coordonnées et appel à l'action" },
  { type: "DOWNLOADS", label: "Documents", description: "Liste de documents téléchargeables" },
  { type: "GALLERY", label: "Galerie photos", description: "Collage de photos (vie universitaire, campus…)" },
];

export async function renderSection(section: Section, locale: Locale, n = "") {
  const data = sectionData(section, locale);
  const variant = section.variant;
  const common = { n, locale };

  switch (section.type) {
    case "HERO":
      return <Hero data={data as unknown as HeroData} locale={locale} />;
    case "EDITORIAL":
      return <Editorial data={data as unknown as EditorialData} {...common} />;
    case "PHOTO_STORY":
      return <PhotoStory data={data as unknown as PhotoStoryData} {...common} />;
    case "STATS":
      return <Stats data={data as unknown as StatsData} variant={variant} {...common} />;
    case "CARD_GRID":
      return <CardGrid data={data as unknown as CardGridData} {...common} />;
    case "RESEARCH_SPOTLIGHT":
      return <ResearchSpotlight data={data as unknown as ResearchSpotlightData} {...common} />;
    case "NEWS_LIST":
      return <NewsList data={data as unknown as NewsListData} {...common} />;
    case "FACULTY_GRID":
      return <FacultyGrid data={data as unknown as FacultyGridData} {...common} />;
    case "TIMELINE":
      return <TimelineSection data={data as unknown as TimelineData} {...common} />;
    case "PARTNERS":
      return <Partners data={data as unknown as PartnersData} {...common} />;
    case "QUOTE":
      return <Quote data={data as unknown as QuoteData} variant={variant} {...common} />;
    case "CONTACT_CTA":
      return <ContactCta data={data as unknown as ContactCtaData} {...common} />;
    case "DOWNLOADS":
      return <Downloads data={data as unknown as DownloadsData} {...common} />;
    case "GALLERY":
      return <Gallery data={data as unknown as GalleryData} {...common} />;
    default:
      return null;
  }
}
