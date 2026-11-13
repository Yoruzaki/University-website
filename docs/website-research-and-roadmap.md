# ENSF website research and improvement brief

Research date: 13 November 2026. Scope: public university pages, the local homepage, repository content and implementation. This is a comparative content and product review, not a completed accessibility, security or performance audit. No application code was changed.

## Recommendation

Build a credible public school website with a useful student information hub. Preserve the forest identity, but put admissions, academic notices, timetables and services ahead of repeated promotional sections. Publish only verified institutional facts. Connect existing academic systems before considering a new student portal.

## Evidence from Algerian institutions

| Reference | Observed strength | Application to ENSF |
| --- | --- | --- |
| [ESI Alger](https://www.esi.dz/) and [studies](https://www.esi.dz/etudes-a-lesi/) | Study structure, programme specialisations, academic contacts, timetables, doctoral guidance, directories and services | Give each academic pathway a complete page and an accountable contact |
| [ESI Sidi Bel Abbès](https://www.esi-sba.dz/) | Search-indexed content separates announcements, news, pedagogical timetables and platform access | Separate operational notices from publicity; make the academic year explicit |
| [ENSA sitemap](https://www.ensa.dz/fr/plan-du-site/) and [homepage](https://www.ensa.dz/fr/) | School governance, graduation, postgraduate studies, departments, field facilities and laboratories | Closest disciplinary comparison: show field teaching, equipment and forestry research |
| [Tlemcen](https://www.univ-tlemcen.dz/fr) | Digital services, learning platforms, research repositories, libraries and mobility | Provide a curated services directory with purpose and help information |
| [Sétif 1](https://fr.univ-setif.dz/) | Notices, events, scholarships, campus information and student procedures | Surface deadlines, practical campus guidance and opportunities |
| [USTHB ENT](https://ent.usthb.dz/) | Student requests, timetables, account assistance and links to mail/Moodle | A service link needs a clear purpose and support route, not only a login button |

Limitations: ESI-SBA's direct homepage fetch returned only an image, so its detailed comparison uses search-indexed official content. Some ENSA pages and hnsf.dz timed out; this is not proof that they are unavailable to users. Public listings do not verify authenticated workflows. Other institutions' programmes and procedures must not be copied as ENSF facts.

## Confirmed local findings

- Five published content pages, three news entries, four programme records, two lab records and four faculty entries. These counts describe the project database, not verified school totals.
- Student space, e-learning and library destinations are empty in `src/lib/site-links.ts`; the interface displays a coming-soon message.
- The two document URLs return HTTP 404: `/documents/reglement-interieur.pdf` and `/documents/dossier-inscription-master.pdf`.
- All five page titles lack Arabic/English values. Only one of the homepage's twelve sections has Arabic and English section data; the other four pages have no translated sections. French fallback is implemented. Interface translations and RTL support already exist.
- Programme pages are short overview cards without complete individual course information. Research cards describe themes rather than complete laboratory profiles.
- Homepage content claims six labs while the database holds two lab records. This inconsistency needs editorial verification.
- Social links in the footer point to `#`. Contact phone uses a placeholder-looking number. Named faculty, quotations, partners and news require school confirmation.
- Homepage contains twelve sections, including several mission/research/promotional blocks. Academic notices and timetables have no dedicated content type.
- Search covers published page section text and news, but does not independently index programme, faculty, lab or document records.
- Generic content routes use shared metadata; per-page metadata generation, language alternate links and sitemap generation were not found in the inspected source.
- Roles are represented in the model, but inspected server actions require a session without enforcing role-specific publishing permissions.
- Content storage directly overwrites a JSON file and returns an empty database on JSON parse failure. Before institutional production use, add durable storage, recovery and a deployment-compatible persistence strategy.

## Institutional accuracy comes first

The project says "since 1986". A [MESRS-hosted creation decree](https://services.mesrs.dz/DEJA/recueil/B34FR.pdf), executive decree 20-167 dated 27 June 2020, establishes the national higher school of forests in Khenchela. Its indexed text supports 2020 as the legal creation date. A predecessor history may exist, but 1986 needs evidence and a clear distinction from legal creation. Direct PDF retrieval timed out during this review; confirm the full document with the school before editing official history.

Maintain a fact sheet approved by the school: legal name in three languages, creation/history, approved diplomas, admission rules for the current year, departments, laboratories, staff, address, contact details and approved images. Do not invent admissions thresholds, numbers, testimonials or partnerships to fill layouts.

## Proposed navigation

Primary: L'École / Formations / Admissions / Scolarité / Recherche / Vie étudiante.

Utility: FR–AR–EN / Recherche / Services numériques / Contact.

- L'École: presentation, director, governance, departments, directory, access.
- Formations: verified programmes and full programme detail pages.
- Admissions: new baccalaureate holders, other applicable entry routes, steps, documents, deadlines, FAQ, contact.
- Scolarité: notices, academic calendar, timetables, exams, administrative procedures, internships, downloads.
- Recherche: actual labs, people, projects, publications, doctoral information and scientific events.
- Vie étudiante: clubs, field activities, facilities, health and welfare guidance, transport and accommodation information where applicable.
- Footer: opportunities, recruitment, procurement, official links, accessibility, privacy information, contact and sitemap.

## Homepage order

1. Compact header with visible service access.
2. One authentic campus/field hero, a concise school description, and clear Formations / Admissions actions.
3. Quick access: timetables, academic calendar, Moodle, student platform, library, documents. Only expose real destinations.
4. Important notices, each with audience, publication date, deadline and status.
5. Verified programme overview with links to complete pages.
6. News and upcoming events as distinct lists.
7. One evidence-based research or fieldwork story.
8. Short school introduction and verified statistics labelled with their reporting year.
9. Contact, campus access and footer.

Move full faculty lists, institutional history and extended galleries to their own pages. Use real forestry activity as the visual signature: field measurements, nurseries, laboratory practice and projects, with confirmed provenance and useful captions.

## Required content templates

Programme: official title and diploma, duration, language, prerequisites, admission route, current academic year, learning outcomes, semester modules, fieldwork/internships, validated career examples, syllabus, responsible contact and review date.

Procedure: who it applies to, prerequisites, numbered steps, documents, deadline, submission destination, expected processing time if confirmed, responsible office and last update.

Notice: audience, category, academic year, publication date, deadline/time when relevant, attachment, owner, active/closed state and archive. Expired notices leave the urgent area automatically.

Document: title, category, language, academic year, version date, file size/type, accessible HTML explanation and actual file. Do not rely solely on scanned images for essential instructions.

Laboratory: official name, director, team, research axes, current projects, selected publications, facilities, opportunities and contact. Theme cards must not imply accredited laboratories unless confirmed.

## Operational and technical quality

- Use Arabic and French as complete first-class versions. Scope English deliberately and provide clear language availability rather than silently showing French under English labels.
- Extend search to documents, programmes and people with result types and useful filters. Keep private academic records outside public search.
- Use a managed database or equivalent durable store for production, with tested backups and restoration. Store uploads durably; validate files and links.
- Add editor/publisher permissions, preview, revisions, review dates and content ownership. Translation completeness should be visible before publishing.
- Plan secure production authentication and secret configuration; replace sample access and review login protection before deployment.
- Add unique page titles/descriptions, canonical URLs, language alternates and sitemap. Confirm indexing on the deployed domain.
- Target [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/): keyboard operation, focus management in menus/search, contrast, form labels, useful image text, zoom and Arabic reading order. Existing skip link and reduced-motion CSS are useful foundations, not proof of conformance.
- Measure a production build on mobile. Target [Core Web Vitals](https://web.dev/articles/vitals): LCP <= 2.5 seconds, INP <= 200 ms, CLS <= 0.1 at the 75th percentile. These are targets, not measured current results.

## Delivery sequence and acceptance

Phase 1 — Accuracy and structure: approved fact sheet, real service destinations, working downloads, complete core language content, revised navigation and homepage. Acceptance: no placeholder claims or dead primary actions.

Phase 2 — Student usefulness: admissions, programme pages, student hub, timetable/calendar resources, procedures, documents, notices and events. Acceptance: representative users can find an admission checklist, their timetable, an exam notice, an internship form and a service contact within two navigation steps from the homepage.

Phase 3 — Academic depth: research profiles, directory, student life, partnerships and opportunities. Acceptance: every published profile has an accountable owner and evidence-based content.

Phase 4 — Production readiness: durable storage, publishing workflow, backups, authentication review, accessibility testing, performance measurement and deployment checks. Acceptance: restore test succeeds; editor permissions work; keyboard and Arabic checks pass; all published links/downloads are checked.

Conduct task testing with 5–8 representative applicants/students/staff. Record task completion, time, wrong turns and unanswered questions. The two-step target and sample size are proposed project criteria, not findings from completed user research.
