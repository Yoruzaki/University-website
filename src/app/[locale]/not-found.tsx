import Link from "next/link";
import { defaultLocale, t } from "@/lib/i18n";
import { Icon } from "@/components/ui/chrome";
import { IMAGES } from "@/components/ui/photo";

export default function NotFound() {
  return (
    <section className="page-banner !min-h-[100svh] !items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hero-image" src={IMAGES.pines} alt="" />
      <div className="hero-shade" />
      <div className="page-banner-content">
        <div className="crumbs">404</div>
        <h1>
          {t(defaultLocale, "notFoundTitle")}
          <br />
          <em>{t(defaultLocale, "notFoundBody")}</em>
        </h1>
        <Link href={`/${defaultLocale}`} className="btn btn--light mt-12">
          {t(defaultLocale, "backHome")} <Icon name="arrow" size={17} />
        </Link>
      </div>
    </section>
  );
}
