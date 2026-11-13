import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/i18n";
import { events, eventDate, campusText, localHref } from "@/lib/university";
import { localizedText } from "@/lib/content";
import PageBanner from "@/components/site/page-banner";

export default async function EventDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  const item = events().find((e) => e.slug === slug);
  if (!item) notFound();
  const registration = localHref(item.registrationUrl, locale);
  const past = +new Date(item.endsAt || item.startsAt) < Date.now();
  return <><PageBanner title={localizedText(item, "title", locale)} locale={locale} image={item.coverImage || "/photos/conference-amphi.jpg"} /><section className="campus-section"><div className="wrap event-detail"><div><p className="campus-kicker">{item.category}</p><p className="campus-lead">{localizedText(item, "summary", locale)}</p>{(locale === "fr" ? item.bodyFr || "" : localizedText(item, "summary", locale)).split(/\n{2,}/).filter(Boolean).map((p, i) => <p key={i} className="event-paragraph">{p}</p>)}<Link className="a-link" href={`/${locale}/evenements`}>{campusText(locale, "← Retour à l’agenda", "العودة للمواعيد", "← Back to events")}</Link></div><aside><span className="campus-kicker">{campusText(locale, "Informations pratiques", "معلومات عملية", "Practical information")}</span><h2><time dateTime={item.startsAt}>{eventDate(item.startsAt, locale)}</time></h2><p>{new Date(item.startsAt).toLocaleTimeString(locale === "ar" ? "ar-DZ" : locale, { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Algiers" })} · {campusText(locale, "Heure d’Algérie", "توقيت الجزائر", "Algeria time")}</p>{item.endsAt && <p>{campusText(locale, "Fin :", "النهاية:", "Ends:")} {eventDate(item.endsAt, locale)} · {new Date(item.endsAt).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Algiers" })}</p>}<p>{item.location}</p>{past ? <p>{campusText(locale, "Cet événement est terminé.", "انتهت هذه الفعالية", "This event has ended.")}</p> : registration && <a className="btn btn--dark" href={registration} target="_blank" rel="noopener noreferrer">{campusText(locale, "S’inscrire ↗", "التسجيل ↗", "Register ↗")}</a>}</aside></div></section></>;
}
