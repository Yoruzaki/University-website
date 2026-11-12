// Seeds data/db.json with a realistic starting point for ENSF Khenchela:
// an admin account, the main navigation, a handful of fully built pages,
// and sample news/programs/faculty/documents. Safe to re-run — it
// overwrites data/db.json each time. Edit by hand or, better, through
// the admin dashboard once the site is running.
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";

const now = new Date().toISOString();
const id = (p) => `${p}_${crypto.randomUUID().replace(/-/g, "")}`;

const passwordHash = await bcrypt.hash("ChangeMe123!", 10);

const users = [
  {
    id: id("user"),
    name: "Administrateur ENSF",
    email: "admin@ensf-khenchela.dz",
    passwordHash,
    role: "SUPER_ADMIN",
    createdAt: now,
  },
];

function section(type, variant, dataFr, order) {
  return { id: id("sec"), pageId: "", type, variant, order, dataFr };
}

function page(slug, titleFr, sections) {
  const pid = id("page");
  return {
    id: pid,
    slug,
    status: "PUBLISHED",
    titleFr,
    sections: sections.map((s, i) => ({ ...s, pageId: pid, order: i })),
    createdAt: now,
    updatedAt: now,
  };
}

const homePage = page("", "Accueil", [
  section("HERO", "DARK", {
    eyebrow: "École Nationale Supérieure des Forêts — depuis 1986",
    title: "Former les gardiens du patrimoine forestier algérien",
    subtitle:
      "À Khenchela, au cœur des Aurès, l'ENSF forme des ingénieurs et conduit des recherches au service de la forêt, de la biodiversité et des territoires.",
    imageCaption: "Photo : canopée forestière des monts de Khenchela, lumière de fin de journée",
    ctaLabel: "Découvrir l'école",
    ctaHref: "/a-propos",
    scrollCue: "Faire défiler",
  }),
  section("EDITORIAL", "LIGHT", {
    index: "02",
    eyebrow: "Notre mission",
    title: "Une école tournée vers la forêt, la biodiversité et la recherche",
    body:
      "L'ENSF Khenchela forme des ingénieurs forestiers capables de comprendre, gérer et protéger les écosystèmes forestiers algériens, du littoral aux hauts plateaux.\n\nNos enseignements associent sciences naturelles, gestion des territoires et recherche appliquée, en lien étroit avec la Direction Générale des Forêts et les acteurs du développement rural.",
  }),
  section("STATS", "DARK", {
    eyebrow: "L'école en chiffres",
    items: [
      { value: "38 ans", label: "d'existence" },
      { value: "1200+", label: "diplômés en activité" },
      { value: "6", label: "laboratoires de recherche" },
      { value: "4", label: "cycles de formation" },
    ],
  }),
  section("PHOTO_STORY", "DARK", {
    eyebrow: "Recherche appliquée",
    title: "Comprendre la forêt pour mieux la protéger",
    body:
      "Nos équipes étudient la dynamique des peuplements forestiers, les risques d'incendie et d'érosion, et la conservation de la biodiversité des massifs des Aurès et au-delà.",
    imageCaption: "Photo : chercheurs en relevé de terrain, sous-bois",
    imagePosition: "left",
    caption: "Campagne de relevés, massif des Aurès",
    ctaLabel: "Explorer nos recherches",
    ctaHref: "/recherche",
  }),
  section("CARD_GRID", "LIGHT", {
    eyebrow: "Formations",
    title: "Quatre cycles, un même terrain d'étude : la forêt",
    intro: "De la licence au doctorat, nos programmes forment des spécialistes des sciences forestières.",
    cards: [
      {
        tag: "Ingénieur",
        title: "Ingénieur d'État en sciences forestières",
        body: "La formation historique de l'école, cinq années d'enseignement intégré.",
        href: "/programmes",
      },
      { tag: "Licence", title: "Licence en écologie forestière", body: "Trois années de bases naturalistes et de terrain.", href: "/programmes" },
      { tag: "Master", title: "Master recherche et gestion forestière", body: "Spécialisation recherche ou professionnelle.", href: "/programmes" },
      { tag: "Doctorat", title: "Doctorat en sciences forestières", body: "Recherche doctorale au sein de nos laboratoires.", href: "/programmes" },
    ],
  }),
  section("RESEARCH_SPOTLIGHT", "LIGHT", {
    eyebrow: "À la une de la recherche",
    title: "Cartographier la résilience des subéraies algériennes face au changement climatique",
    body: "Un programme pluriannuel associant télédétection, inventaires de terrain et modélisation pour anticiper l'évolution des chênaies-lièges.",
    imageCaption: "Photo : subéraie, écorce de chêne-liège",
    statValue: "14",
    statLabel: "projets de recherche en cours",
    ctaLabel: "En savoir plus",
    ctaHref: "/recherche",
  }),
  section("NEWS_LIST", "LIGHT", { eyebrow: "Actualités", title: "L'actualité de l'école", count: 3 }),
  section("FACULTY_GRID", "LIGHT", { eyebrow: "Équipe", title: "Nos enseignants-chercheurs" }),
  section("QUOTE", "DARK", {
    quote:
      "Chaque ingénieur que nous formons repart avec une conviction simple : la forêt ne se protège qu'en la comprenant vraiment.",
    author: "Direction de l'ENSF",
    role: "Khenchela",
  }),
  section("PARTNERS", "LIGHT", {
    title: "Nos partenaires institutionnels",
    logos: [
      { name: "Direction Générale des Forêts" },
      { name: "Ministère de l'Enseignement Supérieur" },
      { name: "INRF" },
      { name: "Université de Batna 2" },
    ],
  }),
  section("CONTACT_CTA", "DARK", {
    eyebrow: "Nous contacter",
    title: "Une question sur nos formations ou nos recherches ?",
    body: "Notre équipe se tient à votre disposition.",
    address: "Route de Batna, Khenchela 40000, Algérie",
    email: "contact@ensf-khenchela.dz",
    phone: "+213 32 00 00 00",
  }),
]);

