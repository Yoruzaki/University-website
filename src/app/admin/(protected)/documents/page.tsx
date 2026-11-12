import { getAllDocuments } from "@/lib/content";
import { saveDocumentAction, deleteDocumentAction } from "@/lib/actions";

export default async function DocumentsAdmin() {
  const docs = await getAllDocuments();

  return (
    <div>
      <h1 className="a-title">Documents</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-text-muted">
        Déposez vos fichiers dans le dossier <code>public/documents</code> du projet, puis indiquez
        ici leur adresse (par exemple <code>/documents/reglement.pdf</code>).
      </p>

      <details className="mt-8 a-card p-6">
        <summary className="cursor-pointer text-sm font-medium">+ Ajouter un document</summary>
        <form action={saveDocumentAction} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="a-label">Titre</label>
            <input name="titleFr" required className="a-input mt-2" />
          </div>
          <div>
            <label className="a-label">Catégorie</label>
            <input name="category" placeholder="Admissions" className="a-input mt-2" />
          </div>
          <div className="sm:col-span-2">
            <label className="a-label">Adresse du fichier</label>
            <input name="fileUrl" required placeholder="/documents/reglement.pdf" className="a-input mt-2" />
          </div>
          <button type="submit" className="a-btn a-btn-primary sm:col-span-2">
            Enregistrer
          </button>
        </form>
      </details>

      <table className="a-table mt-8">
        <thead>
          <tr className="border-b border-ink-text/10 text-xs uppercase tracking-wide text-ink-text-muted">
            <th className="py-3">Titre</th>
            <th className="py-3">Catégorie</th>
            <th className="py-3">Fichier</th>
            <th className="py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-text/10">
          {docs.map((d) => (
            <tr key={d.id}>
              <td className="py-3 font-medium">{d.titleFr}</td>
              <td className="py-3 text-ink-text-muted">{d.category}</td>
              <td className="py-3 text-ink-text-muted">{d.fileUrl}</td>
              <td className="py-3 text-right">
                <form action={deleteDocumentAction.bind(null, d.id)}>
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
