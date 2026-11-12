import Link from "next/link";

export type IconName = "arrow" | "search" | "menu" | "close" | "chevron" | "map" | "mail" | "phone" | "play" | "down";

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 19 19 5" />
        <path d="M9 5h10v10" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    menu: <path d="M4 8h16M4 16h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    chevron: <path d="m8 10 4 4 4-4" />,
    map: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    phone: <path d="M6.6 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.1 6.1l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />,
    play: <path d="m9 7 8 5-8 5Z" />,
    down: (
      <>
        <path d="M12 4v15" />
        <path d="m6 13 6 6 6-6" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

/** "01 —— LABEL" row that opens every section in the design. */
export function SectionLabel({
  n,
  children,
  light = false,
}: {
  n?: string;
  children?: React.ReactNode;
  light?: boolean;
}) {
  if (!n && !children) return null;
  return (
    <div className={`section-label ${light ? "section-label--light" : ""}`}>
      {n && <span>{n}</span>}
      <i />
      {children}
    </div>
  );
}

/** Underlined text link with the diagonal arrow. */
export function ArrowLink({
  href,
  children,
  inverse = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  inverse?: boolean;
  className?: string;
}) {
  const external = /^https?:\/\//.test(href) || href.startsWith("mailto:");
  const cls = `arrow-link ${inverse ? "arrow-link--inverse" : ""} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      <Icon name="arrow" size={17} />
    </>
  );
  return external ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/** Kept for any older imports. */
export function Eyebrow({ children }: { children: React.ReactNode; tone?: "ink" | "cream" }) {
  return <p className="chapter mb-4">{children}</p>;
}