const aboutPage = page("a-propos", "À propos", [
  section("EDITORIAL", "LIGHT", {
    index: "01",
    eyebrow: "Depuis 1986",
    title: "L'École Nationale Supérieure des Forêts",
    body:
      "Implantée à Khenchela, au cœur du massif des Aurès, l'ENSF est l'unique établissement algérien entièrement consacré aux sciences forestières.\n\nElle forme des ingénieurs et des chercheurs capables d'agir sur l'ensemble des enjeux liés à la forêt : gestion durable, biodiversité, lutte contre l'érosion et les incendies, foresterie urbaine et changement climatique.",
  }),
  section("TIMELINE", "LIGHT", {
    eyebrow: "Histoire",
    title: "Quelques repères",
    items: [
      { year: "1986", title: "Création de l'école", body: "Ouverture de l'Institut puis de l'École Nationale Supérieure des Forêts à Khenchela." },
      { year: "1998", title: "Premiers laboratoires de recherche", body: "Structuration des équipes autour de l'écologie forestière et de la gestion des territoires." },
      { year: "2010", title: "Ouverture du cycle Master", body: "Lancement des spécialisations recherche et professionnelle." },
      { year: "2021", title: "Programme doctoral", body: "Accréditation du doctorat en sciences forestières." },
    ],
  }),
  section("QUOTE", "DARK", {
    quote: "Notre vocation est de transmettre un savoir scientifique rigoureux, au service direct des forêts algériennes.",
    author: "Direction des études",
  }),
]);

const researchPage = page("recherche", "Recherche", [
  section("EDITORIAL", "LIGHT", {
    index: "01",
    eyebrow: "Recherche",
    title: "Six laboratoires, un même terrain : la forêt algérienne",
    body:
      "Nos équipes conduisent des recherches sur l'écologie forestière, la gestion des risques naturels, la biodiversité et les usages socio-économiques de la forêt.",
  }),
  section("CARD_GRID", "LIGHT", {
    eyebrow: "Laboratoires",
    title: "Nos axes de recherche",
    cards: [
      { tag: "Écologie", title: "Écologie et dynamique forestière", body: "Suivi des peuplements et de leur évolution face aux pressions climatiques." },
      { tag: "Risques", title: "Risques naturels", body: "Incendies, érosion des sols, cartographie des aléas." },
      { tag: "Biodiversité", title: "Biodiversité et conservation", body: "Inventaires faunistiques et floristiques des massifs forestiers." },
      { tag: "Socio-économie", title: "Usages et territoires", body: "Relations entre populations locales et ressources forestières." },
    ],
  }),
  section("PARTNERS", "LIGHT", {
    title: "Partenaires scientifiques",
    logos: [{ name: "INRF" }, { name: "Université de Batna 2" }, { name: "CRSTRA" }],
  }),
]);

