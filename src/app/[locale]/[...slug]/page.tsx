import PageRenderer from "@/components/site/page-renderer";
import { isValidLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  return <PageRenderer slug={slug.join("/")} locale={locale} />;
}
