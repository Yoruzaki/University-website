import Reveal from "@/components/ui/reveal";
import { SectionLabel, Icon } from "@/components/ui/chrome";
import { getAllDocuments, localizedText } from "@/lib/content";
import { Rich, pad } from "@/lib/rich";
import { t, type Locale } from "@/lib/i18n";

export interface DownloadsData {
  eyebrow?: string;
  title: string;
}

export default async function Downloads({ data, n, locale }: { data: DownloadsData; n: string; locale: Locale }) {
  const docs = await getAllDocuments();
  if (docs.length === 0) return null;

  return (
    <section className="intro section">
      <div className="wrap">
        <SectionLabel n={n}>{data.eyebrow || t(locale, "documents")}</SectionLabel>
        <Reveal>
          <h2 className="display-heading display-heading--md mb-14">
            <Rich text={data.title} />
          </h2>
        </Reveal>
        <div className="docs">
          {docs.map((doc, i) => (
            <Reveal key={doc.id} delay={(i % 4) * 50}>
              <a href={doc.fileUrl}>
                <span>{pad(i + 1)}</span>
                <span>
                  {doc.category && <small>{doc.category}</small>}
                  <strong>{localizedText(doc, "title", locale)}</strong>
                </span>
                <em aria-label={t(locale, "download")}>
                  <Icon name="down" size={18} />
                </em>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
