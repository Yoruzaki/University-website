/**
 * A tasteful stand-in for real photography. Renders a duotone
 * forest-toned gradient with a small caption naming exactly what
 * photo should be uploaded there via the admin media library —
 * so empty content still looks intentional, not broken.
 */
export default function PlaceholderImage({
  caption,
  tone = "forest",
  className = "",
}: {
  caption: string;
  tone?: "forest" | "paper";
  className?: string;
}) {
  const gradients: Record<string, string> = {
    forest:
      "linear-gradient(145deg, #1f4136 0%, #163027 45%, #0b1613 100%)",
    paper:
      "linear-gradient(145deg, #efeadd 0%, #e3ead9 55%, #c9d8cd 100%)",
  };
  const textTone = tone === "forest" ? "var(--cream-text-muted)" : "var(--ink-text-muted)";

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: gradients[tone] }}
      role="img"
      aria-label={caption}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.07]"
        preserveAspectRatio="none"
        viewBox="0 0 400 300"
      >
        <path d="M0 300 L60 160 L110 230 L170 90 L230 220 L280 120 L340 260 L400 150 L400 300 Z" fill="currentColor" style={{ color: textTone }} />
      </svg>
      <span
        className="absolute bottom-3 left-3 right-3 text-[11px] tracking-wide"
        style={{ color: textTone }}
      >
        {caption}
      </span>
    </div>
  );
}
