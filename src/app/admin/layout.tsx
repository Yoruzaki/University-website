import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Administration · ENSF Khenchela",
};

/** Root shell for the whole /admin segment (login included). No auth
 * check here — that lives in (protected)/layout.tsx so the login page
 * itself never redirects to itself. */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="antialiased">
      <body className="admin-body min-h-screen">{children}</body>
    </html>
  );
}
