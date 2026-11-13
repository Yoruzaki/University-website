"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import type { NewsItem } from "@/lib/db/types";
import NewsPhotos from "./news-photos";
import { saveNewsAction } from "@/lib/actions";
import { photoSrc } from "@/components/ui/photo";

function makeSlug(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
export default function NewsForm({ item }: { item?: NewsItem }) {
  const [state, action, pending] = useActionState(saveNewsAction, { message: "" });
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState(item?.titleFr ?? "");
  const [excerpt, setExcerpt] = useState(item?.excerptFr ?? "");
  const [body, setBody] = useState(item?.bodyFr ?? "");
  const [translations, setTranslations] = useState<Record<string, string>>({
    titleAr: item?.titleAr ?? "", titleEn: item?.titleEn ?? "",
    excerptAr: item?.excerptAr ?? "", excerptEn: item?.excerptEn ?? "",
    bodyAr: item?.bodyAr ?? "", bodyEn: item?.bodyEn ?? "",
  });
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [manualSlug, setManualSlug] = useState(!!item);
  const [layout, setLayout] = useState(item?.layout ?? "article");
  const initial = [item?.coverImage, ...(item?.gallery ?? [])].filter((src): src is string => !!src);
  const [photos, setPhotos] = useState(initial);
  const [status, setStatus] = useState(item?.status ?? "DRAFT");
  const [category, setCategory] = useState(item?.category ?? "");
  const [date, setDate] = useState((item?.publishedAt || new Date().toISOString()).slice(0, 10));
  const [featured, setFeatured] = useState(item?.featured ?? false);
  return <form action={action} className="publication-editor">
    {item && <input type="hidden" name="id" value={item.id} />}
    <div className="editor-fields">
      <section className="a-card space-y-5 p-6">
        <div><p className="a-kicker">Contenu</p><h2 className="text-2xl font-semibold">Racontez ce qui se passe à l’école</h2></div>
        <label className="a-label block">Titre en français
          <input name="titleFr" value={title} maxLength={200} required className="a-input mt-2" placeholder="Un titre clair pour vos lecteurs" onChange={e => { setTitle(e.target.value); if (!manualSlug) setSlug(makeSlug(e.target.value)); }} />
        </label>
        <label className="a-label block">Résumé
          <textarea name="excerptFr" value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} className="a-input mt-2" placeholder="L’essentiel en deux ou trois phrases." />
        </label>
        <label className="a-label block">Article
          <textarea name="bodyFr" value={body} onChange={e => setBody(e.target.value)} rows={12} className="a-input mt-2" placeholder="Écrivez votre article. Séparez les paragraphes par une ligne vide." />
        </label>
        <details><summary className="cursor-pointer font-semibold">Traductions en arabe et en anglais</summary>
          <p className="my-3 text-sm">Les champs vides utilisent le contenu français.</p>
          {(["Ar", "En"] as const).map(language => <div key={language} dir={language === "Ar" ? "rtl" : "ltr"} className="my-4 space-y-3 border-t pt-4">
            <label className="a-label block">{language === "Ar" ? "العنوان" : "Title"}<input name={"title" + language} value={translations["title" + language]} onChange={e => setTranslations(current => ({ ...current, ["title" + language]: e.target.value }))} className="a-input mt-2" /></label>
            <label className="a-label block">{language === "Ar" ? "ملخص" : "Summary"}<textarea name={"excerpt" + language} value={translations["excerpt" + language]} onChange={e => setTranslations(current => ({ ...current, ["excerpt" + language]: e.target.value }))} className="a-input mt-2" rows={2} /></label>
            <label className="a-label block">{language === "Ar" ? "المقال" : "Article"}<textarea name={"body" + language} value={translations["body" + language]} onChange={e => setTranslations(current => ({ ...current, ["body" + language]: e.target.value }))} className="a-input mt-2" rows={6} /></label>
          </div>)}
        </details>
      </section>
      <NewsPhotos initial={initial} onBusy={setUploading} onPhotos={setPhotos} />
      <section className="a-card space-y-4 p-6">
        <h2 className="text-xl font-semibold">Présentation</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[["article", "Article", "Le texte suivi de la galerie."], ["reportage", "Reportage photo", "Les photos suivies du récit."]].map(([value, label, note]) => <label key={value} className={"layout-choice " + (layout === value ? "is-selected" : "")}>
            <input type="radio" name="layout" value={value} checked={layout === value} onChange={() => setLayout(value as "article" | "reportage")} />
            <strong>{label}</strong><span>{note}</span>
          </label>)}
        </div>
      </section>
    </div>
    <aside className="editor-settings space-y-5">
      <section className="a-card space-y-4 p-5">
        <h2 className="text-xl font-semibold">Publication</h2>
        <label className="a-label block">Statut<select name="status" value={status} onChange={e => setStatus(e.target.value as "DRAFT" | "PUBLISHED")} className="a-input mt-2"><option value="DRAFT">Brouillon</option><option value="PUBLISHED">Publié</option></select></label>
        <p className="text-sm">{status === "DRAFT" ? "Visible uniquement dans l’administration." : "Visible sur le site dès l’enregistrement."}</p>
        <label className="a-label block">Date affichée<input type="date" name="publishedAt" required value={date} onChange={e => setDate(e.target.value)} className="a-input mt-2" /></label>
        <label className="a-label block">Catégorie<input name="category" value={category} onChange={e => setCategory(e.target.value)} className="a-input mt-2" placeholder="Campus, formation, recherche…" /></label>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="featured" checked={featured} onChange={e => setFeatured(e.target.checked)} />Mettre à la une sur l’accueil</label>
        <label className="a-label block">Adresse de l’article<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={slug} onChange={e => { setManualSlug(true); setSlug(e.target.value); }} className="a-input mt-2" /></label>
        {state.message && <p role="alert" className="editor-error">{state.message}</p>}
        <button disabled={pending || uploading} className="a-btn a-btn-primary w-full" type="submit">{uploading ? "Transfert des photos…" : pending ? "Enregistrement…" : status === "DRAFT" ? "Enregistrer le brouillon" : "Enregistrer et publier"}</button>
        <Link href="/admin/news" className="a-link">Retour aux actualités</Link>
      </section>
      <section className="a-card overflow-hidden" aria-label="Aperçu de la carte">
        <p className="px-5 py-3 text-xs uppercase tracking-wider">Aperçu de la carte · français</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {photos[0] && <img src={photoSrc(photos[0])} alt="" className="aspect-[16/10] w-full object-cover" />}
        <div className="space-y-3 p-5"><h3 className="break-words text-2xl font-semibold">{title || "Le titre de votre publication"}</h3><p className="break-words text-sm">{excerpt || "Votre résumé apparaîtra ici."}</p><span className="text-xs">{photos.length} / 5 photos</span></div>
      </section>
    </aside>
  </form>;
}
