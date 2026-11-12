import { createPageAction } from "@/lib/actions";

export default function NewPage() {
  return (
    <div className="max-w-lg">
      <h1 className="a-title">Nouvelle page</h1>
      <form action={createPageAction} className="mt-8 space-y-5">
        <div>
          <label className="a-label" htmlFor="titleFr">Titre</label>
          <input
            id="titleFr"
            name="titleFr"
            required
            className="a-input mt-2"
            placeholder="À propos de l'école"
          />
        </div>
        <div>
          <label className="a-label" htmlFor="slug">
            Adresse (laisser vide pour la page d&apos;accueil)
          </label>
          <input
            id="slug"
            name="slug"
            className="a-input mt-2"
            placeholder="a-propos"
          />
        </div>
        <button type="submit" className="a-btn a-btn-primary">
          Créer la page
        </button>
      </form>
    </div>
  );
}
