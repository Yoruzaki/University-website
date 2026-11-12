import { getPublishedNews } from "@/lib/content";
import { isValidLocale, t, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Reveal from "@/components/ui/reveal";
import PageBanner from "@/components/site/page-banner";
import NewsCard from "@/components/site/news-card";
import { SectionLabel } from "@/components/ui/chrome";

export default async function NewsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const loc = locale as Locale;
  const items = await getPublishedNews(loc);
  const featuredLayout = items.length === 4;

  return (
    <>
      <PageBanner title={t(loc, "newsTitle")} locale={loc} image="/photos/conference-amphi.jpg" />
      <section className="news section">
        <div className="wrap">
          <SectionLabel n="01">{t(loc, "newsEyebrow")}</SectionLabel>
          {items.length > 0 ? (
            <div className={`news-grid ${featuredLayout ? "" : "news-grid--even"}`}>
              {items.map((item, i) => (
                <Reveal key={item.id} delay={(i % 3) * 80} className={`news-item ${i === 0 ? "news-item--featured" : ""}`}>
                  <NewsCard item={item} locale={loc} headingLevel="h2" />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="lede">{t(loc, "noNews")}</p>
          )}
        </div>
      </section>
    </>
  );
}
