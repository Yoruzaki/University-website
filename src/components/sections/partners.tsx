import Reveal from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/chrome";
import { IMAGES, photoSrc, photoAlt } from "@/components/ui/photo";
import { Rich, pad } from "@/lib/rich";
import { t, type Locale } from "@/lib/i18n";

export interface PartnersData {
  title?: string;
  imageCaption?: string;
  logos: { name: string }[];
}

export default function Partners({ data, n, locale }: { data: PartnersData; n: string; locale: Locale }) {
  return (
    <section className="cooperation section">
      <div className="wrap">
        <SectionLabel n={n}>{t(locale, "partners")}</SectionLabel>
        <div className="cooperation-grid">
          <Reveal className="cooperation-copy">
            <h2 className="display-heading display-heading--md">
              <Rich text={data.title || t(locale, "partners")} />
            </h2>
            <div className="pillars mt-10">
              {data.logos.map((logo, i) => (
                <div key={i}>
                  <span>{pad(i + 1)}</span>
                  {logo.name}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="cooperation-image" delay={120}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoSrc(data.imageCaption, { fallback: IMAGES.labTwo })}
              alt={photoAlt(data.imageCaption)}
              loading="lazy"
            />
            <span>{photoAlt(data.imageCaption) || t(locale, "illustration")}</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
