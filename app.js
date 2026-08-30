const DATA = {glossaire:[], artistes:[], ateliers:[], objets:[], pages:{}};
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm = s => String(s??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const slug = s => norm(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const imagePath = f => f ? `assets/webp/${String(f).replace(/\.(jpg|jpeg|png)$/i,'.webp')}` : '';

const NAV = [
  ['Accueil','#/','⌂'],['Qui je suis','#/qui-je-suis','♡'],['Documents de stage','#/stages','▤'],
  ['Ateliers','#/ateliers','✎'],['Activités','#/activites','✂'],['Préparations','#/preparations','▣'],
  ['Glossaire','#/glossaire','Aa'],['Références','#/artistes','▧'],['Objets culturels','#/objets','◇']
];

function findByName(list, value, field='title'){
  const n=norm(value);
  return list.find(x=>norm(x[field])===n) || list.find(x=>n && norm(x[field]).includes(n)) || list.find(x=>n && n.includes(norm(x[field])));
}

function linkToGlossary(name){
  const x=findByName(DATA.glossaire,name);
  return x ? `#/glossaire/${x.id}` : '#/glossaire';
}

function linkToArtist(name){
  const x=findByName(DATA.artistes,name,'name');
  return x ? `#/artistes/${x.id}` : '#/artistes';
}

function linkify(text){
  let out=esc(text);
  const candidates=[
    ...DATA.artistes.map(x=>({t:x.name,h:`#/artistes/${x.id}`})),
    ...DATA.glossaire.map(x=>({t:x.title,h:`#/glossaire/${x.id}`}))
  ].filter(x=>x.t).sort((a,b)=>b.t.length-a.t.length);

  for(const x of candidates){
    const re=new RegExp(`(?<![\\w-])(${x.t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})(?![\\w-])`,'gi');
    out=out.replace(re,`<a class="link" href="${x.h}">$1</a>`);
  }
  return out;
}

function layout(content){
  document.querySelector('#app').innerHTML=`
  <div class="app">
    <header class="top">
      <a class="logo" href="#/">Ma boîte à outils<br><small>de future maîtresse</small></a>
      <nav class="nav">${NAV.slice(1).map(([t,h,i])=>`<a href="${h}"><span>${i}</span>${t}</a>`).join('')}</nav>
      <label class="search"><span>⌕</span><input id="global-search" placeholder="Rechercher…" aria-label="Recherche globale"></label>
    </header>
    <main>${content}</main>
    <footer class="footer">Portfolio étudiant d’Audrey-Lita Sonnet · Un outil évolutif pendant toute la formation.</footer>
  </div>`;

  const q=$('#global-search');
  q?.addEventListener('keydown',e=>{
    if(e.key==='Enter'&&q.value.trim()) location.hash='#/recherche/'+encodeURIComponent(q.value.trim())
  });

  const cur=location.hash.split('/')[1]||'';
  document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href').includes(cur)));
}

function pageHead(title,sub=''){
  return `<div class="page-head"><div class="eyebrow">MA BOÎTE À OUTILS</div><h1>${esc(title)}</h1><p class="sub">${esc(sub)}</p></div>`;
}

function imageTag(f,alt='',cls=''){
  return f?`<img class="${cls}" src="${imagePath(f)}" alt="${esc(alt)}" loading="lazy">`:'';
}

function home(){
  const p=DATA.pages.home||{};
  layout(`<section class="hero">
    <div class="hero-copy"><div class="eyebrow">PORTFOLIO D’ENSEIGNEMENT</div><h1>Bienvenue<br>dans ma boîte à outils <span>♡</span></h1>
      <p class="lead">Un espace vivant pour rassembler mes expériences, mes ateliers, mes préparations et mes ressources pour l’école.</p>
      <p class="lead small">Chaque rubrique est pensée pour être enrichie au fil de ma formation.</p>
    </div>
    <div class="desk">
      ${homeObject('🎒','Préparations','Par matière, niveau, année','#/preparations','sage')}
      ${homeObject('🖌️','Ateliers','Expérimenter et documenter','#/ateliers','pink')}
      ${homeObject('✂️','Activités','Musique, psychomotricité…','#/activites','blue')}
      ${homeObject('Aa','Glossaire','Notions et procédés','#/glossaire','lilac')}
      ${homeObject('🖼️','Références','Artistes et œuvres','#/artistes','yellow')}
      ${homeObject('🌱','Qui je suis','Parcours, CV, vision','#/qui-je-suis','sage')}
      <div class="desk-note">✦ apprendre · expérimenter · transmettre ✦</div>
    </div>
  </section>
  <section class="cards home-cards">
    <article class="card"><h3>Un portfolio évolutif</h3><p>La structure est pensée pour accueillir de nouveaux contenus pendant toute la formation.</p></article>
    <article class="card"><h3>Des liens croisés</h3><p>Une notion peut renvoyer à un artiste, une œuvre ou un atelier — et inversement.</p></article>
    <article class="card"><h3>Déjà dans la base</h3><p><b>${DATA.glossaire.length}</b> termes · <b>${DATA.artistes.length}</b> artistes · <b>${DATA.objets.length}</b> objets culturels.</p></article>
  </section>
  <section class="lower"><article class="paper"><div class="portrait">♡</div><div><h2>Qui suis-je ?</h2><p>${esc((p.text||'').slice(0,300))}</p><a class="link" href="#/qui-je-suis">Découvrir mon parcours →</a></div></article>
  <article class="paper quote"><div class="quote-mark">“</div><p>Un espace pour garder une trace de ce que j’apprends, de ce que j’expérimente et de ce qui m’inspire.</p><small>Ma boîte à outils ♡</small></article></section>`);
}

function homeObject(icon,title,sub,href,tone){
  return `<a class="object ${tone}" href="${href}"><span>${icon}</span><b>${title}</b><small>${sub}</small></a>`
}

function glossary(){
  let q='', letter='*', type='';
  const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const render=()=>{
    const arr=DATA.glossaire.filter(x=>{
      const starts=norm(x.title).charAt(0)===letter.toLowerCase();
      const okL=letter==='*'||starts;
      const okQ=!q||[x.title,x.type,...(x.content||[])].join(' ').toLowerCase().includes(q.toLowerCase());
      const okT=!type||x.type===type;
      return okL&&okQ&&okT;
    });

    $('#glist').innerHTML=arr.map(x=>`<article class="item">
      <div class="type">${esc(x.type||'Ressource')}</div>
      <h3><a class="link" href="#/glossaire/${x.id}">${esc(x.title)}</a></h3>
      <p>${esc((x.content||[]).filter(Boolean).slice(-2).join(' ').slice(0,360))}</p>
      ${(x.ateliers||[]).length?`<div class="chips">${x.ateliers.map(a=>`<a class="chip" href="#/ateliers/${slug(a)}">${esc(a)}</a>`).join('')}</div>`:''}
    </article>`).join('')||`<div class="empty">Aucun terme pour cette sélection.</div>`;

    document.querySelectorAll('.alpha button').forEach(b=>b.classList.toggle('selected',b.dataset.letter===letter));
  };

  const types=[...new Set(DATA.glossaire.map(x=>x.type).filter(Boolean))];

  layout(`${pageHead('Glossaire','Recherche + index alphabétique + liens vers les ressources associées')}
    <div class="glossary-tools"><input id="gq" placeholder="Rechercher un terme…"><select id="gtype"><option value="">Tous les types</option>${types.map(t=>`<option>${esc(t)}</option>`).join('')}</select></div>
    <div class="alpha"><button data-letter="*">TOUS</button>${letters.map(l=>`<button data-letter="${l}">${l}</button>`).join('')}</div>
    <div class="countline"><span id="gcount"></span></div><div id="glist" class="list"></div>`);

  $('#gq').addEventListener('input',e=>{q=e.target.value;render()});
  $('#gtype').addEventListener('change',e=>{type=e.target.value;render()});
  document.querySelectorAll('.alpha button').forEach(b=>b.addEventListener('click',()=>{letter=b.dataset.letter;render()}));
  render();
}

function glossaryDetail(id){
  const x=DATA.glossaire.find(x=>x.id===id);
  if(!x)return glossary();

  layout(`${pageHead(x.title,x.type||'Entrée du glossaire')}<a class="back" href="#/glossaire">← Retour au glossaire</a>
    <article class="detail text">
      ${(x.content||[]).filter(Boolean).map(p=>`<p>${linkify(p)}</p>`).join('')}
      ${(x.images||[]).length?`<div class="gallery">${x.images.map(i=>imageTag(i,x.title)).join('')}</div>`:''}
      ${x.sources?.length?`<h3>Sources</h3>${x.sources.map(s=>`<p>${linkify(s)}</p>`).join(''):''}
      ${x.ateliers?.length?`<h3>Ateliers en lien</h3><div class="chips">${x.ateliers.map(a=>`<a class="chip" href="#/ateliers/${slug(a)}">${esc(a)}</a>`).join('')}</div>`:''}
    </article>`);
}

function artists(){
  let q='';

  const render=()=>{
    const arr=DATA.artistes.filter(x=>!q||JSON.stringify(x).toLowerCase().includes(q.toLowerCase()));

    $('#alist').innerHTML=arr.map(x=>`<article class="artist-card">
      ${imageTag(x.images?.[0],x.name,'artist-cover')}
      <div class="artist-body"><h3><a class="link" href="#/artistes/${x.id}">${esc(x.name)}</a></h3>
      <p>${esc((x.bio||[]).join(' ').slice(0,250))}</p><small>${x.works?.length||0} œuvre(s)</small></div></article>`).join('')||'<div class="empty">Aucun artiste trouvé.</div>';
  };

  layout(`${pageHead('Références artistiques','Artistes, œuvres, courants, dimensions, médiums et procédés')}<div class="toolbar"><input id="aq" placeholder="Rechercher un artiste ou une œuvre…"></div><div id="alist" class="artist-grid"></div>`);

  $('#aq').addEventListener('input',e=>{q=e.target.value;render()});
  render();
}

function artistDetail(id){
  const x=DATA.artistes.find(x=>x.id===id);
  if(!x)return artists();

  const works=x.works||[];

  layout(`${pageHead(x.name,'Biographie et œuvres')}<a class="back" href="#/artistes">← Retour aux références</a>
  <article class="detail">
    <div class="profile">${imageTag(x.images?.[0],x.name,'profile-photo')}<div><h2>${esc(x.name)}</h2>${(x.bio||[]).map(p=>`<p>${esc(p)}</p>`).join('')}</div></div>
    <h3>Œuvres</h3>
    <div class="works">${works.map((w,i)=>`<article class="work-card">
      ${x.images?.[i]?imageTag(x.images[i],w.title,'work-image'):''}
      <h4>${esc(w.title||'Œuvre')}</h4>
      <div class="meta">${['Date','Siècle','Courant artistique','Dimensions','Médium','Procédés artistiques'].filter(k=>w[k]).map(k=>`<div><strong>${esc(k)}</strong><span>${esc(w[k])}</span></div>`).join('')}</div>
      ${w.notes?`<p>${esc(Array.isArray(w.notes)?w.notes.join(' '):w.notes)}</p>`:''}
    </article>`).join('')}</div>
    ${x.glossary?.length?`<h3>Notions associées</h3><div class="chips">${x.glossary.map(g=>`<a class="chip" href="${linkToGlossary(g)}">${esc(g)}</a>`).join('')}</div>`:''}
    ${x.ateliers?.length?`<h3>Ateliers associés</h3><div class="chips">${x.ateliers.map(a=>`<a class="chip" href="#/ateliers/${slug(a)}">${esc(a)}</a>`).join('')}</div>`:''}
  </article>`);
}

function workshops(){
  const real=DATA.ateliers.filter(x=>(x.title||'').toLowerCase()!=='atelier' || (x.sections?.length||x.images?.length||x.glossary?.length||x.artists?.length));

  if(!real.length){
    layout(`${pageHead('Ateliers d’expérimentations','Une rubrique prête à accueillir tes ateliers')}<div class="empty large"><div>✎</div><h2>Les ateliers ne sont pas encore présents dans les données exportées.</h2><p>La structure du site est prête, mais le fichier actuel contient seulement des entrées vides. Je ne vais pas inventer leur contenu. Dès que le contenu réel est récupéré depuis ton ancien site/Google Takeout, il pourra être injecté ici.</p></div>`);
    return;
  }

  layout(`${pageHead('Ateliers d’expérimentations','Expérimenter, documenter et relier les pratiques')}<div class="list">${real.map(x=>`<article class="item"><h3><a class="link" href="#/ateliers/${x.id}">${esc(x.title)}</a></h3><p>${esc((x.sections||[]).flatMap(s=>s.items||[]).slice(0,3).join(' ').slice(0,360))}</p><div class="chips">${(x.glossary||[]).map(g=>`<a class="chip" href="${linkToGlossary(g)}">${esc(g)}</a>`).join('')}</div></article>`).join('')}</div>`);
}

function workshopDetail(id){
  const x=DATA.ateliers.find(x=>x.id===id);
  if(!x)return workshops();

  layout(`${pageHead(x.title,'Atelier documenté')}<a class="back" href="#/ateliers">← Retour aux ateliers</a><article class="detail">
    ${(x.images||[]).length?`<div class="gallery">${x.images.map(i=>imageTag(i,x.title)).join('')}</div>`:''}
    ${(x.sections||[]).map(s=>`<section><h3>${esc(s.label||'Contenu')}</h3>${(s.items||[]).map(p=>`<p>${linkify(p)}</p>`).join('')}</section>`).join('')}
    ${(x.glossary||[]).length?`<h3>Glossaire</h3><div class="chips">${x.glossary.map(g=>`<a class="chip" href="${linkToGlossary(g)}">${esc(g)}</a>`).join('')}</div>`:''}
    ${(x.artists||[]).length?`<h3>Références artistiques</h3><div class="chips">${x.artists.map(a=>`<a class="chip" href="${linkToArtist(a)}">${esc(a)}</a>`).join('')}</div>`:''}
  </article>`);
}

function objects(){
  layout(`${pageHead('Objets culturels','Œuvres, objets et références culturelles')}<div class="object-grid">${DATA.objets.map((x,i)=>`<article class="item">
    <div class="gallery">${(x.images||[]).map(img=>imageTag(img,x.title)).join('')}</div><h3>${esc(x.title||'Objet culturel')}</h3>
    ${(x.content||[]).map(p=>`<p>${linkify(p)}</p>`).join('')}</article>`).join('')}</div>`);
}

function activities(){
  layout(`${pageHead('Activités','Ressources pratiques classées par domaine')}<div class="cards three">
    <article class="card"><h3>🎵 Musique</h3><p>Chants et ressources musicales.</p><a class="link" href="#/activites/chants">Voir les chants →</a></article>
    <article class="card"><h3>🤸 Psychomotricité</h3><p>Ressources de psychomotricité.</p><a class="link" href="#/activites/psychomotricite">Voir la ressource →</a></article>
    <article class="card"><h3>🎨 Arts plastiques</h3><p>Les expérimentations sont regroupées dans les ateliers.</p><a class="link" href="#/ateliers">Voir les ateliers →</a></article>
  </div>`);
}

function activityDetail(kind){
  const x=DATA.pages[kind];
  if(!x)return activities();

  layout(`${pageHead(x.title,'Activité')}<a class="back" href="#/activites">← Retour aux activités</a><article class="detail text">${esc(x.text||'').split(/(?<=\.)\s+(?=[A-ZÀÉÈ])/).map(p=>`<p>${p}</p>`).join('')}</article>`);
}

function preparations(){
  const x=DATA.pages.preparation||{};
  layout(`${pageHead('Fiches de préparation','Une bibliothèque à enrichir par matière, niveau et année')}<article class="detail text"><div class="notice"><b>Structure prête.</b><br>Cette rubrique pourra accueillir les futures fiches sans changer l’interface.</div>${x.text?`<h3>Contenu existant</h3>${esc(x.text).split(/(?<=\.)\s+(?=[A-ZÀÉÈ])/).map(p=>`<p>${p}</p>`).join('')}`:''}</article>`);
}

function stages(){
  const x=DATA.pages.stage||{};
  layout(`${pageHead('Documents de stage','Parcours, CV et documents professionnels')}<article class="detail text"><p>${esc(x.text||'')}</p><div class="pdfs"><a class="pdf" href="documents/CV-Audrey-Lita-Sonnet-2026.pdf" target="_blank">📄 CV 2026</a><a class="pdf" href="documents/Lettre-de-motivation-2e-annee.pdf" target="_blank">📄 Lettre de motivation · 2e année</a></div></article>`);
}

function identity(){
  const p=DATA.pages.home||{};
  layout(`${pageHead('Qui je suis','Parcours, CV et vision de l’école')}<article class="detail text"><h3>Mon parcours</h3><p>${esc((p.text||'').slice(0,900))}</p><div class="pdfs"><a class="pdf" href="documents/CV-Audrey-Lita-Sonnet-2026.pdf" target="_blank">📄 Voir mon CV</a><a class="pdf" href="documents/Lettre-de-motivation-2e-annee.pdf" target="_blank">📄 Lettre de motivation</a></div><h3>Ma vision de l’école</h3><p>La page éditoriale dédiée pourra reprendre et développer le contenu de ta vision.</p><a class="link" href="#/vision">Lire ma vision →</a></article>`);
}

function vision(){
  const t=DATA.pages.home?.text||'';
  layout(`${pageHead('Ma vision de l’école','Une réflexion appelée à évoluer pendant la formation')}<article class="detail text">${esc(t).split(/(?<=\.)\s+(?=[A-ZÀÉÈ])/).filter(Boolean).map(p=>`<p>${p}</p>`).join('')}</article>`);
}

function searchPage(q){
  const g=DATA.glossaire.filter(x=>JSON.stringify(x).toLowerCase().includes(q.toLowerCase())).slice(0,10);
  const a=DATA.artistes.filter(x=>JSON.stringify(x).toLowerCase().includes(q.toLowerCase())).slice(0,10);

  layout(`${pageHead('Recherche',`Résultats pour « ${esc(q)} »`)}<div class="results"><article class="card"><h3>Glossaire</h3>${g.map(x=>`<p><a class="link" href="#/glossaire/${x.id}">${esc(x.title)}</a></p>`).join('')||'<p>Aucun résultat.</p>'}</article><article class="card"><h3>Artistes</h3>${a.map(x=>`<p><a class="link" href="#/artistes/${x.id}">${esc(x.name)}</a></p>`).join('')||'<p>Aucun résultat.</p>'}</article></div>`);
}

function router(){
  const parts=decodeURIComponent(location.hash||'#/').replace(/^#\/?/,'').split('/').filter(Boolean);

  if(!parts.length)return home();

  const [r,id]=parts;

  if(r==='glossaire')return id?glossaryDetail(id):glossary();
  if(r==='artistes')return id?artistDetail(id):artists();
  if(r==='ateliers')return id?workshopDetail(id):workshops();
  if(r==='objets')return objects();
  if(r==='activites')return id?activityDetail(id):activities();
  if(r==='preparations')return preparations();
  if(r==='qui-je-suis')return identity();
  if(r==='vision')return vision();
  if(r==='stages')return stages();
  if(r==='recherche')return searchPage(id||'');

  return home();
}

async function load(){
  const files=['glossaire','artistes','ateliers','objets-culturels','pages'];
  const vals=await Promise.all(files.map(f=>fetch(`data/${f}.json`).then(r=>{if(!r.ok)throw new Error(f);return r.json()}).catch(()=>f==='pages'?{}:[])));

  [DATA.glossaire,DATA.artistes,DATA.ateliers,DATA.objets,DATA.pages]=vals;
  router();
  window.addEventListener('hashchange',router);
}

load().catch(e => {
  document.body.innerHTML =
    '<pre style="white-space:pre-wrap;padding:20px;color:red;font-size:16px">' +
    'ERREUR APP.JS\n\n' +
    e.stack +
    '</pre>';
});
