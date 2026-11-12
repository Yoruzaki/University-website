import { getAllFaculty } from "@/lib/content";
import { saveFacultyAction, deleteFacultyAction } from "@/lib/actions";

export default async function FacultyAdmin() {
  const faculty = await getAllFaculty();

  return (
    <div>
      <h1 className="a-title">Enseignants</h1>

      <details className="mt-8 a-card p-6">
        <summary className="cursor-pointer text-sm font-medium">+ Ajouter un enseignant</summary>
        <form action={saveFacultyAction} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="a-label">Nom</label>
            <input name="nameFr" required className="a-input mt-2" />
          </div>
          <div>
            <label className="a-label">Fonction</label>
            <input name="titleFr" placeholder="Professeur, Écologie forestière" className="a-input mt-2" />
          </div>
          <div>
            <label className="a-label">Courriel</label>
            <input name="email" type="email" className="a-input mt-2" />
          </div>
          <button type="submit" className="a-btn a-btn-primary sm:col-span-2">
            Enregistrer
          </button>
        </form>
      </details>

      <table className="a-table mt-8">
        <thead>
          <tr className="border-b border-ink-text/10 text-xs uppercase tracking-wide text-ink-text-muted">
            <th className="py-3">Nom</th>
            <th className="py-3">Fonction</th>
            <th className="py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-text/10">
          {faculty.map((f) => (
            <tr key={f.id}>
              <td className="py-3 font-medium">{f.nameFr}</td>
              <td className="py-3 text-ink-text-muted">{f.titleFr}</td>
              <td className="py-3 text-right">
                <form action={deleteFacultyAction.bind(null, f.id)}>
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
