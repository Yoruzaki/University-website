import Reveal from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/chrome";
import { getAllFaculty, localizedText } from "@/lib/content";
import { isImageUrl } from "@/components/ui/photo";
import { Rich, pad } from "@/lib/rich";
import { t, type Locale } from "@/lib/i18n";

export interface FacultyGridData {
  eyebrow?: string;
  title: string;
}

function initials(name: string) {
  return name
    .replace(/^(pr\.?|dr\.?|prof\.?|m\.|mme)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default async function FacultyGrid({ data, n, locale }: { data: FacultyGridData; n: string; locale: Locale }) {
  const faculty = await getAllFaculty();
  if (faculty.length === 0) return null;

  return (
    <section className="intro section">
      <div className="wrap">
        <SectionLabel n={n}>{data.eyebrow || t(locale, "team")}</SectionLabel>
        <Reveal>
          <h2 className="display-heading mb-16">
            <Rich text={data.title} />
          </h2>
        </Reveal>
        <div className="people-grid">
          {faculty.map((member, i) => (
            <Reveal key={member.id} delay={(i % 4) * 70} className="person">
              {isImageUrl(member.photo) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.photo} alt="" className="h-16 w-16 object-cover" />
              ) : (
                <div className="person-mark" aria-hidden="true">
                  {initials(member.nameFr)}
                </div>
              )}
              <span>{pad(i + 1)}</span>
              <h3>{localizedText(member, "name", locale)}</h3>
              {member.titleFr && <p>{localizedText(member, "title", locale)}</p>}
              {member.email && <a href={`mailto:${member.email}`}>{member.email}</a>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
