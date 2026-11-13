import Link from "next/link";
import { getAllPages, getAllNews, getAllPrograms, getAllFaculty } from "@/lib/content";
import { Icon } from "@/components/ui/chrome";
import { events, services } from "@/lib/university";

export default async function AdminHome() {
  const [pages, news, programs, faculty] = await Promise.all([
    getAllPages(),
    getAllNews(),
    getAllPrograms(),
    getAllFaculty(),
  ]);

  const drafts = pages.filter((p) => p.status === "DRAFT");
  const newsDrafts = news.filter((n) => n.status === "DRAFT");

  const stats = [
    { label: "Événements", value: events(true).length, href: "/admin/events", note: "Agenda, dates, lieux et inscriptions" },
    { label: "Services numériques", value: services(true).length, href: "/admin/services", note: "E-learning, bibliothèque, DSpace, EDX…" },
    { label: "Pages", value: pages.length, href: "/admin/pages", note: `${drafts.length} brouillon(s)` },
    { label: "Actualités", value: news.length, href: "/admin/news", note: `${newsDrafts.length} brouillon(s)` },
    { label: "Programmes", value: programs.length, href: "/admin/programs", note: "Offre de formation" },
    { label: "Enseignants", value: faculty.length, href: "/admin/faculty", note: "Équipe pédagogique" },
  ];

  const actions = [
    { label: "Actualité", note: "Rédiger un article ou un reportage photo.", href: "/admin/news/new" },
    { label: "Événement", note: "Programmer une date et préciser le lieu.", href: "/admin/events#event-form" },
    { label: "Annonce importante", note: "Diffuser un avis à la communauté.", href: "/admin/bulletins/annonces" },
    { label: "Opportunité", note: "Partager une bourse, un stage ou un appel.", href: "/admin/bulletins/opportunites" },  ];

  return (
    <div>
      <p className="a-kicker">Tableau de bord</p>
      <div className="flex flex-wrap items-end justify-between gap-8">
        <h1 className="a-title !text-[clamp(2.4rem,4vw,3.75rem)]">
          Que souhaitez-vous publier ?
        </h1>
        <div className="grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map(a => (
            <Link key={a.href} href={a.href} className="a-card p-5 transition-shadow hover:shadow-md">
              <strong className="flex items-center justify-between gap-2 text-lg">{a.label}<Icon name="arrow" size={16} /></strong>
              <span className="mt-2 block text-sm">{a.note}</span>
            </Link>
          ))}        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[['', 'Accueil', 'Actualités, événements, plateformes et ordre des sections.'], ['vie-etudiante', 'Vie étudiante', 'Clubs, campus, accompagnement et activités.'], ['scolarite', 'Scolarité', 'Emplois du temps, examens et ressources.']].map(([slug, title, note]) => {
          const page = pages.find((p) => p.slug === slug);
          return page && <Link key={slug} href={`/admin/pages/${page.id}`} className="a-card p-5"><strong className="text-lg">{title} ↗</strong><p className="mt-2 text-xs leading-relaxed text-ink-text-muted">{note}</p><span className="mt-4 block text-xs">{page.sections.length} sections modifiables</span></Link>;
        })}
      </div>

      <div className="mt-14 border-t border-[var(--rule)]">
        {stats.map((s, i) => (
          <Link
            key={s.href}
            href={s.href}
            className="group grid grid-cols-[60px_160px_1fr_auto] items-center border-b border-[var(--rule)] py-6 transition-colors hover:bg-white"
          >
            <span className="font-[var(--display)] text-[10px] font-semibold text-emerald">0{i + 1}</span>
            <strong className="font-[var(--display)] text-6xl font-medium leading-none tracking-[-0.07em] text-navy">
              {s.value}
            </strong>
            <span>
              <span className="block font-[var(--display)] text-xl font-medium text-forest-800">{s.label}</span>
              <small className="mt-1 block text-xs text-ink-text-muted">{s.note}</small>
            </span>
            <span className="pe-4 text-emerald transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              <Icon name="arrow" />
            </span>
          </Link>
        ))}
      </div>

      {drafts.length > 0 && (
        <div className="mt-16">
          <p className="a-kicker">Brouillons en attente</p>
          <table className="a-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>Adresse</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {drafts.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium">{p.titleFr}</td>
                  <td className="text-ink-text-muted">/{p.slug}</td>
                  <td className="text-end">
                    <Link href={`/admin/pages/${p.id}`} className="a-link">
                      Reprendre ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
