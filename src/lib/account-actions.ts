"use server";
import { auth, signOut } from "@/auth";
import bcrypt from "bcryptjs";
import { mutateDb, readDb } from "@/lib/db/store";

export async function changePassword(_state: { message: string }, form: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { message: "Reconnectez-vous pour modifier votre mot de passe." };
  const current = String(form.get("current") ?? "");
  const password = String(form.get("password") ?? "");
  if (password.length < 12 || password.length > 72 || Buffer.byteLength(password) > 72) return { message: "Choisissez entre 12 et 72 caractères (72 octets maximum)." };
  if (password !== form.get("confirmation")) return { message: "Les deux nouveaux mots de passe doivent être identiques." };
  const user = readDb().users.find(u => u.email === session.user?.email);
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) return { message: "Le mot de passe actuel est incorrect." };
  if (current === password) return { message: "Choisissez un nouveau mot de passe." };
  const passwordHash = await bcrypt.hash(password, 12);
  try {
    mutateDb(db => {
      const account = db.users.find(u => u.id === user.id);
      if (!account || account.passwordHash !== user.passwordHash) throw new Error("Compte modifié.");
      account.passwordHash = passwordHash;
    });
  } catch {
    return { message: "La modification a échoué. Reconnectez-vous puis réessayez." };
  }
  await signOut({ redirectTo: "/admin/login?passwordChanged=1" });
  return { message: "" };
}
