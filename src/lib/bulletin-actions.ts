"use server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isBulletinKind, saveBulletin } from "./bulletins";

export async function saveBulletinAction(form: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!["EDITOR","SUPER_ADMIN"].includes((session.user as {role?:string}).role || "")) throw new Error("Accès réservé aux éditeurs.");
  const f = (key:string) => String(form.get(key)||"").trim();
  const kind = f("kind"); if(!isBulletinKind(kind)) throw new Error("Rubrique inconnue.");
  if(!f("titleFr") || !f("summaryFr")) throw new Error("Titre et description obligatoires.");
  const url = f("url");
  if(url && !/^https?:\/\/[^\s]+$/i.test(url) && !/^\/(?!\/)[^\s]*$/.test(url)) throw new Error("Utilisez une adresse https://… ou /…");
  const deadline = f("deadline") ? new Date(`${f("deadline")}T23:59:59.999+01:00`) : undefined;
  if(deadline && !Number.isFinite(+deadline)) throw new Error("Date invalide.");
  saveBulletin({id:f("id")||undefined,kind,titleFr:f("titleFr"),titleAr:f("titleAr"),titleEn:f("titleEn"),summaryFr:f("summaryFr"),summaryAr:f("summaryAr"),summaryEn:f("summaryEn"),category:f("category"),audience:f("audience"),url,deadline:deadline?.toISOString(),featured:form.has("featured"),status:f("status")==="PUBLISHED"?"PUBLISHED":"DRAFT"});
  revalidatePath("/","layout");redirect(`/admin/bulletins/${kind}?saved=1`);
}
