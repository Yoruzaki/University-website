import { getAllPrograms } from "@/lib/content";
import { saveProgramAction, deleteProgramAction } from "@/lib/actions";

const CYCLES = ["LICENCE", "INGENIEUR", "MASTER", "DOCTORAT"] as const;
const CYCLE_LABELS: Record<string, string> = {
  LICENCE: "Licence",
  INGENIEUR: "Ingénieur",
  MASTER: "Master",
  DOCTORAT: "Doctorat",
};

export default async function ProgramsAdmin() {
  const programs = await getAllPrograms();

  return (
    <div>
      <h1 className="a-title">Programmes</h1>

      <details className="mt-8 a-card p-6">
        <summary className="cursor-pointer text-sm font-medium">+ Ajouter un programme</summary>
        <form action={saveProgramAction} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="a-label">Titre</label>
            <input name="titleFr" required className="a-input mt-2" />
          </div>
          <div>
            <label className="a-label">Adresse (slug)</label>
            <input name="slug" required className="a-input mt-2" />
          </div>
          <div>
            <label className="a-label">Cycle</label>
            <select name="cycle" className="a-input mt-2">
              {CYCLES.map((c) => <option key={c} value={c}>{CYCLE_LABELS[c]}</option>)}
            </select>
          </div>
          <div>
            <label className="a-label">Durée</label>
            <input name="durationFr" placeholder="3 ans" className="a-input mt-2" />
          </div>
          <div className="sm:col-span-2">
            <label className="a-label">Résumé</label>
            <textarea name="summaryFr" rows={2} className="a-input mt-2" />
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
            <th className="py-3">Cycle</th>
            <th className="py-3">Durée</th>
            <th className="py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-text/10">
          {programs.map((p) => (
            <tr key={p.id}>
              <td className="py-3 font-medium">{p.titleFr}</td>
              <td className="py-3 text-ink-text-muted">{CYCLE_LABELS[p.cycle]}</td>
              <td className="py-3 text-ink-text-muted">{p.durationFr}</td>
              <td className="py-3 text-right">
                <form action={deleteProgramAction.bind(null, p.id)}>
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
