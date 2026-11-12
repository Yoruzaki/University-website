import Link from "next/link";
import { getAllNews } from "@/lib/content";
import { deleteNewsAction as deleteAction } from "@/lib/actions";

export default async function NewsListAdmin() {
  const items = await getAllNews();
  return (
    <div>
      <p className="a-kicker">Contenu</p>
      <div className="flex items-end justify-between gap-6">
        <h1 className="a-title">
          Actualités <em>de l&apos;école.</em>
        </h1>
        <Link href="/admin/news/new" className="a-btn a-btn-primary">
          + Nouvel article
        </Link>
      </div>
      <table className="a-table mt-8">
        <thead>
          <tr className="border-b border-ink-text/10 text-xs uppercase tracking-wide text-ink-text-muted">
            <th className="py-3">Titre</th>
            <th className="py-3">Catégorie</th>
            <th className="py-3">Statut</th>
            <th className="py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-text/10">
          {items.map((n) => (
            <tr key={n.id}>
              <td className="py-3 font-medium">{n.titleFr}</td>
              <td className="py-3 text-ink-text-muted">{n.category}</td>
              <td className="py-3">
                <span className={`a-badge ${n.status === "PUBLISHED" ? "a-badge-live" : "a-badge-draft"}`}>
                  {n.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                </span>
              </td>
              <td className="py-3 text-right">
                <Link href={`/admin/news/${n.id}`} className="a-link me-4">Modifier</Link>
                <form action={deleteAction.bind(null, n.id)} className="inline">
                  <button type="submit" className="a-btn-danger">Supprimer</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
