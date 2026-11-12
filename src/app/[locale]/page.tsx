import PageRenderer from "@/components/site/page-renderer";
import { isValidLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  return <PageRenderer slug="" locale={locale} />;
}
