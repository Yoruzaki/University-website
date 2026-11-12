import Link from "next/link";
import { getAllPages } from "@/lib/content";

export default async function PagesList() {
  const pages = await getAllPages();

  return (
    <div>
      <p className="a-kicker">Contenu</p>
      <div className="flex items-end justify-between gap-6">
        <h1 className="a-title">
          Pages <em>du site.</em>
        </h1>
        <Link href="/admin/pages/new" className="a-btn a-btn-primary">
          + Nouvelle page
        </Link>
      </div>

      <table className="a-table mt-8">
        <thead>
          <tr className="border-b border-ink-text/10 text-xs uppercase tracking-wide text-ink-text-muted">
            <th className="py-3">Titre</th>
            <th className="py-3">URL</th>
            <th className="py-3">Statut</th>
            <th className="py-3">Sections</th>
            <th className="py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-text/10">
          {pages.map((p) => (
            <tr key={p.id}>
              <td className="py-3 font-medium">{p.titleFr}</td>
              <td className="py-3 text-ink-text-muted">/{p.slug}</td>
              <td className="py-3">
                <span className={`a-badge ${p.status === "PUBLISHED" ? "a-badge-live" : "a-badge-draft"}`}>
                  {p.status === "PUBLISHED" ? "Publiée" : "Brouillon"}
                </span>
              </td>
              <td className="py-3 text-ink-text-muted">{p.sections.length}</td>
              <td className="py-3 text-right">
                <Link href={`/admin/pages/${p.id}`} className="a-link">
                  Modifier →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pages.length === 0 && <p className="mt-8 text-ink-text-muted">Aucune page pour le moment.</p>}
    </div>
  );
}
