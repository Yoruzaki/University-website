import Link from "next/link";
import { SectionLabel, ArrowLink } from "@/components/ui/chrome";
import { upcomingEvents, eventDate, campusText } from "@/lib/university";
import { localizedText } from "@/lib/content";
import { Rich } from "@/lib/rich";
import type { Locale } from "@/lib/i18n";
import type { UniversityEvent } from "@/lib/db/types";

export interface EventsData { eyebrow?: string; title?: string; intro?: string; count?: number }
export function EventRows({ items, locale }: { items: UniversityEvent[]; locale: Locale }) {
  return <div className="campus-events">{items.map((item) => <Link className="campus-event" key={item.id} href={`/${locale}/evenements/${item.slug}`}>
    <time className="event-date" dateTime={item.startsAt}><strong>{eventDate(item.startsAt, locale, { day: "2-digit" })}</strong><span>{eventDate(item.startsAt, locale, { month: "short" })}</span><small>{eventDate(item.startsAt, locale, { year: "numeric" })}</small></time>
    <div><span className="campus-kicker">{item.category}{item.featured && ` · ${campusText(locale, "À ne pas manquer", "لا تفوت", "Featured")}`}</span><h3>{localizedText(item, "title", locale)}</h3><p>{localizedText(item, "summary", locale)}</p><small>{item.location} · {new Date(item.startsAt).toLocaleTimeString(locale === "ar" ? "ar-DZ" : locale, { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Algiers" })}</small></div><span aria-hidden="true">↗</span>
  </Link>)}</div>;
}
export default function EventsList({ data, n, locale }: { data: EventsData; n: string; locale: Locale }) {
  const items = upcomingEvents(data.count || 3);
  return <section className="campus-section campus-agenda"><div className="wrap"><SectionLabel n={n}>{data.eyebrow || campusText(locale, "L'agenda", "المواعيد", "What's on")}</SectionLabel><div className="campus-heading"><h2><Rich text={data.title || campusText(locale, "Les prochains *rendez-vous.*", "المواعيد القادمة", "Upcoming *events.*")} /></h2><ArrowLink href={`/${locale}/evenements`}>{campusText(locale, "Tout l’agenda", "كل المواعيد", "All events")}</ArrowLink></div>{data.intro && <p className="campus-lead">{data.intro}</p>}{items.length ? <EventRows items={items} locale={locale} /> : <div className="campus-empty"><span className="campus-kicker">{campusText(locale, "Conférences · Rencontres · Campus", "مؤتمرات · لقاءات · الحرم الجامعي", "Conferences · Meetups · Campus")}</span><h3>{campusText(locale, "Le prochain rendez-vous se prépare.", "الموعد القادم قيد التحضير", "The next event is taking shape.")}</h3><p>{campusText(locale, "Les dates et les informations pratiques seront publiées ici dès leur confirmation.", "ستُنشر المواعيد والمعلومات هنا بعد تأكيدها", "Dates and practical information will appear here once confirmed.")}</p><Link href={`/${locale}/actualites`}>{campusText(locale, "En attendant, découvrez nos actualités →", "اكتشف أخبارنا ←", "Explore the latest news →")}</Link></div>}</div></section>;
}
