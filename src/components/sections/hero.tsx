import Link from "next/link";
import { Icon } from "@/components/ui/chrome";
import { IMAGES, photoSrc, photoAlt } from "@/components/ui/photo";
import { Rich } from "@/lib/rich";
import { t, type Locale } from "@/lib/i18n";

export interface HeroData {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  imageCaption?: string;
  ctaLabel?: string;
  ctaHref?: string;
  scrollCue?: string;
}

export default function Hero({ data, locale }: { data: HeroData; locale: Locale }) {
  const src = photoSrc(data.imageCaption, { fallback: IMAGES.algeria, width: 2400 });
  const [eyebrowMain, eyebrowSub] = (data.eyebrow ?? "").split(/\s+[—–-]\s+/, 2);

  return (
    <section className="hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hero-image" src={src} alt={photoAlt(data.imageCaption)} fetchPriority="high" />
      <div className="hero-shade" />
      <div className="hero-content">
        {data.eyebrow && (
          <div className="hero-eyebrow">
            {eyebrowMain} {eyebrowSub && <span>{eyebrowSub}</span>}
          </div>
        )}
        <h1>
          <Rich text={data.title} />
        </h1>
        <div className="hero-bottom">
          <div>{data.subtitle && <p className="hero-tagline">{data.subtitle}</p>}</div>
          <div className="hero-ctas">
            {data.ctaLabel && data.ctaHref && (
              <Link className="btn btn--light" href={data.ctaHref}>
                {data.ctaLabel} <Icon name="arrow" size={17} />
              </Link>
            )}
            <Link className="btn btn--outline" href={`/${locale}/programmes`}>
              {t(locale, "explore")} — {t(locale, "programs")} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
      <a className="scroll-cue" href="#main-content-start">
        <span>{data.scrollCue ?? t(locale, "scroll")}</span>
        <i />
      </a>
      <span id="main-content-start" className="absolute bottom-0" />
    </section>
  );
}
