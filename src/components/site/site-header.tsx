"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { locales, t, type Locale } from "@/lib/i18n";
import { Icon } from "@/components/ui/chrome";
import { IMAGES } from "@/components/ui/photo";
import { pad } from "@/lib/rich";
import { SITE_LINKS } from "@/lib/site-links";

type ServiceKey = keyof typeof SITE_LINKS;

/** A link to one of the school's external services, or a "coming soon" button while it has no address yet. */
function ServiceLink({
  service,
  label,
  onSoon,
  className,
  children,
  tabIndex,
}: {
  service: ServiceKey;
  label: string;
  onSoon: (label: string) => void;
  className?: string;
  children?: React.ReactNode;
  tabIndex?: number;
}) {
  const currentPath = usePathname();
  const locale = currentPath.split("/")[1] || "fr";
  const destinations = { studentSpace: `/${locale}/scolarite`, eLearning: `/${locale}/services#elearning`, library: `/${locale}/services#bibliotheque` };
  const url = SITE_LINKS[service] || destinations[service];
  if (url) {
    return (
      <a href={url} target={url.startsWith("http") ? "_blank" : undefined} rel={url.startsWith("http") ? "noopener noreferrer" : undefined} className={className} tabIndex={tabIndex}>
        {children ?? label}
      </a>
    );
  }
  return (
    <button type="button" className={className} onClick={() => onSoon(label)} tabIndex={tabIndex}>
      {children ?? label}
    </button>
  );
}

interface MenuNode {
  id: string;
  label: string;
  href: string;
  children: { id: string; label: string; href: string }[];
}

