import Link from "next/link";
import { photoSrc } from "@/components/ui/photo";
import { Rich } from "@/lib/rich";
import { t, type Locale } from "@/lib/i18n";

/** Full-bleed photo banner for inner pages, in the hero's visual language. */
export default function PageBanner({
  title,
  locale,
  seed,
  image,
  crumbs = [],
}: {
  title: string;
  locale: Locale;
  seed?: string;
  image?: string | null;
  crumbs?: { label: string; href?: string }[];
}) {
  const src = photoSrc(image ?? seed ?? title, { seed: seed ?? title, width: 2400 });
  return (
    <section className="page-banner">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hero-image" src={src} alt="" fetchPriority="high" />
      <div className="hero-shade" />
      <div className="page-banner-content">
        <nav aria-label="Fil d'Ariane">
          <ol className="crumbs">
            <li>
              <Link href={`/${locale}`}>{t(locale, "home")}</Link>
            </li>
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-3">
                <span aria-hidden="true">/</span>
                {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
              </li>
            ))}
            <li className="flex items-center gap-3">
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="line-clamp-1">
                {title.replace(/\*/g, "")}
              </span>
            </li>
          </ol>
        </nav>
        <h1>
          <Rich text={title} />
        </h1>
      </div>
    </section>
  );
}
