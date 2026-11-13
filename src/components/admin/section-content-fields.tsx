"use client";
import { useState } from "react";
import type { Section } from "@/lib/db/types";
import SectionFields from "./section-fields";

export default function SectionContentFields({ section }: { section: Section }) {
  const [language, setLanguage] = useState("fr");
  return <><label className="a-label" htmlFor={`language-${section.id}`}>Langue du contenu</label><select id={`language-${section.id}`} name="language" value={language} onChange={(e) => setLanguage(e.target.value)} className="a-input max-w-xs"><option value="fr">Français</option><option value="ar">العربية</option><option value="en">English</option></select><p className="caption">Enregistrez vos modifications avant de changer de langue.</p><div key={language} dir={language === "ar" ? "rtl" : undefined}><SectionFields section={section} language={language} /></div></>;
}
