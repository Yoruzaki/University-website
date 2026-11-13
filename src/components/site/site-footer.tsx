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
              <Link href={href("/contact")} className="hover:text-white">
                {t(locale, "contactUs")}
              </Link>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {t(locale, "schoolLine1")} {t(locale, "schoolLine2")}. {t(locale, "rights")}
          </span>
          <div>
            <span>{t(locale, "ministry")}</span>
          </div>
          <a href="#top" aria-label={t(locale, "backToTop")}>
            ↑
          </a>
        </div>
      </footer>
    </>
  );
}
