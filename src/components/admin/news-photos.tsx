"use client";

import { useState } from "react";
import { photoSrc } from "@/components/ui/photo";

export default function NewsPhotos({ initial, onBusy, onPhotos }: { initial: string[]; onBusy: (value: boolean) => void; onPhotos: (photos: string[]) => void }) {
  const [photos, setPhotos] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function upload(files: File[]) {
    setMessage("");
    if (files.length + photos.length > 5) {
      setMessage("Vous pouvez sélectionner cinq photos au total.");
      return;
    }
    setBusy(true);
    onBusy(true);
    let uploaded = [...photos];
    try {
      for (const file of files) {
        if (file.size > 8 * 1024 * 1024) throw Error(file.name + " dépasse 8 Mo.");
        const res = await fetch("/api/news-photos", { method: "POST", body: file });
        if (!res.ok) throw Error("Échec de l’ajout de " + file.name + ". Vérifiez le format et réessayez.");
        const { url } = await res.json();
        uploaded = [...uploaded, url];
        setPhotos(uploaded);
        onPhotos(uploaded);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Échec du transfert.");
    } finally {
      setBusy(false);
      onBusy(false);
    }
  }
  return <section className="a-card space-y-4 p-5">
    <h2 className="text-xl font-semibold">Photos de la publication <small>({photos.length}/5)</small></h2>
    <p>La couverture apparaît sur l’accueil et en tête de l’article. Les autres photos composent la galerie.</p>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{photos.map((src, i) =>
      <div key={src + i} className="space-y-2">
        <input type="hidden" name="photos" value={src} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="aspect-[4/3] w-full rounded object-cover" src={photoSrc(src)} alt={"Photo " + (i + 1)} />
        {i === 0 ? <strong>Couverture</strong> : <button type="button" disabled={busy} className="a-link" onClick={() => { const next = [src, ...photos.filter((_, n) => n !== i)]; setPhotos(next); onPhotos(next); }}>Mettre en couverture</button>}
        <button type="button" disabled={busy} className="block text-sm underline" onClick={() => { const next = photos.filter((_, n) => n !== i); setPhotos(next); onPhotos(next); }}>Retirer</button>
      </div>)}</div>
    <label className="block">Ajouter des photos · JPG, PNG, WebP · 8 Mo maximum par photo
      <input type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={busy || photos.length >= 5} className="a-input mt-2" onChange={e => { const files = Array.from(e.target.files ?? []); e.target.value = ""; void upload(files); }} />
    </label>
    <p role="status">{busy ? "Transfert en cours…" : message}</p>
  </section>;
}
