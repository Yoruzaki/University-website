import Reveal from "@/components/ui/reveal";
import { SectionLabel, ArrowLink } from "@/components/ui/chrome";
import { IMAGES, photoSrc, photoAlt } from "@/components/ui/photo";
import { Rich, pad } from "@/lib/rich";
import { t, type Locale } from "@/lib/i18n";

export interface PhotoStoryData {
  eyebrow?: string;
  title: string;
  body?: string;
  imageCaption?: string;
  imagePosition?: "left" | "right";
  caption?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function PhotoStory({ data, n, locale }: { data: PhotoStoryData; n: string; locale: Locale }) {
  const imageLeft = (data.imagePosition ?? "left") === "left";
  const paragraphs = (data.body ?? "").split(/\n{2,}/).filter(Boolean);

  return (
    <section className="intro section">
      <div className="wrap">
        <SectionLabel n={n}>{data.eyebrow}</SectionLabel>
        <div className={`intro-grid ${imageLeft ? "" : "intro-grid--flip"}`}>
          <Reveal className="intro-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoSrc(data.imageCaption, { fallback: IMAGES.labTwo, width: 1800 })}
              alt={photoAlt(data.imageCaption)}
              loading="lazy"
            />
            <div className="image-caption">
              <span>{t(locale, "illustration")}</span>
              {data.caption && <p>{data.caption}</p>}
            </div>
          </Reveal>
          <Reveal className="intro-copy" delay={120}>
            <span className="chapter">ENSF / {n || pad(1)}</span>
            <h3>
              <Rich text={data.title} auto={false} />
            </h3>
            <div className="body-copy">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {data.ctaLabel && data.ctaHref && <ArrowLink href={data.ctaHref} className="mt-7">{data.ctaLabel}</ArrowLink>}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
