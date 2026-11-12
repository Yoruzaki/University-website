import { getAllMenuItemsFlat } from "@/lib/content";
import { saveMenuItemAction, deleteMenuItemAction } from "@/lib/actions";

export default async function MenuAdmin() {
  const items = await getAllMenuItemsFlat();
  const topLevel = items.filter((m) => !m.parentId);

  return (
    <div>
      <h1 className="a-title">Navigation</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-text-muted">
        Les liens apparaissent dans le menu principal du site, dans l&apos;ordre indiqué.
      </p>

      <details className="mt-8 a-card p-6">
        <summary className="cursor-pointer text-sm font-medium">+ Ajouter un lien</summary>
        <form action={saveMenuItemAction} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="a-label">Libellé</label>
            <input name="labelFr" required className="a-input mt-2" />
          </div>
          <div>
            <label className="a-label">Lien (sans la langue, ex. /recherche)</label>
            <input name="href" required defaultValue="/" className="a-input mt-2" />
          </div>
          <div>
            <label className="a-label">Ordre</label>
            <input name="order" type="number" defaultValue={items.length} className="a-input mt-2" />
          </div>
          <div>
            <label className="a-label">Sous-menu de (optionnel)</label>
            <select name="parentId" className="a-input mt-2">
              <option value="">— Niveau principal —</option>
              {topLevel.map((m) => <option key={m.id} value={m.id}>{m.labelFr}</option>)}
            </select>
          </div>
          <button type="submit" className="a-btn a-btn-primary sm:col-span-2">
            Enregistrer
          </button>
        </form>
      </details>

      <table className="a-table mt-8">
        <thead>
          <tr className="border-b border-ink-text/10 text-xs uppercase tracking-wide text-ink-text-muted">
            <th className="py-3">Libellé</th>
            <th className="py-3">Lien</th>
            <th className="py-3">Ordre</th>
            <th className="py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-text/10">
          {items.sort((a, b) => a.order - b.order).map((m) => (
            <tr key={m.id}>
              <td className="py-3 font-medium">{m.parentId ? `— ${m.labelFr}` : m.labelFr}</td>
              <td className="py-3 text-ink-text-muted">{m.href}</td>
              <td className="py-3 text-ink-text-muted">{m.order}</td>
              <td className="py-3 text-right">
                <form action={deleteMenuItemAction.bind(null, m.id)}>
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
