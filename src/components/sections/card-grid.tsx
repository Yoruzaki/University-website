import Link from "next/link";
import Reveal from "@/components/ui/reveal";
import { SectionLabel, Icon } from "@/components/ui/chrome";
import { photoSrc, photoAlt } from "@/components/ui/photo";
import { Rich, pad } from "@/lib/rich";
import { t, type Locale } from "@/lib/i18n";

export interface CardGridItem {
  tag?: string;
  title: string;
  body?: string;
  imageCaption?: string;
  href?: string;
}

export interface CardGridData {
  eyebrow?: string;
  title: string;
  intro?: string;
  cards: CardGridItem[];
}

export default function CardGrid({ data, n, locale }: { data: CardGridData; n: string; locale: Locale }) {
  const cards = data.cards ?? [];
  const rows = Math.max(cards.length - 1, 1);

  return (
    <section className="programs section">
      <div className="wrap">
        <SectionLabel n={n}>{data.eyebrow}</SectionLabel>
        <div className="section-heading-row">
          <Reveal>
            <h2 className="display-heading">
              <Rich text={data.title} />
            </h2>
          </Reveal>
          {data.intro && <p className="lede">{data.intro}</p>}
        </div>

        <div className="program-grid">
          {cards.map((card, i) => {
            const featured = i === 0;
            const inner = (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoSrc(card.imageCaption, { seed: card.title, width: featured ? 1800 : 1000 })}
                  alt={photoAlt(card.imageCaption, card.title)}
                  loading="lazy"
                />
                <span className="program-overlay" />
                <span className="program-number">{pad(i + 1)}</span>
                <span className="program-content">
                  <span>{card.tag || t(locale, "pathway")}</span>
                  <strong>{card.title}</strong>
                  {card.body && <small>{card.body}</small>}
                </span>
                {card.href && (
                  <span className="program-arrow">
                    <Icon name="arrow" />
                  </span>
                )}
              </>
            );
            return (
              <Reveal
                key={i}
                delay={i * 80}
                className={`program-card ${featured ? "program-card--featured" : ""}`}
                style={featured ? { gridRow: `1 / span ${rows}` } : undefined}
              >
                {card.href ? <Link href={card.href}>{inner}</Link> : <div>{inner}</div>}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
