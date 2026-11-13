import Link from "next/link";
import { SectionLabel, Icon } from "@/components/ui/chrome";
import { Rich } from "@/lib/rich";
import { services, localHref, campusText } from "@/lib/university";
import { localizedText } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export interface ResourceData {
  eyebrow?: string;
  title?: string;
  intro?: string;
  image?: string;
  items?: { title: string; body?: string; href?: string; tag?: string }[];
}

export default function CampusResources({ data, n, locale, digital = false }: { data: ResourceData; n: string; locale: Locale; digital?: boolean }) {
  const items = digital ? services().map((s) => ({ id: s.id, title: localizedText(s, "title", locale), body: localizedText(s, "summary", locale), href: s.url, tag: s.category })) : (data.items || []).map((s, i) => ({ ...s, id: String(i) }));
  return (
    <section className={`campus-section ${digital ? "campus-section--services" : ""}`}>
      <div className="wrap">
        <SectionLabel n={n}>{data.eyebrow}</SectionLabel>
        <div className="campus-heading"><h2><Rich text={data.title || ""} /></h2>{data.intro && <p>{data.intro}</p>}</div>
        {data.image && <div className="campus-panorama">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={data.image} alt={data.title || ""} loading="lazy" /></div>}
        <div className={`campus-resource-grid ${digital ? "campus-resource-grid--digital" : ""}`}>
          {items.map((item, index) => {
            const href = localHref(item.href, locale);
            const external = href?.startsWith("http");
            const content = <><div className="resource-top"><span>{String(index + 1).padStart(2, "0")}</span><small>{item.tag}</small>{href && <Icon name="arrow" size={21} />}</div><h3>{item.title}</h3><p>{item.body}</p><span className="resource-bottom">{href ? campusText(locale, external ? "Accéder à la plateforme" : "Découvrir", "اكتشف المزيد", external ? "Open platform" : "Explore") : campusText(locale, digital ? "Lien à venir" : "Informations à venir", "المعلومات قريباً", digital ? "Link coming soon" : "Information coming soon")}{href && <span aria-hidden="true">↗</span>}</span></>;
            return href ? <Link id={digital ? item.id : undefined} key={item.id} className="campus-resource" href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{content}</Link> : <article id={digital ? item.id : undefined} key={item.id} className="campus-resource campus-resource--pending">{content}</article>;
          })}
        </div>
      </div>
    </section>
  );
}
