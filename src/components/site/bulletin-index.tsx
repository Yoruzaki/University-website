import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/i18n";
import type { Bulletin } from "@/lib/db/types";
import { campusText } from "@/lib/university";
import PageBanner from "./page-banner";
import BulletinBoard from "../sections/bulletin-board";

export default async function BulletinIndex({kind,params,searchParams}:{kind:Bulletin["kind"];params:Promise<{locale:string}>;searchParams:Promise<{archives?:string}>}) {
  const {locale}=await params;if(!isValidLocale(locale))notFound();const archive=(await searchParams).archives==="1";
  return <><PageBanner locale={locale} title={kind==="annonces"?campusText(locale,"Annonces importantes","إعلانات مهمة","Important notices"):campusText(locale,"Opportunités","فرص","Opportunities")} image="/photos/salle-informatique.jpg"/><div className="wrap campus-tabs"><Link aria-current={!archive?"page":undefined} href={`/${locale}/${kind}`}>{campusText(locale,"En cours","الحالية","Current")}</Link><Link aria-current={archive?"page":undefined} href={`/${locale}/${kind}?archives=1`}>{campusText(locale,"Archives","الأرشيف","Archives")}</Link></div><BulletinBoard kind={kind} locale={locale} archive={archive} full/></>;
}
