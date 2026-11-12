import { Fragment } from "react";
import { notFound } from "next/navigation";
import { getPublishedPageBySlug, localizedText } from "@/lib/content";
import { renderSection } from "@/components/sections/registry";
import PageBanner from "@/components/site/page-banner";
import type { Locale } from "@/lib/i18n";
import { pad } from "@/lib/rich";

export default async function PageRenderer({ slug, locale }: { slug: string; locale: Locale }) {
  const page = await getPublishedPageBySlug(slug);
  if (!page) notFound();

  const sections = [...page.sections].sort((a, b) => a.order - b.order);
  const startsWithHero = sections[0]?.type === "HERO";

  // Number every section after the hero: 01, 02, 03 … (the design's section labels)
  let counter = 0;
  const rendered = await Promise.all(
    sections.map((s) => {
      const n = s.type === "HERO" ? "" : pad(++counter);
      return renderSection(s, locale, n);
    })
  );
  const title = localizedText(page, "title", locale);

  return (
    <>
      {!startsWithHero && title && (
        <PageBanner title={title} locale={locale} seed={page.slug} image={page.bannerImage} />
      )}
      {rendered.map((node, i) => (
        <Fragment key={sections[i].id}>{node}</Fragment>
      ))}
    </>
  );
}
