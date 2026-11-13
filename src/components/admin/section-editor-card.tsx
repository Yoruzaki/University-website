import type { Section } from "@/lib/db/types";
import { sectionLibrary } from "@/components/sections/registry";
import SectionContentFields from "./section-content-fields";
import {
  updateSectionFieldsAction,
  deleteSectionAction,
  moveSectionAction,
} from "@/lib/actions";

export default function SectionEditorCard({
  pageId,
  section,
  position,
  total,
}: {
  pageId: string;
  section: Section;
  position: number;
  total: number;
}) {
  const meta = sectionLibrary.find((s) => s.type === section.type);
  const update = updateSectionFieldsAction.bind(null, pageId, section.id, section.type);
  const remove = deleteSectionAction.bind(null, pageId, section.id);
  const moveUp = moveSectionAction.bind(null, pageId, section.id, "up");
  const moveDown = moveSectionAction.bind(null, pageId, section.id, "down");

  return (
    <details className="group a-card transition-colors open:border-forest-800">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-[var(--mint)]">
        <div className="flex items-center gap-5">
          <span className="flex h-10 w-10 items-center justify-center bg-forest-800 font-[var(--display)] text-[11px] font-semibold tabular-nums text-lime">
            {String(position + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="font-[var(--display)] text-[15px] font-semibold text-navy">{meta?.label ?? section.type}{section.hidden ? " · Masquée" : ""}</p>
            <p className="mt-0.5 text-xs text-ink-text-muted">{meta?.description}</p>
          </div>
        </div>
        <span className="text-forest-800 transition-transform group-open:rotate-180">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <path d="m8 10 4 4 4-4" />
          </svg>
        </span>
      </summary>

      <div className="border-t border-[#dce5e0] px-6 py-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex gap-2">
            <form action={moveUp}>
              <button
                type="submit"
                disabled={position === 0}
                className="a-btn a-btn-ghost a-btn-sm disabled:opacity-30"
              >
                ↑ Monter
              </button>
            </form>
            <form action={moveDown}>
              <button
                type="submit"
                disabled={position === total - 1}
                className="a-btn a-btn-ghost a-btn-sm disabled:opacity-30"
              >
                ↓ Descendre
              </button>
            </form>
          </div>
          <form action={remove}>
            <button type="submit" className="a-btn-danger">
              Supprimer la section
            </button>
          </form>
        </div>

        <form action={update} className="space-y-5">
          <div className="w-48">
            <label className="a-label">Fond</label>
            <select
              name="variant"
              defaultValue={section.variant}
              className="a-input mt-2"
            >
              <option value="LIGHT">Clair</option>
              <option value="DARK">Sombre</option>
            </select>
          </div>

          <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="hidden" defaultChecked={section.hidden} /> Masquer cette section sur le site</label>
          <SectionContentFields section={section} />

          <button
            type="submit"
            className="a-btn a-btn-primary"
          >
            Enregistrer la section
          </button>
        </form>
      </div>
    </details>
  );
}