const programsPage = page("programmes", "Programmes", [
  section("EDITORIAL", "LIGHT", {
    index: "01",
    eyebrow: "Formations",
    title: "De la licence au doctorat",
    body: "L'ENSF propose un continuum complet de formations en sciences forestières, articulé autour de la pratique de terrain et de la recherche.",
  }),
  section("CARD_GRID", "LIGHT", {
    eyebrow: "Cycles",
    title: "Nos quatre cycles",
    cards: [
      { tag: "Licence", title: "Licence en écologie forestière", body: "Trois années de formation généraliste en sciences naturelles et forestières." },
      { tag: "Ingénieur", title: "Ingénieur d'État en sciences forestières", body: "La formation historique et phare de l'école." },
      { tag: "Master", title: "Master recherche et gestion forestière", body: "Deux parcours : recherche ou professionnel." },
      { tag: "Doctorat", title: "Doctorat en sciences forestières", body: "Recherche doctorale encadrée au sein de nos laboratoires." },
    ],
  }),
]);

const contactPage = page("contact", "Contact", [
  section("CONTACT_CTA", "DARK", {
    eyebrow: "Nous contacter",
    title: "Parlons de votre projet d'études ou de recherche",
    body: "L'équipe administrative et pédagogique de l'ENSF vous répond.",
    address: "Route de Batna, Khenchela 40000, Algérie",
    email: "contact@ensf-khenchela.dz",
    phone: "+213 32 00 00 00",
  }),
  section("EDITORIAL", "LIGHT", {
    index: "02",
    eyebrow: "Informations pratiques",
    title: "Accès et horaires",
    body: "L'école est accessible depuis le centre-ville de Khenchela. Les services administratifs sont ouverts du dimanche au jeudi, de 8h à 16h.",
  }),
]);

const pages = [homePage, aboutPage, researchPage, programsPage, contactPage];

const news = [
  {
    id: id("news"),
    slug: "campagne-reboisement-2026",
    status: "PUBLISHED",
    titleFr: "Lancement d'une nouvelle campagne de reboisement dans les Aurès",
    excerptFr: "Étudiants et enseignants de l'ENSF participent à une campagne de reboisement sur 40 hectares.",
    bodyFr:
      "L'ENSF a lancé une nouvelle campagne de reboisement en partenariat avec la Direction Générale des Forêts, sur une surface de 40 hectares dans le massif des Aurès.\n\nCette opération mobilise plusieurs promotions d'étudiants ingénieurs, encadrés par les enseignants du département d'écologie forestière.",
    coverImage: "Photo : plantation d'arbres, bénévoles sur le terrain",
    category: "Vie de l'école",
    publishedAt: now,
    createdAt: now,
  },
  {
    id: id("news"),
    slug: "colloque-biodiversite-khenchela",
    status: "PUBLISHED",
    titleFr: "Colloque international sur la biodiversité forestière à Khenchela",
    excerptFr: "L'ENSF a accueilli des chercheurs de plusieurs pays méditerranéens autour de la conservation des forêts.",
    bodyFr:
      "Pendant trois jours, l'ENSF a réuni des chercheurs algériens, tunisiens et français autour des enjeux de conservation de la biodiversité forestière méditerranéenne.\n\nLes travaux ont porté sur le suivi des espèces menacées et la restauration des écosystèmes dégradés.",
    coverImage: "Photo : salle de colloque, intervenants",
    category: "Recherche",
    publishedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    createdAt: now,
  },
  {
    id: id("news"),
    slug: "ouverture-inscriptions-master-2026",
    status: "PUBLISHED",
    titleFr: "Ouverture des inscriptions au Master recherche et gestion forestière",
    excerptFr: "Les inscriptions pour la rentrée 2026 du Master sont désormais ouvertes.",
    bodyFr:
      "Les candidatures pour la rentrée 2026 du Master recherche et gestion forestière sont ouvertes jusqu'au 30 septembre.\n\nLe programme propose deux parcours : recherche et professionnel, avec des stages encadrés par nos laboratoires partenaires.",
    coverImage: "Photo : campus de l'ENSF",
    category: "Admissions",
    publishedAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    createdAt: now,
  },
];

