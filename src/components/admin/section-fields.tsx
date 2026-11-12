import type { Section } from "@/lib/db/types";

function str(d: Record<string, unknown>, k: string): string {
  return typeof d[k] === "string" ? (d[k] as string) : "";
}

function arr(d: Record<string, unknown>, k: string): Record<string, unknown>[] {
  return Array.isArray(d[k]) ? (d[k] as Record<string, unknown>[]) : [];
}

function Text({
  data,
  name,
  label,
  placeholder,
  value,
}: {
  data: Record<string, unknown>;
  name: string;
  label: string;
  placeholder?: string;
  value?: string;
}) {
  return (
    <div>
      <label className="a-label">{label}</label>
      <input
        name={name}
        defaultValue={value ?? str(data, name)}
        placeholder={placeholder}
        className="a-input mt-2"
      />
    </div>
  );
}

function Area({
  data,
  name,
  label,
  placeholder,
  rows = 3,
  value,
}: {
  data: Record<string, unknown>;
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  value?: string;
}) {
  return (
    <div>
      <label className="a-label">{label}</label>
      <textarea
        name={name}
        rows={rows}
        defaultValue={value ?? str(data, name)}
        placeholder={placeholder}
        className="a-input mt-2"
      />
    </div>
  );
}

/** Renders the right set of form fields for a section's type, pre-filled
 * from its current French content. Repeatable content (stats, cards,
 * timeline steps, partner names) uses one line per item with "|" between
 * sub-fields — the placeholder in each textarea documents the format. */
