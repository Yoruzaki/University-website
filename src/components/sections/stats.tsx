import Reveal from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/chrome";
import { Rich, pad } from "@/lib/rich";
import { t, type Locale } from "@/lib/i18n";

export interface StatsData {
  eyebrow?: string;
  title?: string;
  items: { value: string; label: string }[];
}

export default function Stats({
  data,
  variant = "LIGHT",
  n,
  locale,
}: {
  data: StatsData;
  variant?: "LIGHT" | "DARK";
  n: string;
  locale: Locale;
}) {
  const dark = variant === "DARK";
  return (
    <section className={`impact section ${dark ? "impact--dark on-dark" : ""}`}>
      <div className="wrap">
        <SectionLabel n={n} light={dark}>
          {data.eyebrow || t(locale, "figures")}
        </SectionLabel>
        {data.title && (
          <div className="impact-head">
            <Reveal>
              <h2 className="display-heading">
                <Rich text={data.title} />
              </h2>
            </Reveal>
          </div>
        )}
        <div className="stats">
          {data.items.map((item, i) => (
            <Reveal className="stat" key={i} delay={i * 60}>
              <span>{pad(i + 1)}</span>
              <strong>{item.value}</strong>
              <p>{item.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
