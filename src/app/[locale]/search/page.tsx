import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPages, getPublishedNews, localizedText, sectionData } from "@/lib/content";
import { isValidLocale, t, type Locale } from "@/lib/i18n";
import PageBanner from "@/components/site/page-banner";
import { SectionLabel, Icon } from "@/components/ui/chrome";
import { pad } from "@/lib/rich";

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

function collectText(v: unknown): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v.map(collectText).join(" ");
  if (v && typeof v === "object") return Object.values(v).map(collectText).join(" ");
  return "";
}

/** Simple site search over published pages (titles + section text) and news. */
export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const loc = locale as Locale;
  const q = ((await searchParams).q ?? "").trim();
  const terms = norm(q).split(/\s+/).filter((w) => w.length > 1);

  const results: { href: string; kind: string; title: string; snippet: string }[] = [];
  if (terms.length) {
    const pages = (await getAllPages()).filter((p) => p.status === "PUBLISHED");
    for (const p of pages) {
      const title = localizedText(p, "title", loc);
      const text = p.sections.map((s) => collectText(sectionData(s, loc))).join(" ");
      const hay = norm(`${title} ${text}`);
      if (terms.every((w) => hay.includes(w))) {
        results.push({ href: `/${loc}${p.slug ? `/${p.slug}` : ""}`, kind: t(loc, "page"), title, snippet: text.slice(0, 180) });
      }
    }
    for (const n of await getPublishedNews(loc)) {
      const title = localizedText(n, "title", loc);
      const text = `${localizedText(n, "excerpt", loc)} ${localizedText(n, "body", loc)}`;
      if (terms.every((w) => norm(`${title} ${text} ${n.category ?? ""}`).includes(w))) {
        results.push({ href: `/${loc}/actualites/${n.slug}`, kind: t(loc, "newsEyebrow"), title, snippet: text.slice(0, 180) });
      }
    }
  }

  return (
    <>
      <PageBanner title={q ? `« ${q} »` : t(loc, "search")} locale={loc} image="/photos/bibliotheque-livres.jpg" />
      <section className="intro section">
        <div className="wrap">
          <SectionLabel n="01">
            {t(loc, "search")} · {results.length}
          </SectionLabel>
          <form action={`/${loc}/search`} className="mb-14 flex max-w-3xl border-b border-[var(--rule)]">
            <input
              name="q"
              defaultValue={q}
              placeholder={t(loc, "searchPlaceholder")}
              aria-label={t(loc, "search")}
              className="w-full bg-transparent py-4 font-serif text-3xl text-navy outline-none placeholder:text-[#9aa9a3]"
            />
            <button type="submit" aria-label={t(loc, "search")} className="px-4 text-forest-800">
              <Icon name="arrow" size={26} />
            </button>
          </form>
          {results.length > 0 ? (
            <div className="docs">
              {results.map((r, i) => (
                <Link key={r.href} href={r.href}>
                  <span>{pad(i + 1)}</span>
                  <span>
                    <small>{r.kind}</small>
                    <strong>{r.title}</strong>
                    <span className="mt-2 block text-[13px] leading-relaxed text-ink-text-muted">{r.snippet}…</span>
                  </span>
                  <em>
                    <Icon name="arrow" size={18} />
                  </em>
                </Link>
              ))}
            </div>
          ) : (
            q && <p className="lede">0 — {t(loc, "searchPlaceholder")}</p>
          )}
        </div>
      </section>
    </>
  );
}
