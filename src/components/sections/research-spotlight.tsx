import Reveal from "@/components/ui/reveal";
import { SectionLabel, ArrowLink } from "@/components/ui/chrome";
import { IMAGES, photoSrc, photoAlt } from "@/components/ui/photo";
import { Rich } from "@/lib/rich";
import { t, type Locale } from "@/lib/i18n";

export interface ResearchSpotlightData {
  eyebrow?: string;
  title: string;
  body?: string;
  imageCaption?: string;
  statValue?: string;
  statLabel?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function ResearchSpotlight({
  data,
  n,
  locale,
}: {
  data: ResearchSpotlightData;
  n: string;
  locale: Locale;
}) {
  return (
    <section className="research section on-dark">
      <div className="wrap">
        <SectionLabel n={n} light>
          {data.eyebrow || t(locale, "research")}
        </SectionLabel>
        <Reveal>
          <h2 className="display-heading">
            <Rich text={data.title} />
          </h2>
        </Reveal>
        <div className="research-grid">
          <Reveal className="research-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoSrc(data.imageCaption, { fallback: IMAGES.field, width: 1800 })}
              alt={photoAlt(data.imageCaption)}
              loading="lazy"
            />
            <span>
              {t(locale, "illustration")}
              {data.imageCaption && !/^(https?:|\/)/.test(data.imageCaption)
                ? ` — ${photoAlt(data.imageCaption)}`
                : ""}
            </span>
          </Reveal>
          <Reveal className="research-copy" delay={120}>
            {data.body && <p>{data.body}</p>}
            {(data.statValue || data.statLabel) && (
              <div className="research-stat">
                <strong>{data.statValue}</strong>
                <p>{data.statLabel}</p>
              </div>
            )}
            {data.ctaLabel && data.ctaHref && (
              <ArrowLink href={data.ctaHref} inverse>
                {data.ctaLabel}
              </ArrowLink>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
