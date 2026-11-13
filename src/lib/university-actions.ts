"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { saveEvent, saveService, removeUniversityItem } from "./university";

async function requireEditor() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!["SUPER_ADMIN", "EDITOR"].includes((session.user as { role?: string }).role || "")) throw new Error("Accès réservé aux éditeurs.");
}
function safeUrl(value: string) {
  if (!value) return "";
  if (!/^https?:\/\/[^\s]+$/i.test(value)) throw new Error("Utilisez une adresse complète https://…");
  return value;
}
export async function saveServiceAction(form: FormData) {
  await requireEditor();
  const f = (key: string) => String(form.get(key) || "").trim();
  if (!f("titleFr")) throw new Error("Le titre est obligatoire.");
  saveService({ id: f("id") || undefined, titleFr: f("titleFr"), titleAr: f("titleAr"), titleEn: f("titleEn"), summaryFr: f("summaryFr"), summaryAr: f("summaryAr"), summaryEn: f("summaryEn"), url: safeUrl(f("url")), category: f("category"), enabled: form.has("enabled"), order: Number(f("order")) || 0 });
  revalidatePath("/", "layout");
  redirect("/admin/services?saved=1");
}
export async function saveEventAction(form: FormData) {
  await requireEditor();
  const f = (key: string) => String(form.get(key) || "").trim();
  const startsAt = new Date(f("startsAt") + "+01:00");
  const endsAt = f("endsAt") ? new Date(f("endsAt") + "+01:00") : undefined;
  if (!f("titleFr") || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(f("slug")) || !Number.isFinite(+startsAt)) throw new Error("Vérifiez le titre, l’adresse et la date.");
  if (endsAt && (!Number.isFinite(+endsAt) || +endsAt < +startsAt)) throw new Error("La fin doit suivre le début.");
  const image = f("coverImage");
  if (image && !/^\/(?!\/)/.test(image)) safeUrl(image);
  saveEvent({ id: f("id") || undefined, slug: f("slug"), titleFr: f("titleFr"), titleAr: f("titleAr"), titleEn: f("titleEn"), summaryFr: f("summaryFr"), summaryAr: f("summaryAr"), summaryEn: f("summaryEn"), bodyFr: f("bodyFr"), category: f("category"), location: f("location"), startsAt: startsAt.toISOString(), endsAt: endsAt?.toISOString(), registrationUrl: safeUrl(f("registrationUrl")), coverImage: image, status: f("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT", featured: form.has("featured") });
  revalidatePath("/", "layout");
  redirect("/admin/events?saved=1");
}
export async function removeUniversityItemAction(collection: "services" | "events", id: string) {
  await requireEditor();
  if (collection !== "services" && collection !== "events") throw new Error("Collection inconnue.");
  removeUniversityItem(collection, id);
  revalidatePath("/", "layout");
}