export default function SectionFields({ section }: { section: Section }) {
  const d = section.dataFr as Record<string, unknown>;

  const statsLines = arr(d, "items").map((it) => `${it.value ?? ""} | ${it.label ?? ""}`).join("\n");
  const cardsLines = arr(d, "cards")
    .map((it) => `${it.tag ?? ""} | ${it.title ?? ""} | ${it.body ?? ""} | ${it.href ?? ""} | ${it.imageCaption ?? ""}`)
    .join("\n");
  const imagesLines = arr(d, "images").map((it) => `${it.src ?? ""} | ${it.caption ?? ""}`).join("\n");
  const timelineLines = arr(d, "items").map((it) => `${it.year ?? ""} | ${it.title ?? ""} | ${it.body ?? ""}`).join("\n");
  const logosLines = arr(d, "logos").map((it) => `${it.name ?? ""}`).join("\n");

  switch (section.type) {
    case "HERO":
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Text data={d} name="eyebrow" label="Sur-titre" placeholder="Depuis 1986" />
          <Text data={d} name="ctaLabel" label="Bouton — texte" placeholder="Découvrir l'école" />
          <div className="sm:col-span-2">
            <Text data={d} name="title" label="Titre — mettez des mots entre *astérisques* pour l'italique" />
          </div>
          <div className="sm:col-span-2"><Area data={d} name="subtitle" label="Sous-titre" rows={2} /></div>
          <Text data={d} name="ctaHref" label="Bouton — lien" placeholder="/a-propos" />
          <Text data={d} name="scrollCue" label="Texte de défilement" placeholder="Faire défiler" />
          <div className="sm:col-span-2">
            <Area data={d} name="imageCaption" label="Photo — adresse d'une image (https://… ou /images/…) ou description" rows={1} />
          </div>
        </div>
      );
    case "EDITORIAL":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Text data={d} name="index" label="Numéro de section" placeholder="02" />
            <Text data={d} name="eyebrow" label="Sur-titre" />
          </div>
          <Text data={d} name="title" label="Titre" />
          <Area data={d} name="body" label="Texte (séparer les paragraphes par une ligne vide)" rows={6} />
        </div>
      );
    case "PHOTO_STORY":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Text data={d} name="eyebrow" label="Sur-titre" />
            <Text data={d} name="imagePosition" label="Position de la photo (left / right)" placeholder="left" />
          </div>
          <Text data={d} name="title" label="Titre" />
          <Area data={d} name="body" label="Texte" rows={4} />
          <Area data={d} name="imageCaption" label="Photo — adresse d'une image (https://… ou /images/…) ou description" rows={1} />
          <Text data={d} name="caption" label="Petite légende affichée sur la photo" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Text data={d} name="ctaLabel" label="Bouton — texte" />
            <Text data={d} name="ctaHref" label="Bouton — lien" />
          </div>
        </div>
      );
    case "STATS":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Text data={d} name="eyebrow" label="Sur-titre" />
            <Text data={d} name="title" label="Titre (optionnel)" />
          </div>
          <Area
            data={d}
            name="items"
            label="Chiffres — un par ligne : valeur | légende"
            placeholder={"38 ans | d'existence\n1200 | diplômés\n6 | laboratoires"}
            value={statsLines}
            rows={5}
          />
        </div>
      );
    case "CARD_GRID":
      return (
        <div className="space-y-4">
          <Text data={d} name="eyebrow" label="Sur-titre" />
          <Text data={d} name="title" label="Titre" />
          <Area data={d} name="intro" label="Introduction (optionnelle)" rows={2} />
          <Area
            data={d}
            name="cards"
            label="Cartes — une par ligne : étiquette | titre | texte | lien | photo (adresse d'image)"
            placeholder={"Licence | Écologie forestière | Une base solide en sciences naturelles | /programmes/licence | /photos/serre-pepiniere.jpg"}
            value={cardsLines}
            rows={6}
          />
        </div>
      );
    case "RESEARCH_SPOTLIGHT":
      return (
        <div className="space-y-4">
          <Text data={d} name="eyebrow" label="Sur-titre" />
          <Text data={d} name="title" label="Titre" />
          <Area data={d} name="body" label="Texte" rows={3} />
          <Area data={d} name="imageCaption" label="Photo — adresse d'une image (https://… ou /images/…) ou description" rows={1} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Text data={d} name="statValue" label="Chiffre clé" placeholder="14" />
            <Text data={d} name="statLabel" label="Légende du chiffre" placeholder="projets de recherche en cours" />
            <Text data={d} name="ctaLabel" label="Bouton — texte" />
            <Text data={d} name="ctaHref" label="Bouton — lien" />
          </div>
        </div>
      );
    case "NEWS_LIST":
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Text data={d} name="eyebrow" label="Sur-titre" />
          <Text data={d} name="title" label="Titre" />
          <Text
            data={d}
            name="count"
            label="Nombre d'articles affichés"
            placeholder="3"
            value={typeof d.count === "number" ? String(d.count) : undefined}
          />
          <p className="caption col-span-full">Affiche automatiquement les dernières actualités publiées.</p>
        </div>
      );
    case "FACULTY_GRID":
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Text data={d} name="eyebrow" label="Sur-titre" />
          <Text data={d} name="title" label="Titre" />
          <p className="caption col-span-full">Affiche automatiquement la liste des enseignants.</p>
        </div>
      );
    case "TIMELINE":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Text data={d} name="eyebrow" label="Sur-titre" />
            <Text data={d} name="title" label="Titre" />
          </div>
          <Area
            data={d}
            name="items"
            label="Étapes — une par ligne : année | titre | texte"
            placeholder={"1986 | Création de l'école | ..."}
            value={timelineLines}
            rows={6}
          />
        </div>
      );
    case "PARTNERS":
      return (
        <div className="space-y-4">
          <Text data={d} name="title" label="Titre (optionnel)" />
          <Area data={d} name="logos" label="Partenaires — un nom par ligne" value={logosLines} rows={4} />
          <Area data={d} name="imageCaption" label="Photo — adresse d'une image (https://… ou /photos/…) ou description" rows={1} />
        </div>
      );
    case "QUOTE":
      return (
        <div className="space-y-4">
          <Area data={d} name="quote" label="Citation" rows={3} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Text data={d} name="author" label="Auteur" />
            <Text data={d} name="role" label="Fonction" />
          </div>
        </div>
      );
    case "CONTACT_CTA":
      return (
        <div className="space-y-4">
          <Text data={d} name="eyebrow" label="Sur-titre" />
          <Text data={d} name="title" label="Titre" />
          <Area data={d} name="body" label="Texte" rows={2} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Text data={d} name="address" label="Adresse" />
            <Text data={d} name="email" label="Courriel" />
            <Text data={d} name="phone" label="Téléphone" />
          </div>
          <Area data={d} name="imageCaption" label="Photo — adresse d'une image (https://… ou /photos/…) ou description" rows={1} />
        </div>
      );
    case "GALLERY":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Text data={d} name="eyebrow" label="Sur-titre" placeholder="Vie universitaire" />
            <Text data={d} name="title" label="Titre" />
          </div>
          <Area data={d} name="intro" label="Introduction (optionnelle)" rows={2} />
          <Area
            data={d}
            name="images"
            label="Photos — une par ligne : adresse de l'image | légende"
            placeholder={"/photos/salle-informatique.jpg | Apprendre / Partager\n/photos/bibliotheque-livres.jpg | Lire / Chercher"}
            value={imagesLines}
            rows={6}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Text data={d} name="ctaLabel" label="Lien — texte" />
            <Text data={d} name="ctaHref" label="Lien — adresse" />
          </div>
        </div>
      );
    case "DOWNLOADS":
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Text data={d} name="eyebrow" label="Sur-titre" />
          <Text data={d} name="title" label="Titre" />
          <p className="caption col-span-full">Affiche automatiquement les documents de la bibliothèque.</p>
        </div>
      );
    default:
      return null;
  }
}
