import Reveal from "@/components/ui/reveal";
import { SectionLabel, ArrowLink } from "@/components/ui/chrome";
import { photoSrc, photoAlt } from "@/components/ui/photo";
import { Rich } from "@/lib/rich";
import type { Locale } from "@/lib/i18n";

export interface GalleryData {
  eyebrow?: string;
  title: string;
  intro?: string;
  ctaLabel?: string;
  ctaHref?: string;
  images: { src: string; caption?: string }[];
}

/**
 * "Vie universitaire" collage from the design: three photos at staggered
 * heights, then any further photos in a simple row below.
 */
export default function Gallery({ data, n }: { data: GalleryData; n: string; locale: Locale }) {
  const images = (data.images ?? []).filter((i) => i.src);
  if (images.length === 0) return null;
  const [a, b, c, ...rest] = images;
  const trio = [a, b, c].filter(Boolean);

  return (
    <section className="campus section">
      <div className="wrap">
        <SectionLabel n={n}>{data.eyebrow}</SectionLabel>
        <div className="campus-head">
          <Reveal>
            <h2 className="display-heading">
              <Rich text={data.title} />
            </h2>
          </Reveal>
          {data.intro && <p className="lede">{data.intro}</p>}
        </div>

        <div className="collage">
          {trio.map((img, i) => (
            <Reveal key={i} delay={i * 90} className={`collage-${"abc"[i]}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoSrc(img.src, { seed: img.caption })} alt={photoAlt(img.src, img.caption)} loading="lazy" />
              {img.caption && <span>{img.caption}</span>}
            </Reveal>
          ))}
        </div>

        {rest.length > 0 && (
          <div className="collage-more">
            {rest.map((img, i) => (
              <Reveal key={i} delay={(i % 3) * 90}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoSrc(img.src, { seed: img.caption })} alt={photoAlt(img.src, img.caption)} loading="lazy" />
                {img.caption && <span>{img.caption}</span>}
              </Reveal>
            ))}
          </div>
        )}

        {data.ctaLabel && data.ctaHref && (
          <ArrowLink href={data.ctaHref} className="mt-8">
            {data.ctaLabel}
          </ArrowLink>
        )}
      </div>
    </section>
  );
}
