import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import AdminNav from "@/components/admin/admin-nav";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="admin-shell flex min-h-screen">
      <aside className="admin-sidebar sticky top-0 flex h-screen w-72 shrink-0 flex-col justify-between bg-forest-800 px-7 py-8 text-white">
        <div>
          <Link href="/admin" className="identity mb-12">
            <span className="identity-logo">
              <Image src="/logo-ensf.jpg" alt="" width={44} height={44} className="cover" />
            </span>
            <span>
              <b>ENSF</b>
              <small>
                Espace
                <br />
                administration
              </small>
            </span>
          </Link>
          <p className="mb-4 flex items-center gap-3 font-[var(--display)] text-[9px] font-semibold uppercase tracking-[0.17em] text-white/60">
            <span className="h-px w-8 bg-lime" />
            Contenu du site
          </p>
          <AdminNav />
        </div>

        <div className="space-y-5">
          <a
            href="/fr"
            target="_blank"
            className="flex items-center justify-between border border-white/25 px-4 py-3 font-[var(--display)] text-[11px] font-semibold transition-colors hover:bg-white hover:text-forest-800"
          >
            Voir le site <span>↗</span>
          </a>
          <div className="border-t border-white/15 pt-5">
            <p className="truncate text-xs text-white/60">{session.user.email}</p>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="mt-2 border-b border-current pb-1 font-[var(--display)] text-[11px] font-semibold text-lime hover:text-white"
              >
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-8 py-12 lg:px-14">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