export default function SiteHeader({ locale, menu }: { locale: Locale; menu: MenuNode[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const [search, setSearch] = useState(false);
  const [toast, setToast] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(""), 3800);
    return () => window.clearTimeout(id);
  }, [toast]);
  const soon = (label: string) => setToast(`${label} ${t(locale, "comingSoon")}`);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 50);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile || search ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile, search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearch(false);
        setMobile(false);
        setMega(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close overlays when navigating to another page
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobile(false);
    setMega(null);
    setSearch(false);
  }

  const href = (h: string) => `/${locale}${h}`;
  const isActive = (h: string) => {
    if (h === "" || h === "/") return pathname === `/${locale}`;
    return pathname === href(h) || pathname.startsWith(`${href(h)}/`);
  };
  const switchLocaleHref = (target: Locale) => {
    const rest = pathname.replace(new RegExp(`^/${locale}`), "");
    return `/${target}${rest || ""}`;
  };
  const megaItem = menu.find((m) => m.id === mega);
  const solid = scrolled || !!mega;

  return (
    <>
      <header className={`site-header ${solid ? "site-header--solid" : ""}`}>
        <div className="utility">
          <a href={`#footer`}>{t(locale, "ministry")}</a>
          <div>
            <span className="utility-links flex h-full items-center gap-[22px]">
              <ServiceLink service="eLearning" label={t(locale, "eLearning")} onSoon={soon} />
              <ServiceLink service="library" label={t(locale, "library")} onSoon={soon} />
              <Link href={href("/contact")}>{t(locale, "contactUs")}</Link>
            </span>
            <span className="languages">
              {locales.map((l) => (
                <Link key={l} href={switchLocaleHref(l)} lang={l} aria-current={l === locale ? "true" : undefined}>
                  {l.toUpperCase()}
                </Link>
              ))}
            </span>
          </div>
        </div>

        <div className="main-nav">
          <Link className="identity" href={href("")} aria-label="ENSF Khenchela">
            <span className="identity-logo">
              <Image src="/logo-ensf.jpg" alt="" width={44} height={44} priority className="cover" />
            </span>
            <span>
              <b>ENSF</b>
              <small>
                {t(locale, "schoolLine1")}
                <br />
                {t(locale, "schoolLine2")}
              </small>
            </span>
          </Link>

          <nav aria-label="Navigation principale">
            {menu.map((item) =>
              item.children.length > 0 ? (
                <button
                  key={item.id}
                  type="button"
                  aria-expanded={mega === item.id}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onMouseEnter={() => setMega(item.id)}
                  onFocus={() => setMega(item.id)}
                  onClick={() => setMega(mega === item.id ? null : item.id)}
                >
                  {item.label}
                  <Icon name="chevron" size={14} />
                </button>
              ) : (
                <Link
                  key={item.id}
                  href={href(item.href)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onMouseEnter={() => setMega(null)}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="nav-actions">
            <button type="button" className="search-btn" aria-label={t(locale, "search")} onClick={() => setSearch(true)}>
              <Icon name="search" />
            </button>
            <ServiceLink
              service="studentSpace"
              label={t(locale, "studentSpace")}
              onSoon={soon}
              className="student-btn"
            >
              {t(locale, "studentSpace")} <span>↗</span>
            </ServiceLink>
            <button
              type="button"
              className="mobile-btn"
              aria-label={t(locale, "menu")}
              aria-expanded={mobile}
              onClick={() => setMobile(true)}
            >
              <Icon name="menu" size={26} />
            </button>
          </div>
        </div>

        {megaItem && (
          <div className="mega-menu" onMouseLeave={() => setMega(null)}>
            <div className="mega-intro">
              <span>{t(locale, "explore")}</span>
              <h3>{megaItem.label}</h3>
              <p>{t(locale, "megaBody")}</p>
            </div>
            <div className="mega-links">
              <Link href={href(megaItem.href)}>
                <span>00</span>
                {megaItem.label}
                <Icon name="arrow" size={17} />
              </Link>
              {megaItem.children.map((c, i) => (
                <Link key={c.id} href={href(c.href)}>
                  <span>{pad(i + 1)}</span>
                  {c.label}
                  <Icon name="arrow" size={17} />
                </Link>
              ))}
            </div>
            <div className="mega-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMAGES.forest} alt="" className="cover" />
              <span>{t(locale, "megaImage")}</span>
            </div>
          </div>
        )}
      </header>

      <div className={`mobile-menu ${mobile ? "is-open" : ""}`} aria-hidden={!mobile}>
        <div className="mobile-menu-top">
          <div className="identity">
            <span className="identity-logo">
              <Image src="/logo-ensf.jpg" alt="" width={44} height={44} className="cover" />
            </span>
            <span>
              <b>ENSF</b>
            </span>
          </div>
          <button type="button" aria-label={t(locale, "close")} onClick={() => setMobile(false)}>
            <Icon name="close" size={28} />
          </button>
        </div>
        <nav aria-label="Navigation mobile">
          {menu.map((item, i) => (
            <div key={item.id}>
              <Link href={href(item.href)} onClick={() => setMobile(false)} tabIndex={mobile ? 0 : -1}>
                <span>{pad(i + 1)}</span>
                {item.label}
                <span>↗</span>
              </Link>
              {item.children.map((c) => (
                <Link key={c.id} className="sub" href={href(c.href)} onClick={() => setMobile(false)} tabIndex={mobile ? 0 : -1}>
                  <span />
                  {c.label}
                  <span>↗</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="mobile-services">
          <ServiceLink service="eLearning" label={t(locale, "eLearning")} onSoon={soon} tabIndex={mobile ? 0 : -1}>
            {t(locale, "eLearning")} <span aria-hidden="true">↗</span>
          </ServiceLink>
          <ServiceLink service="library" label={t(locale, "library")} onSoon={soon} tabIndex={mobile ? 0 : -1}>
            {t(locale, "library")} <span aria-hidden="true">↗</span>
          </ServiceLink>
        </div>
        <div className="mobile-menu-foot">
          {locales.map((l) => (
            <Link
              key={l}
              href={switchLocaleHref(l)}
              lang={l}
              aria-current={l === locale ? "true" : undefined}
              tabIndex={mobile ? 0 : -1}
            >
              {l.toUpperCase()}
            </Link>
          ))}
          <ServiceLink
            service="studentSpace"
            label={t(locale, "studentSpace")}
            onSoon={soon}
            className="btn btn--light ms-auto !min-h-[44px]"
            tabIndex={mobile ? 0 : -1}
          >
            {t(locale, "studentSpace")} <Icon name="arrow" size={15} />
          </ServiceLink>
        </div>
      </div>

      <div className={`toast ${toast ? "toast--visible" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>

      {search && (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label={t(locale, "search")}>
          <button type="button" className="search-close" aria-label={t(locale, "close")} onClick={() => setSearch(false)}>
            <Icon name="close" size={28} />
          </button>
          <div>
            <span>{t(locale, "searchTitle").toUpperCase()}</span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = new FormData(e.currentTarget).get("q")?.toString().trim();
                if (!q) return;
                setSearch(false);
                router.push(`${href("/search")}?q=${encodeURIComponent(q)}`);
              }}
            >
              <input name="q" autoFocus aria-label={t(locale, "search")} placeholder={t(locale, "searchPlaceholder")} />
              <button type="submit" aria-label={t(locale, "search")}>
                <Icon name="arrow" size={28} />
              </button>
            </form>
            <p>
              {t(locale, "searchHint")}{" "}
              <Link href={href("/programmes")}>{t(locale, "programs")}</Link>,{" "}
              <Link href={href("/recherche")}>{t(locale, "research")}</Link>,{" "}
              <Link href={href("/actualites")}>{t(locale, "newsEyebrow")}</Link>,{" "}
              <Link href={href("/contact")}>{t(locale, "contactUs")}</Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
