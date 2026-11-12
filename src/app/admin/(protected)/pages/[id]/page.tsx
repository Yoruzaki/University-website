import { notFound } from "next/navigation";
import Link from "next/link";
import { getPageById } from "@/lib/content";
import { sectionLibrary } from "@/components/sections/registry";
import SectionEditorCard from "@/components/admin/section-editor-card";
import {
  updatePageMetaAction,
  togglePageStatusAction,
  deletePageAction,
  addSectionFormAction,
} from "@/lib/actions";

export default async function PageEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await getPageById(id);
  if (!page) notFound();

  const updateMeta = updatePageMetaAction.bind(null, page.id);
  const addSection = addSectionFormAction.bind(null, page.id);
  const togglePublish = togglePageStatusAction.bind(
    null,
    page.id,
    page.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
  );
  const remove = deletePageAction.bind(null, page.id);
  const sections = [...page.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-4xl">
      <Link href="/admin/pages" className="a-link mb-8">← Toutes les pages</Link>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="a-kicker">
            Page /{page.slug}
            <span className={`a-badge ms-2 ${page.status === "PUBLISHED" ? "a-badge-live" : "a-badge-draft"}`}>
              {page.status === "PUBLISHED" ? "Publiée" : "Brouillon"}
            </span>
          </p>
          <h1 className="a-title">{page.titleFr}</h1>
        </div>
        <div className="flex items-center gap-4">
          <form action={togglePublish}>
            <button
              type="submit"
              className={`a-btn ${page.status === "PUBLISHED" ? "a-btn-ghost" : "a-btn-accent"}`}
            >
              {page.status === "PUBLISHED" ? "Repasser en brouillon" : "Publier"}
            </button>
          </form>
          {page.status === "PUBLISHED" && (
            <a
              href={`/fr${page.slug ? `/${page.slug}` : ""}`}
              target="_blank"
              className="a-link"
            >
              Voir la page ↗
            </a>
          )}
        </div>
      </div>

      <details className="mb-10 a-card p-6">
        <summary className="cursor-pointer text-sm font-medium">Réglages de la page</summary>
        <form action={updateMeta} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="a-label">Titre</label>
            <input name="titleFr" defaultValue={page.titleFr} className="a-input mt-2" />
          </div>
          <div>
            <label className="a-label">Adresse (slug)</label>
            <input name="slug" defaultValue={page.slug} className="a-input mt-2" />
          </div>
          <div className="sm:col-span-2">
            <label className="a-label">Photo de la bannière (adresse d&apos;une image, ex. /photos/sortie-lac.jpg)</label>
            <input name="bannerImage" defaultValue={page.bannerImage ?? ""} className="a-input mt-2" placeholder="/photos/…" />
          </div>
          <div className="sm:col-span-2">
            <label className="a-label">Description (SEO)</label>
            <textarea name="seoDescFr" defaultValue={page.seoDescFr ?? ""} rows={2} className="a-input mt-2" />
          </div>
          <div className="sm:col-span-2 flex items-center justify-between">
            <button type="submit" className="a-btn a-btn-primary">
              Enregistrer
            </button>
            {/* formAction lets this button run the delete action without nesting a second <form> */}
            <button type="submit" formAction={remove} formNoValidate className="a-btn-danger">
              Supprimer la page
            </button>
          </div>
        </form>
      </details>

      <h2 className="a-kicker">Sections</h2>
      <div className="space-y-3">
        {sections.map((section, i) => (
          <SectionEditorCard key={section.id} pageId={page.id} section={section} position={i} total={sections.length} />
        ))}
      </div>

      <form action={addSection} className="mt-8 flex flex-wrap items-end gap-3 a-card-dashed p-6">
        <div>
          <label className="a-label">Ajouter une section</label>
          <select name="type" className="a-input mt-2 w-64">
            {sectionLibrary.map((s) => (
              <option key={s.type} value={s.type}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="a-label">Fond</label>
          <select name="variant" className="a-input mt-2 w-32">
            <option value="LIGHT">Clair</option>
            <option value="DARK">Sombre</option>
          </select>
        </div>
        <button type="submit" className="a-btn a-btn-primary">
          + Ajouter
        </button>
      </form>
    </div>
  );
}
