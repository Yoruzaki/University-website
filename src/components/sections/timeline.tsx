import Reveal from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/chrome";
import { Rich, pad } from "@/lib/rich";
import type { Locale } from "@/lib/i18n";

export interface TimelineData {
  eyebrow?: string;
  title?: string;
  items: { year: string; title: string; body?: string }[];
}

export default function Timeline({ data, n }: { data: TimelineData; n: string; locale: Locale }) {
  return (
    <section className="programs section">
      <div className="wrap">
        <SectionLabel n={n}>{data.eyebrow}</SectionLabel>
        {data.title && (
          <Reveal>
            <h2 className="display-heading mb-16">
              <Rich text={data.title} />
            </h2>
          </Reveal>
        )}
        <div className="timeline">
          {data.items.map((item, i) => (
            <Reveal key={i} delay={i * 60} className="timeline-row">
              <span>{pad(i + 1)}</span>
              <strong>{item.year}</strong>
              <div>
                <h3>{item.title}</h3>
                {item.body && <p>{item.body}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
