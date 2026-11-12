import Reveal from "@/components/ui/reveal";
import { SectionLabel, ArrowLink } from "@/components/ui/chrome";
import NewsCard from "@/components/site/news-card";
import { getPublishedNews } from "@/lib/content";
import { Rich } from "@/lib/rich";
import { t, type Locale } from "@/lib/i18n";

export interface NewsListData {
  eyebrow?: string;
  title: string;
  count?: number;
}

export default async function NewsList({ data, n, locale }: { data: NewsListData; n: string; locale: Locale }) {
  const items = await getPublishedNews(locale, data.count ?? 4);
  if (items.length === 0) return null;
  // The "one big story + three" layout needs exactly four articles.
  const featuredLayout = items.length === 4;

  return (
    <section className="news section">
      <div className="wrap">
        <SectionLabel n={n}>{data.eyebrow || t(locale, "newsEyebrow")}</SectionLabel>
        <div className="news-head">
          <Reveal>
            <h2 className="display-heading">
              <Rich text={data.title} />
            </h2>
          </Reveal>
          <ArrowLink href={`/${locale}/actualites`}>{t(locale, "allNews")}</ArrowLink>
        </div>
        <div className={`news-grid ${featuredLayout ? "" : "news-grid--even"}`}>
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 80} className={`news-item ${i === 0 ? "news-item--featured" : ""}`}>
              <NewsCard item={item} locale={locale} showExcerpt={!featuredLayout || i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
