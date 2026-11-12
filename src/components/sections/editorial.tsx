import Reveal from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/chrome";
import { Rich } from "@/lib/rich";
import type { Locale } from "@/lib/i18n";

export interface EditorialData {
  index?: string;
  eyebrow?: string;
  title: string;
  body?: string; // paragraphs separated by blank lines
}

export default function Editorial({ data, n }: { data: EditorialData; n: string; locale: Locale }) {
  const paragraphs = (data.body ?? "").split(/\n{2,}/).filter(Boolean);
  const [lead, ...rest] = paragraphs;

  return (
    <section className="intro section">
      <div className="wrap">
        <SectionLabel n={n || data.index}>{data.eyebrow}</SectionLabel>
        <div className="editorial-grid">
          <Reveal>
            <h2 className="display-heading display-heading--md">
              <Rich text={data.title} />
            </h2>
          </Reveal>
          <Reveal delay={120}>
            {lead && <p className="editorial-lead">{lead}</p>}
            {rest.length > 0 && (
              <div className="body-copy">
                {rest.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
