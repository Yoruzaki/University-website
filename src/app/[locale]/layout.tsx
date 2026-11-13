import type { Metadata } from "next";
import "../globals.css";
import "../campus.css";
import { isRtl, isValidLocale, locales, t, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/site-header";
import SiteFooter from "@/components/site/site-footer";
import { getMenu } from "@/lib/content";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: "ENSF Khenchela — École Nationale Supérieure des Forêts",
      template: "%s · ENSF Khenchela",
    },
    description:
      "École Nationale Supérieure des Forêts de Khenchela — formation, recherche et protection du patrimoine forestier et de la biodiversité.",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dir = isRtl(locale) ? "rtl" : "ltr";
  const menu = await getMenu(locale as Locale);

  return (
    <html lang={locale} dir={dir} className="h-full antialiased" data-scroll-behavior="smooth">
      <body id="top" className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only !fixed top-0 left-0 focus:not-sr-only focus:z-[200] focus:top-2 focus:start-2 focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-forest-800"
        >
          {t(locale as Locale, "skipToContent")}
        </a>
        <SiteHeader locale={locale as Locale} menu={menu} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale as Locale} />
      </body>
    </html>
  );
}
