import Reveal from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/chrome";
import type { Locale } from "@/lib/i18n";

export interface QuoteData {
  quote: string;
  author?: string;
  role?: string;
}

export default function Quote({
  data,
  variant = "DARK",
  n,
}: {
  data: QuoteData;
  variant?: "LIGHT" | "DARK";
  n: string;
  locale: Locale;
}) {
  const dark = variant === "DARK";
  return (
    <section className={`quote-block section ${dark ? "" : "quote-block--light"}`}>
      <div className="wrap">
        <SectionLabel n={n} light={dark} />
        <Reveal>
          <figure>
            <blockquote>
              <p>“{data.quote}”</p>
            </blockquote>
            {(data.author || data.role) && (
              <figcaption>
                {data.author}
                {data.role && <small>{data.role}</small>}
              </figcaption>
            )}
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
