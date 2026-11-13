import { readDb, mutateDb, newId } from "./db/store";
import type { Bulletin } from "./db/types";

export function isBulletinKind(kind: string): kind is Bulletin["kind"] { return kind === "annonces" || kind === "opportunites"; }
export function allBulletins(kind: Bulletin["kind"]) { return readDb().bulletins.filter((b) => b.kind === kind).sort((a,b) => Number(b.featured)-Number(a.featured) || +new Date(b.publishedAt)-+new Date(a.publishedAt)); }
export function publicBulletins(kind: Bulletin["kind"], archived = false, now = Date.now()) {
  return allBulletins(kind).filter((b) => b.status === "PUBLISHED" && +new Date(b.publishedAt) <= now && Boolean(b.deadline && +new Date(b.deadline) < now) === archived);
}
export function saveBulletin(item: Omit<Bulletin,"id"|"publishedAt"> & {id?: string}) {
  mutateDb((db) => { const existing = db.bulletins.find((b) => b.id === item.id && b.kind === item.kind); if(existing) Object.assign(existing,item); else db.bulletins.push({...item,id:newId("bulletin"),publishedAt:new Date().toISOString()}); });
}