const programs = [
  { id: id("prog"), slug: "licence-ecologie-forestiere", cycle: "LICENCE", titleFr: "Licence en écologie forestière", summaryFr: "Trois années de formation généraliste.", durationFr: "3 ans", order: 0, createdAt: now },
  { id: id("prog"), slug: "ingenieur-sciences-forestieres", cycle: "INGENIEUR", titleFr: "Ingénieur d'État en sciences forestières", summaryFr: "La formation historique de l'école.", durationFr: "5 ans", order: 1, createdAt: now },
  { id: id("prog"), slug: "master-recherche-gestion-forestiere", cycle: "MASTER", titleFr: "Master recherche et gestion forestière", summaryFr: "Deux parcours : recherche ou professionnel.", durationFr: "2 ans", order: 2, createdAt: now },
  { id: id("prog"), slug: "doctorat-sciences-forestieres", cycle: "DOCTORAT", titleFr: "Doctorat en sciences forestières", summaryFr: "Recherche doctorale encadrée.", durationFr: "3 à 5 ans", order: 3, createdAt: now },
];

const labs = [
  { id: id("lab"), slug: "ecologie-dynamique-forestiere", nameFr: "Écologie et dynamique forestière", summaryFr: "Suivi des peuplements forestiers.", createdAt: now },
  { id: id("lab"), slug: "risques-naturels", nameFr: "Risques naturels", summaryFr: "Incendies, érosion, cartographie des aléas.", createdAt: now },
];

const faculty = [
  { id: id("fac"), nameFr: "Pr. Amina Belkacem", titleFr: "Professeure, Écologie forestière", email: "a.belkacem@ensf-khenchela.dz", labId: labs[0].id, order: 0, createdAt: now },
  { id: id("fac"), nameFr: "Dr. Yacine Haddad", titleFr: "Maître de conférences, Risques naturels", email: "y.haddad@ensf-khenchela.dz", labId: labs[1].id, order: 1, createdAt: now },
  { id: id("fac"), nameFr: "Dr. Sarah Meziane", titleFr: "Maîtresse de conférences, Biodiversité", email: "s.meziane@ensf-khenchela.dz", order: 2, createdAt: now },
  { id: id("fac"), nameFr: "Pr. Karim Boudiaf", titleFr: "Professeur, Gestion des territoires", email: "k.boudiaf@ensf-khenchela.dz", order: 3, createdAt: now },
];

const documents = [
  { id: id("doc"), titleFr: "Règlement intérieur des étudiants", category: "Vie étudiante", fileUrl: "/documents/reglement-interieur.pdf", createdAt: now },
  { id: id("doc"), titleFr: "Dossier d'inscription — Master 2026", category: "Admissions", fileUrl: "/documents/dossier-inscription-master.pdf", createdAt: now },
];

const menu = [
  { id: id("menu"), labelFr: "Accueil", href: "", order: 0, parentId: null },
  { id: id("menu"), labelFr: "À propos", href: "/a-propos", order: 1, parentId: null },
  { id: id("menu"), labelFr: "Programmes", href: "/programmes", order: 2, parentId: null },
  { id: id("menu"), labelFr: "Recherche", href: "/recherche", order: 3, parentId: null },
  { id: id("menu"), labelFr: "Actualités", href: "/actualites", order: 4, parentId: null },
  { id: id("menu"), labelFr: "Contact", href: "/contact", order: 5, parentId: null },
];

const db = {
  users,
  pages,
  news,
  programs,
  labs,
  faculty,
  documents,
  menu,
  media: [],
};

const dataDir = path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, "db.json"), JSON.stringify(db, null, 2), "utf-8");

console.log("Seed complete.");
console.log("Admin login: admin@ensf-khenchela.dz / ChangeMe123!");
