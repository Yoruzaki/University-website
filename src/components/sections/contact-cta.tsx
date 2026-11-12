import Reveal from "@/components/ui/reveal";
import { SectionLabel, ArrowLink, Icon } from "@/components/ui/chrome";
import { IMAGES, photoSrc, photoAlt } from "@/components/ui/photo";
import { Rich } from "@/lib/rich";
import { t, type Locale } from "@/lib/i18n";

export interface ContactCtaData {
  eyebrow?: string;
  title: string;
  body?: string;
  address?: string;
  email?: string;
  phone?: string;
  imageCaption?: string;
}

export default function ContactCta({ data, n, locale }: { data: ContactCtaData; n: string; locale: Locale }) {
  const rows = [
    data.address && { icon: "map" as const, label: t(locale, "address"), value: data.address },
    data.email && {
      icon: "mail" as const,
      label: t(locale, "email"),
      value: data.email,
      href: `mailto:${data.email}`,
    },
    data.phone && {
      icon: "phone" as const,
      label: t(locale, "phone"),
      value: data.phone,
      href: `tel:${data.phone.replace(/\s+/g, "")}`,
    },
  ].filter(Boolean) as { icon: "map" | "mail" | "phone"; label: string; value: string; href?: string }[];

  return (
    <section className="cooperation cooperation--warm section">
      <div className="wrap">
        <SectionLabel n={n}>{data.eyebrow || t(locale, "contactUs")}</SectionLabel>
        <div className="cooperation-grid cooperation-grid--flip">
          <Reveal className="cooperation-copy">
            <h2 className="display-heading display-heading--md">
              <Rich text={data.title} />
            </h2>
            {data.body && <p>{data.body}</p>}
            <div className="pillars">
              {rows.map((r) => {
                const content = (
                  <>
                    <span>
                      <Icon name={r.icon} size={16} />
                    </span>
                    <div className="py-1">
                      <small className="block !font-[var(--display)] !text-[9px] font-semibold uppercase tracking-[0.15em] !text-emerald">
                        {r.label}
                      </small>
                      <div className="mt-1 text-[15px]" dir={r.icon === "phone" ? "ltr" : undefined}>
                        {r.value}
                      </div>
                    </div>
                  </>
                );
                return r.href ? (
                  <a key={r.label} href={r.href}>
                    {content}
                  </a>
                ) : (
                  <div key={r.label}>{content}</div>
                );
              })}
            </div>
            {data.email && (
              <ArrowLink href={`mailto:${data.email}`} className="mt-9">
                {t(locale, "contactUs")}
              </ArrowLink>
            )}
          </Reveal>
          <Reveal className="cooperation-image" delay={120}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoSrc(data.imageCaption, { fallback: IMAGES.pines })}
              alt={photoAlt(data.imageCaption)}
              loading="lazy"
            />
            <span>Khenchela — {photoAlt(data.imageCaption) || t(locale, "illustration")}</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
