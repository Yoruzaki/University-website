import type { NewsItem } from "@/lib/db/types";
import { saveNewsAction } from "@/lib/actions";

export default function NewsForm({ item }: { item?: NewsItem }) {
  return (
    <form action={saveNewsAction} className="max-w-2xl space-y-5">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="a-label">Titre</label>
          <input name="titleFr" defaultValue={item?.titleFr} required className="a-input mt-2" />
        </div>
        <div>
          <label className="a-label">Adresse (slug)</label>
          <input name="slug" defaultValue={item?.slug} required className="a-input mt-2" />
        </div>
        <div>
          <label className="a-label">Catégorie</label>
          <input name="category" defaultValue={item?.category} className="a-input mt-2" placeholder="Recherche" />
        </div>
        <div>
          <label className="a-label">Statut</label>
          <select name="status" defaultValue={item?.status ?? "DRAFT"} className="a-input mt-2">
            <option value="DRAFT">Brouillon</option>
            <option value="PUBLISHED">Publié</option>
          </select>
        </div>
      </div>
      <div>
        <label className="a-label">Photo de couverture — adresse d&apos;une image (https://… ou /images/…) ou description</label>
        <input name="coverImage" defaultValue={item?.coverImage} className="a-input mt-2" />
      </div>
      <div>
        <label className="a-label">Extrait</label>
        <textarea name="excerptFr" defaultValue={item?.excerptFr} rows={2} className="a-input mt-2" />
      </div>
      <div>
        <label className="a-label">Texte complet (paragraphes séparés par une ligne vide)</label>
        <textarea name="bodyFr" defaultValue={item?.bodyFr} rows={8} className="a-input mt-2" />
      </div>
      <button type="submit" className="a-btn a-btn-primary">
        Enregistrer
      </button>
    </form>
  );
}
