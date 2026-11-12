import { getNewsBySlug, getPublishedNews, localizedText } from "@/lib/content";
import { isValidLocale, t, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Reveal from "@/components/ui/reveal";
import PageBanner from "@/components/site/page-banner";
import NewsCard from "@/components/site/news-card";
import { SectionLabel, ArrowLink } from "@/components/ui/chrome";
import { photoSrc, photoAlt } from "@/components/ui/photo";

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  const loc = locale as Locale;
  const item = await getNewsBySlug(slug);
  if (!item || item.status !== "PUBLISHED") notFound();

  const title = localizedText(item, "title", loc);
  const body = (localizedText(item, "body", loc) || "").split(/\n{2,}/).filter(Boolean);
  const more = (await getPublishedNews(loc, 4)).filter((n) => n.id !== item.id).slice(0, 3);
  const date = new Date(item.publishedAt);
  const dateLabel = date.toLocaleDateString(loc === "ar" ? "ar-DZ" : loc, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <PageBanner
        title={title}
        locale={loc}
        seed={item.slug}
        image={item.coverImage}
        crumbs={[{ label: t(loc, "newsEyebrow"), href: `/${loc}/actualites` }]}
      />

      <article className="intro section">
        <div className="wrap">
          <SectionLabel n="01">
            {item.category} · {t(loc, "publishedOn")} {dateLabel}
          </SectionLabel>
          <div className="intro-grid">
            <Reveal className="intro-visual">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoSrc(item.coverImage, { seed: item.slug, width: 1800 })} alt={photoAlt(item.coverImage, title)} />
              <div className="image-caption">
                <span>{t(loc, "illustration")}</span>
                <p>{photoAlt(item.coverImage)}</p>
              </div>
            </Reveal>
            <Reveal className="intro-copy" delay={120}>
              <span className="chapter">ENSF / {item.category ?? t(loc, "newsEyebrow")}</span>
              <div className="article-body mt-7">
                {body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <ArrowLink href={`/${loc}/actualites`}>{t(loc, "allNews")}</ArrowLink>
            </Reveal>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="news section">
          <div className="wrap">
            <SectionLabel n="02">{t(loc, "newsEyebrow")}</SectionLabel>
            <div className="news-grid news-grid--even">
              {more.map((n, i) => (
                <Reveal key={n.id} delay={i * 80} className="news-item">
                  <NewsCard item={n} locale={loc} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
