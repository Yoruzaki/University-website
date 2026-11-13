import { readDb, mutateDb, newId } from "./db/store";
import type { DigitalService, UniversityEvent } from "./db/types";
import type { Locale } from "./i18n";

export function localHref(value: string | undefined, locale: Locale): string | undefined {
  const url = value?.trim();
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  if (/^\/(?!\/)/.test(url)) {
    return /^\/(fr|ar|en)(\/|$)/.test(url) ? url.replace(/^\/(fr|ar|en)/, `/${locale}`) : `/${locale}${url}`;
  }
  return undefined;
}

export function services(all = false) {
  return readDb().services.filter((s) => all || s.enabled).sort((a, b) => a.order - b.order);
}

export function events(all = false) {
  return readDb().events.filter((e) => all || e.status === "PUBLISHED")
    .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));
}

export function upcomingEvents(limit?: number) {
  const items = events().filter((e) => +new Date(e.endsAt || e.startsAt) >= Date.now())
    .sort((a, b) => Number(b.featured) - Number(a.featured) || +new Date(a.startsAt) - +new Date(b.startsAt));
  return limit ? items.slice(0, limit) : items;
}

export function saveService(item: Omit<DigitalService, "id"> & { id?: string }) {
  mutateDb((db) => {
    const existing = db.services.find((s) => s.id === item.id);
    if (existing) Object.assign(existing, item);
    else db.services.push({ ...item, id: newId("service") });
  });
}

export function saveEvent(item: Omit<UniversityEvent, "id" | "createdAt"> & { id?: string }) {
  mutateDb((db) => {
    if (db.events.some((e) => e.slug === item.slug && e.id !== item.id)) throw new Error("Cette adresse est déjà utilisée par un événement.");
    const existing = db.events.find((e) => e.id === item.id);
    if (existing) Object.assign(existing, item);
    else db.events.push({ ...item, id: newId("event"), createdAt: new Date().toISOString() });
  });
}

export function removeUniversityItem(collection: "services" | "events", id: string) {
  mutateDb((db) => {
    if (collection === "services") db.services = db.services.filter((item) => item.id !== id);
    else db.events = db.events.filter((item) => item.id !== id);
  });
}

export function eventDate(value: string, locale: Locale, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) {
  return new Date(value).toLocaleDateString(locale === "ar" ? "ar-DZ" : locale, { ...options, timeZone: "Africa/Algiers" });
}

export function campusText(locale: Locale, fr: string, ar: string, en: string) { return locale === "ar" ? ar : locale === "en" ? en : fr; }
