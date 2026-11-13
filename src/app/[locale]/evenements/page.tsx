import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/i18n";
import { events, campusText } from "@/lib/university";
import PageBanner from "@/components/site/page-banner";
import { EventRows } from "@/components/sections/events-list";

export default async function EventsIndex({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ periode?: string; categorie?: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const query = await searchParams;
  const archived = query.periode === "archives";
  const all = events();
  const items = all.filter((e) => (+new Date(e.endsAt || e.startsAt) < Date.now()) === archived && (!query.categorie || e.category === query.categorie));
  if (archived) items.reverse();
  return <><PageBanner title={campusText(locale, "L’agenda de l’école", "مواعيد المدرسة", "What's on at ENSF")} locale={locale} image="/photos/conference-amphi.jpg" /><section className="campus-section"><div className="wrap"><div className="campus-tabs"><Link aria-current={!archived ? "page" : undefined} href={`/${locale}/evenements`}>{campusText(locale, "À venir", "قريباً", "Upcoming")}</Link><Link aria-current={archived ? "page" : undefined} href={`/${locale}/evenements?periode=archives`}>{campusText(locale, "Événements passés", "الأرشيف", "Past events")}</Link></div><form className="campus-filter"><input type="hidden" name="periode" value={archived ? "archives" : "avenir"} /><label>{campusText(locale, "Catégorie", "الفئة", "Category")}<select name="categorie" defaultValue={query.categorie || ""}><option value="">{campusText(locale, "Toutes", "الكل", "All")}</option>{[...new Set(all.map((e) => e.category).filter(Boolean))].map((c) => <option key={c}>{c}</option>)}</select></label><button className="btn btn--dark">{campusText(locale, "Filtrer", "تصفية", "Filter")}</button></form>{items.length ? <EventRows items={items} locale={locale} /> : <div className="campus-empty"><h2>{campusText(locale, "Aucun événement pour le moment.", "لا توجد فعاليات حالياً", "No events at the moment.")}</h2><p>{campusText(locale, "Retrouvez ici les rencontres, conférences et temps forts de l’école dès leur publication.", "ستجد هنا اللقاءات والمؤتمرات بمجرد نشرها", "Meetups, conferences and campus highlights will appear here once published.")}</p></div>}</div></section></>;
}
