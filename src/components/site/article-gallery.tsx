"use client";
import { useRef, useState } from "react";
import { photoSrc } from "@/components/ui/photo";
import type { Locale } from "@/lib/i18n";

export default function ArticleGallery({ photos, title, locale }: { photos: string[]; title: string; locale: Locale }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const labels = locale === "ar" ? { gallery: "معرض الصور", close: "إغلاق", previous: "السابق", next: "التالي" } : locale === "en" ? { gallery: "Photo gallery", close: "Close", previous: "Previous", next: "Next" } : { gallery: "Galerie photo", close: "Fermer", previous: "Précédente", next: "Suivante" };
  function move(amount: number) { setActive(current => (current + amount + photos.length) % photos.length); }
  return <section aria-label={labels.gallery}>
    <h2 className="mb-5 text-2xl">{labels.gallery}</h2>
    <div className="grid gap-4 sm:grid-cols-2">{photos.map((src, i) => <button key={i} type="button" className="gallery-thumbnail" onClick={() => { setActive(i); dialog.current?.showModal(); }} aria-label={labels.gallery + " · " + (i + 1)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photoSrc(src)} alt={title + " · " + (i + 1)} loading="lazy" className="aspect-[4/3] w-full object-cover" />
    </button>)}</div>
    <dialog ref={dialog} className="article-lightbox" onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }} onKeyDown={e => { if (e.key === "ArrowRight") move(1); if (e.key === "ArrowLeft") move(-1); }} aria-label={labels.gallery}>
      <button type="button" className="lightbox-close" onClick={() => dialog.current?.close()}>{labels.close} ×</button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photoSrc(photos[active])} alt={title + " · " + (active + 1)} />
      <div className="lightbox-controls"><button type="button" onClick={() => move(-1)}>{labels.previous}</button><span aria-live="polite">{active + 1} / {photos.length}</span><button type="button" onClick={() => move(1)}>{labels.next}</button></div>
    </dialog>
  </section>;
}
