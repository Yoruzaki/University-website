import { Fragment, type ReactNode } from "react";

/**
 * Renders a heading in the design's two-voice style: a plain first part and
 * a serif-italic second part (<em>).
 *
 * Editors control it from the admin:
 *  - wrap words in *asterisks* to put exactly those words in italic serif,
 *  - use a line break to force a new line.
 * Without asterisks, the heading is split automatically after the first
 * sentence / colon / comma, or roughly in half for longer titles.
 */
export function Rich({ text, auto = true }: { text?: string | null; auto?: boolean }): ReactNode {
  if (!text) return null;

  if (text.includes("*")) {
    return text.split(/(\*[^*]+\*)/g).map((part, i) =>
      part.startsWith("*") && part.endsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : lines(part, i)
    );
  }

  if (text.includes("\n") || !auto) return lines(text, 0);

  const split = autoSplit(text);
  if (!split) return text;
  return (
    <>
      {split[0]}
      <br />
      <em>{split[1]}</em>
    </>
  );
}

function lines(text: string, key: number) {
  const parts = text.split("\n");
  return (
    <Fragment key={key}>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {p}
        </Fragment>
      ))}
    </Fragment>
  );
}

function autoSplit(text: string): [string, string] | null {
  const t = text.trim();
  // 1) after a sentence end / colon / em dash, if something meaningful follows
  const strong = /^(.{6,}?[.!?:—])\s+(.{4,})$/.exec(t);
  if (strong) return [strong[1], strong[2]];
  // 2) after the first comma
  const comma = /^(.{8,}?,)\s+(.{4,})$/.exec(t);
  if (comma) return [comma[1], comma[2]];
  // 3) roughly in half by words
  const words = t.split(/\s+/);
  if (words.length < 4) return null;
  const cut = Math.ceil(words.length / 2);
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
}

/** Two-digit index: 1 → "01". */
export const pad = (n: number) => String(n).padStart(2, "0");
