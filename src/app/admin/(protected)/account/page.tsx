"use client";
import { useActionState } from "react";
import { changePassword } from "@/lib/account-actions";

export default function AccountPage() {
  const [state, action, pending] = useActionState(changePassword, { message: "" });
  return <div className="max-w-xl">
    <p className="a-kicker">Mon compte</p><h1 className="a-title">Sécurité du compte</h1>
    <form action={action} className="a-card mt-8 space-y-5 p-6">
      <p>Choisissez un mot de passe personnel d’au moins 12 caractères. Après la modification, reconnectez-vous avec le nouveau mot de passe.</p>
      <label className="a-label block">Mot de passe actuel<input type="password" name="current" required autoComplete="current-password" className="a-input mt-2" /></label>
      <label className="a-label block">Nouveau mot de passe<input type="password" name="password" required minLength={12} maxLength={72} autoComplete="new-password" className="a-input mt-2" /></label>
      <label className="a-label block">Confirmer le nouveau mot de passe<input type="password" name="confirmation" required minLength={12} maxLength={72} autoComplete="new-password" className="a-input mt-2" /></label>
      {state.message && <p role="alert" className="editor-error">{state.message}</p>}
      <button type="submit" disabled={pending} className="a-btn a-btn-primary">{pending ? "Modification…" : "Modifier mon mot de passe"}</button>
    </form>
  </div>;
}
