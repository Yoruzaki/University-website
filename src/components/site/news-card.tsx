import Link from "next/link";
import { Icon } from "@/components/ui/chrome";
import { photoSrc, photoAlt } from "@/components/ui/photo";
import { localizedText } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import type { NewsItem } from "@/lib/db/types";

/** News item in the design's editorial style (image, meta line, title, arrow). */
export default function NewsCard({
  item,
  locale,
  headingLevel = "h3",
  showExcerpt = true,
}: {
  item: NewsItem;
  locale: Locale;
  headingLevel?: "h2" | "h3";
  showExcerpt?: boolean;
}) {
  const Heading = headingLevel;
  const date = new Date(item.publishedAt);
  const dateLabel = date.toLocaleDateString(locale === "ar" ? "ar-DZ" : locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const title = localizedText(item, "title", locale);
  const excerpt = localizedText(item, "excerpt", locale);

  return (
    <article>
      <Link href={`/${locale}/actualites/${item.slug}`}>
        <div className="news-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoSrc(item.coverImage, { seed: item.slug, width: 1400 })} alt={photoAlt(item.coverImage, title)} loading="lazy" />
          {item.category && <span className="news-chip">{item.category}</span>}
        </div>
        <div className="news-meta">
          {item.category && <span>{item.category}</span>}
          <time dateTime={date.toISOString()}>{dateLabel}</time>
        </div>
        <Heading>{title}</Heading>
        {showExcerpt && excerpt && <p>{excerpt}</p>}
        <span className="article-arrow">
          <Icon name="arrow" />
        </span>
      </Link>
    </article>
  );
}
