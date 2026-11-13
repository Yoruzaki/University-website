import Link from "next/link";
import { services } from "@/lib/university";
import { saveServiceAction, removeUniversityItemAction } from "@/lib/university-actions";

export default async function ServicesAdmin({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string }> }) {
  const query = await searchParams;
  const items = services(true);
  const item = items.find((s) => s.id === query.edit);
  return <div><p className="a-kicker">Plateformes & ressources</p><h1 className="a-title">Services <em>numériques.</em></h1><p className="mt-5 max-w-2xl text-sm text-ink-text-muted">E-learning, bibliothèque, DSpace, EDX, recherche… Ces cartes apparaissent sur l’accueil et la page Services. Laissez une adresse vide tant que la plateforme n’est pas disponible.</p>{query.saved && <p role="status" className="admin-success">Service enregistré.</p>}
    <div className="admin-resource-list mt-8">{items.map((s) => <div key={s.id}><div><strong>{s.titleFr}</strong><p>{s.category} · {s.enabled ? s.url ? "Lien configuré" : "Lien à venir" : "Masqué"}</p></div><Link className="a-link" href={`/admin/services?edit=${s.id}#service-form`}>Modifier ↗</Link><form action={removeUniversityItemAction.bind(null, "services", s.id)}><button className="a-btn-danger">Supprimer</button></form></div>)}</div>
    <form key={item?.id || "new"} id="service-form" action={saveServiceAction} className="a-card p-6 mt-10 max-w-3xl space-y-5"><h2 className="text-2xl font-semibold">{item ? `Modifier ${item.titleFr}` : "Ajouter une plateforme"}</h2>{item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid sm:grid-cols-2 gap-5">{([['titleFr', 'Nom français'], ['titleAr', 'Nom arabe'], ['titleEn', 'Nom anglais'], ['category', 'Catégorie']] as const).map(([key, label]) => <label key={key} className="a-label">{label}<input name={key} defaultValue={item?.[key]} required={key === "titleFr"} className="a-input mt-2" /></label>)}</div>
      {([['summaryFr', 'Description française'], ['summaryAr', 'Description arabe'], ['summaryEn', 'Description anglaise']] as const).map(([key, label]) => <label key={key} className="a-label block">{label}<textarea name={key} defaultValue={item?.[key]} rows={2} className="a-input mt-2" /></label>)}
      <label className="a-label block">Adresse de la plateforme<input name="url" type="url" placeholder="https://…" defaultValue={item?.url} className="a-input mt-2" /></label><label className="a-label block">Ordre<input name="order" type="number" defaultValue={item?.order ?? items.length} className="a-input mt-2" /></label><label className="flex gap-3 items-center"><input type="checkbox" name="enabled" defaultChecked={item?.enabled ?? true} /> Afficher sur le site</label><div className="flex gap-4"><button className="a-btn a-btn-primary">Enregistrer le service</button>{item && <Link className="a-btn a-btn-ghost" href="/admin/services">Annuler</Link>}</div>
    </form></div>;
}
