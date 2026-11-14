import fs from 'node:fs';
import crypto from 'node:crypto';
const file = new URL('../data/db.json', import.meta.url);
const db = JSON.parse(fs.readFileSync(file, 'utf8'));
const id = (prefix) => `${prefix}_${crypto.randomUUID().replaceAll('-', '')}`;
const now = new Date().toISOString();
const section = (type, dataFr, hidden = false) => ({ id: id('sec'), type, variant: 'LIGHT', hidden, order: 0, dataFr });
function page(slug, titleFr, sections, bannerImage = '/photos/sortie-foret-garde.jpg') {
  const existing = db.pages.find(p => p.slug === slug);
  if (existing) return existing;
  const p = { id: id('page'), slug, titleFr, status: 'PUBLISHED', sections, bannerImage, createdAt: now, updatedAt: now };
  sections.forEach((s, i) => { s.pageId = p.id; s.order = i; });
  db.pages.push(p); return p;
}
const resources = (eyebrow, title, intro, items, image) => section('RESOURCE_GRID', { eyebrow, title, intro, items: items.map(([tag, title, body, href]) => ({ tag, title, body, href })), image });
db.events ||= [];
db.services ||= [];
const platforms = [
 ['elearning','E-learning','التعليم الإلكتروني','E-learning','Cours, supports pédagogiques et activités d’apprentissage en ligne.','Pédagogie'],
 ['bibliotheque','Bibliothèque','المكتبة','Library','Catalogue, horaires, services de prêt et ressources documentaires.','Documentation'],
 ['dspace','DSpace','المستودع الرقمي','DSpace','Mémoires, thèses et publications scientifiques de l’établissement.','Recherche'],
 ['edx','EDX / MOOC','دورات مفتوحة','EDX / MOOCs','Formations ouvertes et cours en ligne pour développer vos compétences.','Formation'],
 ['sndl','SNDL','المكتبة العلمية الرقمية','SNDL','Accès aux ressources scientifiques et aux bases de données documentaires.','Recherche'],
 ['progres','PROGRES / Espace étudiant','فضاء الطالب','Student portal','Accès aux services de scolarité et au suivi du parcours universitaire.','Scolarité'],
 ['messagerie','Messagerie institutionnelle','البريد الإلكتروني','Institutional email','La messagerie de la communauté universitaire.','Communication'],
 ['iltc','ILTC','مركز التعليم المكثف للغات','ILTC','Intensive Language Teaching Center — Centre d’enseignement intensif des langues.','Langues'],
];
const platformUrls = { elearning:'https://elearning.auresnix.com/', bibliotheque:'https://library.ensf.dz/', dspace:'https://dspace.auresnix.com/', edx:'https://edx.auresnix.com/', sndl:'https://www.sndl.cerist.dz/', progres:'https://progres.mesrs.dz/webetu/' };
const platformLogos = { elearning:'/logos/moodle.svg', bibliotheque:'/logos/library.svg', sndl:'/logos/sndl.jpg', progres:'/logos/progres.png', edx:'/logos/edx.svg', dspace:'/logos/dspace.svg', iltc:'/logos/iltc.png' };
for (const [key,titleFr,titleAr,titleEn,summaryFr,category] of platforms) {
 if (!db.services.some(s => s.id === key)) db.services.push({ id:key,titleFr,titleAr,titleEn,summaryFr,category,url:platformUrls[key] || '',logo:platformLogos[key] || '/logo-ensf.jpg',enabled:true,order:db.services.length });
}
page('services','Services numériques',[
 section('SERVICE_GRID',{eyebrow:'Votre campus connecté',title:'Les ressources, *à portée de main.*',intro:'Enseignement, documentation, recherche et services universitaires : retrouvez vos accès dans un même espace.'}),
 resources('Accompagnement','Besoin d’un *coup de main ?*','Les informations de connexion et les contacts d’assistance seront complétés pour chaque service.',[['Assistance','Première connexion','Compte institutionnel, accès aux cours et ressources documentaires.','/contact'],['Documentation','Guides et formulaires','Retrouvez les ressources administratives de l’école.','/documents']])
],'/photos/salle-informatique.jpg');
page('vie-etudiante','Vie étudiante',[
 resources('Vivre le campus','Apprendre. Partager. *S’engager.*','Une place pour les initiatives étudiantes, les activités de terrain et la vie quotidienne du campus.',[
 ['Communauté','Clubs & associations','Initiatives scientifiques, culturelles et environnementales.','/vie-etudiante/clubs'],['Expériences','Sorties & vie de terrain','Découvrir les écosystèmes et apprendre par la pratique.','/vie-etudiante/terrain'],['Campus','Sport & culture','Activités sportives, rencontres et expression culturelle.','/vie-etudiante/sport-culture'],['Accompagnement','Santé & accompagnement','Informations utiles et contacts des services compétents.','/vie-etudiante/accompagnement'],['Pratique','Hébergement & transport','Repères pour préparer votre vie à Khenchela.','/vie-etudiante/vie-pratique'],['Initiatives','Entrepreneuriat & innovation','Accompagnement des idées et des projets étudiants.','/vie-etudiante/entrepreneuriat']
 ],'/photos/etudiants-badges.jpg'),
 section('GALLERY',{eyebrow:'Le campus en images',title:'Une école qui se vit *ensemble.*',intro:'Espaces de travail et activités universitaires.',images:[{src:'/photos/salle-informatique.jpg',caption:'Espaces numériques'},{src:'/photos/bibliotheque-livres.jpg',caption:'Bibliothèque'},{src:'/photos/tp-laboratoire.jpg',caption:'Travaux pratiques'}]}),
 section('EVENTS_LIST',{eyebrow:'Se retrouver',title:'Les rendez-vous *du campus.*',count:3})
],'/photos/etudiants-badges.jpg');
const leafPages = [
 ['clubs','Clubs & associations','Clubs, activités et initiatives de la communauté étudiante.',['Clubs scientifiques','Culture & solidarité','Environnement & bénévolat']],
 ['terrain','Sorties & vie de terrain','Sorties pédagogiques, consignes et informations pratiques pour apprendre sur le terrain.',['Sorties pédagogiques','Consignes & équipement','Carnets de terrain']],
 ['sport-culture','Sport & culture','Un espace pour les activités et les initiatives de la communauté étudiante.',['Activités sportives','Ateliers culturels','Compétitions & rencontres']],
 ['accompagnement','Santé & accompagnement','Retrouvez ici les informations validées par les services d’accompagnement.',['Santé & prévention','Accompagnement étudiant','Accessibilité']],
 ['vie-pratique','Vie pratique à Khenchela','Les modalités et contacts seront publiés après validation par les services concernés.',['Hébergement','Restauration','Transport & accès']],
 ['entrepreneuriat','Entrepreneuriat & innovation','Un espace dédié aux idées, aux projets et aux possibilités d’accompagnement.',['Incubation & accompagnement','Projets étudiants','Appels à projets']],
];
for (const [slug,title,intro,titles] of leafPages) page(`vie-etudiante/${slug}`, title,[resources('Vie étudiante',title,intro,titles.map(t=>['Campus',t,'Les informations détaillées seront publiées prochainement.'])),section('EVENTS_LIST',{title:'Rencontres & *rendez-vous.*',count:3})]);
page('scolarite','Scolarité & ressources étudiantes',[
 resources('Au quotidien','Les repères de *votre parcours.*','Retrouvez les informations pédagogiques et les ressources utiles à votre scolarité.',[
 ['Organisation','Emplois du temps','Cours, groupes et salles, par niveau de formation.','/scolarite/emplois-du-temps'],['Dates clés','Calendrier universitaire','Périodes pédagogiques, examens et vacances.','/scolarite/calendrier'],['Évaluation','Examens & soutenances','Plannings, consignes et informations pratiques.','/scolarite/examens'],['Démarches','Procédures administratives','Réinscription, demandes et formulaires.','/scolarite/demarches'],['Expérience','Stages & insertion','Conventions, démarches et accompagnement.','/scolarite/stages'],['Documents','Téléchargements','Formulaires et documents utiles.','/documents']
 ]),section('NEWS_LIST',{eyebrow:'Rester informé',title:'Les dernières *actualités.*',count:4}),section('SERVICE_GRID',{eyebrow:'Accès directs',title:'Vos services *en ligne.*'})
],'/photos/salle-informatique.jpg');
for (const [slug,title,items] of [
 ['emplois-du-temps','Emplois du temps',['Par niveau','Par groupe','Modifications de planning']],['calendrier','Calendrier universitaire',['Rentrée & enseignements','Sessions d’examens','Vacances universitaires']],['examens','Examens & soutenances',['Planning des examens','Consignes','Calendrier des soutenances']],['demarches','Démarches administratives',['Réinscription','Demandes administratives','Documents à fournir']],['stages','Stages & insertion',['Recherche de stage','Convention & dossier','Rapport & évaluation']]
]) page(`scolarite/${slug}`,title,[resources('Scolarité',title,'Les informations de l’année universitaire seront ajoutées après validation par la scolarité.',items.map(t=>['Scolarité',t,'Informations et documents à venir.']))],'/photos/salle-informatique.jpg');
page('admissions','Admissions',[
 resources('Préparer votre arrivée','Votre prochain chapitre *commence ici.*','Retrouvez les modalités officielles d’accès, les étapes et les contacts pour préparer votre candidature.',[
 ['Orientation','Nouveaux bacheliers','Conditions d’accès et procédure d’orientation de l’année en cours.'],['Candidature','Dossier & inscription','Liste des pièces, calendrier et modalités de dépôt.'],['Parcours','Nos formations','Découvrez les cycles présentés par l’école.','/programmes'],['Accompagnement','Questions & contact','Contactez l’école pour les modalités applicables à votre situation.','/contact']
 ]),resources('Avant de candidater','Les informations *à vérifier.*','Les dates, conditions et seuils officiels seront renseignés pour chaque campagne.',[['Conditions','Éligibilité','Séries du baccalauréat et conditions officielles.'],['Calendrier','Dates clés','Ouverture, dépôt et confirmation de l’inscription.'],['Documents','Pièces du dossier','Documents demandés et modalités de transmission.']])
]);
page('documents','Documents & formulaires',[resources('Ressources','Les documents *essentiels.*','Les documents validés seront rassemblés dans cet espace.',[['Scolarité','Inscription & réinscription','Formulaires et listes des pièces à fournir.'],['Vie étudiante','Règlements & guides','Règlement intérieur et guides pratiques.'],['Stages','Conventions & rapports','Documents de stage et fiches de suivi.']]),section('DOWNLOADS',{eyebrow:'Téléchargements',title:'Bibliothèque de documents'})],'/photos/bibliotheque-livres.jpg');
page('recherche/ressources','Ressources de recherche',[section('SERVICE_GRID',{eyebrow:'Science & documentation',title:'Explorer, apprendre, *publier.*',intro:'DSpace, SNDL, EDX et ressources numériques pour la communauté scientifique.'}),resources('Recherche','Projets & *opportunités.*','Cet espace est prêt à accueillir les informations de la recherche.',[['Projets','Appels à projets','Campagnes et modalités de candidature.'],['Doctorat','Formation doctorale','Informations et contacts de la formation doctorale.'],['Publications','Production scientifique','Publications et résultats des équipes de recherche.']])],'/photos/labo-microscopes.jpg');
const home = db.pages.find(p => p.slug === '');
db.bulletins ||= [];
for (const [type,title,eyebrow,intro] of [['ANNOUNCEMENTS','Les informations *à retenir.*','Annonces importantes','Inscriptions, examens et informations pratiques : les avis essentiels de l’école.'],['OPPORTUNITIES','De nouvelles *perspectives.*','Opportunités','Bourses, stages, concours et appels à candidatures pour préparer la suite.']]) {
 if (!home.sections.some(s=>s.type===type)) { const s=section(type,{title,eyebrow,intro,count:3});s.pageId=home.id;const index=home.sections.findIndex(s=>s.type===(type==='ANNOUNCEMENTS'?'HERO':'EVENTS_LIST'));home.sections.splice(index+1,0,s); }
}
if (!home.sections.some(s => s.type === 'SERVICE_GRID')) {
 const news = home.sections.find(s=>s.type==='NEWS_LIST');
 if(news) { news.dataFr.title='Au cœur de *l’école.*'; news.dataFr.count=4; }
 const agenda=section('EVENTS_LIST',{eyebrow:'À vos agendas',title:'Les prochains *rendez-vous.*',count:3});
 const digital=section('SERVICE_GRID',{eyebrow:'Le campus connecté',title:'Un accès direct à *vos ressources.*',intro:'Apprendre, rechercher, échanger : les plateformes de votre quotidien universitaire.'});
 const life=resources('Vie étudiante','Bien plus que *des études.*','Des rencontres, des initiatives et un campus à vivre au quotidien.',[['Communauté','Clubs & associations','S’investir, partager et faire grandir ses idées.','/vie-etudiante/clubs'],['Terrain','Apprendre autrement','Découvrir la forêt, observer et expérimenter.','/vie-etudiante/terrain'],['Campus','Sport & culture','Trouver sa place dans la vie du campus.','/vie-etudiante/sport-culture'],['Accompagnement','Votre quotidien','Informations pratiques et accompagnement étudiant.','/vie-etudiante/vie-pratique']],'/photos/etudiants-badges.jpg');
 const quick=resources('Repères étudiants','L’essentiel, *sans détour.*','Les informations à retrouver facilement tout au long de l’année.',[['Candidater','Admissions','Préparer votre dossier et votre arrivée.','/admissions'],['S’organiser','Scolarité','Emplois du temps, examens et démarches.','/scolarite'],['Se documenter','Documents','Guides et formulaires de l’école.','/documents'],['Explorer','Recherche','Ressources et vie scientifique.','/recherche/ressources']]);
 life.hidden=true;
 home.sections=[home.sections[0],...(news?[news]:[]),agenda,digital,quick,life,...home.sections.filter(s=>s.type!=='HERO'&&s.type!=='NEWS_LIST'&&s.type!=='GALLERY')];
 home.sections.forEach((s,i)=>{s.pageId=home.id;s.order=i;});
}
// Keep the homepage focused on academic news, services and student life.
const removedHomeTypes = new Set(['STATS', 'RESEARCH_SPOTLIGHT', 'FACULTY_GRID', 'PARTNERS']);
home.sections = home.sections.filter(s => !removedHomeTypes.has(s.type) && !(s.type === 'EDITORIAL' && s.dataFr?.eyebrow === 'Notre mission'));
home.sections.forEach((s, i) => { s.order = i; });
// Preserve existing menus; add useful entry points and submenus once.
function menu(labelFr,href,parentId=null){let m=db.menu.find(m=>m.href===href);if(!m){m={id:id('menu'),labelFr,href,parentId,order:db.menu.filter(m=>m.parentId===parentId).length};db.menu.push(m);}return m;}
const school=db.menu.find(m=>m.href==='/a-propos');if(school){menu('Contact & accès','/contact',school.id);}
const study=menu('Scolarité','/scolarite');for(const [t,h] of [['Admissions','/admissions'],['Emplois du temps','/scolarite/emplois-du-temps'],['Calendrier universitaire','/scolarite/calendrier'],['Examens & soutenances','/scolarite/examens'],['Stages & insertion','/scolarite/stages'],['Documents & formulaires','/documents']])menu(t,h,study.id);
const life=menu('Vie étudiante','/vie-etudiante');for(const [slug,title] of leafPages)menu(title,`/vie-etudiante/${slug}`,life.id);
const research=db.menu.find(m=>m.href==='/recherche');if(research)menu('Ressources scientifiques','/recherche/ressources',research.id);
const newsMenu=db.menu.find(m=>m.href==='/actualites');if(newsMenu){newsMenu.labelFr='Actualités & agenda';menu('Événements','/evenements',newsMenu.id);}
menu('Services numériques','/services',study.id);
if(newsMenu)menu('Annonces importantes','/annonces',newsMenu.id);
menu('Opportunités','/opportunites',study.id);
// Keep six primary entries; home is accessible through the identity.
for(const m of db.menu){if(!m.parentId&&m.href==='')m.parentId=school?.id;}
const topOrder=['/a-propos','/programmes','/scolarite','/recherche','/vie-etudiante','/actualites'];
topOrder.forEach((href,i)=>{const m=db.menu.find(m=>m.href===href);if(m)m.order=i;});
if(db.news.length&&!db.news.some(n=>n.featured))db.news[0].featured=true;
fs.writeFileSync(file,JSON.stringify(db,null,2)+'\n');
console.log(`Prepared ${db.pages.length} pages, ${db.services.length} platforms, and homepage sections. Existing event/news content preserved.`);
