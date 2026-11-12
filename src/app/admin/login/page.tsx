"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/components/ui/photo";
import { Icon } from "@/components/ui/chrome";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });
      if (res?.error) {
        setError("Identifiants incorrects.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
      {/* Visual side, same language as the site hero */}
      <div className="relative hidden overflow-hidden bg-forest-800 text-white lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero-image" src={IMAGES.pines} alt="" />
        <div className="hero-shade" />
        <div className="relative z-10 flex h-full flex-col justify-between p-14">
          <div className="identity">
            <span className="identity-logo">
              <Image src="/logo-ensf.jpg" alt="" width={44} height={44} className="cover" />
            </span>
            <span>
              <b>ENSF</b>
              <small>
                École Nationale Supérieure
                <br />
                des Forêts — Khenchela
              </small>
            </span>
          </div>
          <div>
            <div className="hero-eyebrow !mb-6">Espace administration</div>
            <h1 className="font-[var(--display)] text-[clamp(3rem,5vw,5rem)] font-medium leading-[0.92] tracking-[-0.065em]">
              Faire vivre
              <br />
              <em className="font-serif font-normal tracking-[-0.03em]">le site de l&apos;école.</em>
            </h1>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center bg-warm px-6 py-16" style={{ background: "var(--warm)" }}>
        <div className="w-full max-w-sm">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <Image src="/logo-ensf.jpg" alt="" width={44} height={44} className="rounded-full" />
            <b className="font-[var(--display)] text-xl text-forest-800">ENSF</b>
          </div>
          <p className="a-kicker">Connexion</p>
          <h2 className="a-title">
            Bienvenue.
            <br />
            <em>Identifiez-vous.</em>
          </h2>

          <form action={handleSubmit} className="mt-10 space-y-6">
            <div>
              <label className="a-label" htmlFor="email">
                Adresse e-mail
              </label>
              <input id="email" name="email" type="email" required autoComplete="username" className="a-input mt-2" />
            </div>
            <div>
              <label className="a-label" htmlFor="password">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="a-input mt-2"
              />
            </div>
            {error && (
              <p role="alert" className="border-s-2 border-[#a4261b] bg-[#fbe9e7] px-4 py-3 text-sm text-[#a4261b]">
                {error}
              </p>
            )}
            <button type="submit" disabled={pending} className="a-btn a-btn-primary w-full !min-h-[54px] disabled:opacity-60">
              {pending ? "Connexion…" : "Se connecter"}
              <Icon name="arrow" size={17} />
            </button>
          </form>
          <Link href="/fr" className="a-link mt-10">
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}
