import Link from "next/link";
import { connection } from "next/server";
import { publicBulletins } from "@/lib/bulletins";
import { campusText, eventDate, localHref } from "@/lib/university";
import { localizedText } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import type { Bulletin } from "@/lib/db/types";
import { Rich } from "@/lib/rich";
import { SectionLabel, ArrowLink } from "@/components/ui/chrome";

export interface BulletinData { title?:string; eyebrow?:string; intro?:string; count?:number }
export default async function BulletinBoard({kind,locale,data={},n="",archive=false,full=false}:{kind:Bulletin["kind"];locale:Locale;data?:BulletinData;n?:string;archive?:boolean;full?:boolean}) {
  await connection();
  const announcements=kind==="annonces";
  const all=publicBulletins(kind,archive);
  const items=full?all:all.slice(0,Math.max(1,Math.min(data.count||3,12)));
  const title=announcements?campusText(locale,"Annonces importantes","إعلانات مهمة","Important notices"):campusText(locale,"Opportunités","فرص","Opportunities");
  return <section id={kind} className={`campus-section bulletin-section ${announcements?"bulletin-section--notices":""}`}><div className="wrap"><SectionLabel n={n}>{data.eyebrow||title}</SectionLabel><div className="campus-heading"><h2><Rich text={data.title||title}/></h2>{!full&&<ArrowLink href={`/${locale}/${kind}`}>{campusText(locale,"Tout consulter","عرض الكل","View all")}</ArrowLink>}</div>{data.intro&&<p className="campus-lead">{data.intro}</p>}{items.length?<div className="bulletin-grid">{items.map(item=>{const href=localHref(item.url,locale);return <article key={item.id} className="bulletin-card"><div className="bulletin-meta"><span className="campus-kicker">{item.category||title}</span>{item.featured&&<span className="bulletin-priority">{campusText(locale,"À retenir","مهم","Featured")}</span>}</div><h3>{localizedText(item,"title",locale)}</h3>{item.audience&&<span className="bulletin-audience">{item.audience}</span>}<p>{localizedText(item,"summary",locale)}</p><div className="bulletin-footer"><time dateTime={item.deadline||item.publishedAt}>{item.deadline?campusText(locale,archive?"Clôturé le ":"Date limite : ","الموعد النهائي: ",archive?"Closed ":"Deadline: "):campusText(locale,"Publié le ","نُشر في ","Published ")}{eventDate(item.deadline||item.publishedAt,locale)}</time>{href&&<Link href={href} {...(href.startsWith("http")?{target:"_blank",rel:"noopener noreferrer"}:{})}>{campusText(locale,"En savoir plus ↗","المزيد ↗","Learn more ↗")}</Link>}</div></article>})}</div>:<div className="campus-empty"><h3>{announcements?campusText(locale,"Aucune annonce en cours.","لا توجد إعلانات حالياً","No current notices."):campusText(locale,"Les prochaines opportunités arrivent ici.","ستُنشر الفرص القادمة هنا","New opportunities will appear here.")}</h3><p>{announcements?campusText(locale,"Inscriptions, examens et informations pratiques : retrouvez ici les prochains avis de l’école.","التسجيل والامتحانات والمعلومات العملية","Registration, exams and practical school notices will appear here."):campusText(locale,"Bourses, stages, concours et appels à candidatures : consultez cet espace pour les prochaines ouvertures.","منح وتربصات ومسابقات ودعوات للترشح","Scholarships, internships, competitions and calls for applications.")}</p></div>}</div></section>;
}
