import Link from "next/link";
import Image from "next/image";
import { t, type Locale } from "@/lib/i18n";
import { Icon } from "@/components/ui/chrome";
import { IMAGES } from "@/components/ui/photo";
import { Rich } from "@/lib/rich";
import Reveal from "@/components/ui/reveal";

export default function SiteFooter({ locale }: { locale: Locale }) {
  const href = (h: string) => `/${locale}${h}`;
  const about = locale === "ar" ? "من نحن" : locale === "en" ? "About" : "L'École";

  const discover = [
    { href: "/a-propos", label: about },
    { href: "/programmes", label: t(locale, "programs") },
    { href: "/recherche", label: t(locale, "research") },
  ];
  const resources = [
    { href: "/evenements", label: locale === "ar" ? "المواعيد" : locale === "en" ? "Events" : "Événements" },
    { href: "/services", label: locale === "ar" ? "الخدمات الرقمية" : locale === "en" ? "Digital services" : "Services numériques" },
    { href: "/vie-etudiante", label: locale === "ar" ? "الحياة الطلابية" : locale === "en" ? "Student life" : "Vie étudiante" },
    { href: "/actualites", label: t(locale, "newsEyebrow") },
    { href: "/contact", label: t(locale, "contactUs") },
    { href: "/search", label: t(locale, "search") },
  ];

  return (
    <>
      <section className="final-cta">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMAGES.sunset} alt="" loading="lazy" />
        <div className="final-shade" />
        <Reveal className="final-content">
          <span>{t(locale, "ctaEyebrow")}</span>
          <h2>
            <Rich text={t(locale, "ctaHeadline")} />
          </h2>
          <p>{t(locale, "ctaLead")}</p>
          <div className="final-actions">
            <Link className="btn btn--light" href={href("/programmes")}>
              {t(locale, "joinUs")} <Icon name="arrow" size={18} />
            </Link>
            <Link className="btn btn--outline" href={href("/contact")}>
              {t(locale, "contactUs")} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </section>

      <footer id="footer" className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href={href("")} className="identity">
              <span className="identity-logo">
                <Image src="/logo-ensf.jpg" alt="" width={44} height={44} className="cover" />
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
            <p className="whitespace-pre-line">{t(locale, "motto")}</p>
            <div className="footer-social" aria-label={locale === "ar" ? "مواقع التواصل الاجتماعي" : locale === "en" ? "Social media" : "Réseaux sociaux"}>
              <a href="https://www.facebook.com/ensfkh/" target="_blank" rel="noopener noreferrer" aria-label="Facebook ENSF">
                <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.513c-1.491 0-1.956.931-1.956 1.887v2.263h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" /></svg>
              </a>
              <a href="https://www.youtube.com/@chaineyoutube-ENSF/playlists" target="_blank" rel="noopener noreferrer" aria-label="YouTube ENSF">
                <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.121 2.136c1.872.505 9.377.505 9.377.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" /></svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <span>{t(locale, "discover")}</span>
            {discover.map((l) => (
              <Link key={l.href} href={href(l.href)}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <span>{t(locale, "resources")}</span>
            {resources.map((l) => (
              <Link key={l.href} href={href(l.href)}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="footer-contact">
            <span>{t(locale, "findUs")}</span>
            <p>
              <Icon name="map" size={18} />
              Route de Batna, Khenchela 40000
              <br />
              <small>Algérie</small>
            </p>
            <p>
              <Icon name="mail" size={18} />
              <a href="mailto:contact@ensf.dz" className="hover:text-white">contact@ensf.dz</a>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {t(locale, "schoolLine1")} {t(locale, "schoolLine2")}. {t(locale, "rights")}
          </span>
          <div>
            <span>{t(locale, "ministry")}</span>
            <span className="footer-credit">Designed by <a href="https://auresnix.com" target="_blank" rel="noopener noreferrer">Auresnix</a></span>
          </div>
          <a href="#top" aria-label={t(locale, "backToTop")}>
            ↑
          </a>
        </div>
      </footer>
    </>
  );
}
