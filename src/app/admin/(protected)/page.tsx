import Link from "next/link";
import { getAllPages, getAllNews, getAllPrograms, getAllFaculty } from "@/lib/content";
import { Icon } from "@/components/ui/chrome";

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
    { label: "Pages", value: pages.length, href: "/admin/pages", note: `${drafts.length} brouillon(s)` },
    { label: "Actualités", value: news.length, href: "/admin/news", note: `${newsDrafts.length} brouillon(s)` },
    { label: "Programmes", value: programs.length, href: "/admin/programs", note: "Offre de formation" },
    { label: "Enseignants", value: faculty.length, href: "/admin/faculty", note: "Équipe pédagogique" },
  ];

  const actions = [
    { label: "Nouvelle page", href: "/admin/pages/new" },
    { label: "Nouvel article", href: "/admin/news/new" },
    { label: "Modifier le menu", href: "/admin/menu" },
  ];

  return (
    <div>
      <p className="a-kicker">Tableau de bord</p>
      <div className="flex flex-wrap items-end justify-between gap-8">
        <h1 className="a-title !text-[clamp(2.4rem,4vw,3.75rem)]">
          Le contenu du site,
          <br />
          <em>en un coup d&apos;œil.</em>
        </h1>
        <div className="flex flex-wrap gap-2">
          {actions.map((a, i) => (
            <Link key={a.href} href={a.href} className={`a-btn ${i === 0 ? "a-btn-primary" : "a-btn-ghost"}`}>
              {a.label}
              <Icon name="arrow" size={15} />
            </Link>
          ))}
        </div>
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
