const IMG = {"clip": "images/clip.jpg", "whitelace": "images/whitelace.jpg", "hero": "images/hero.jpg", "gems": "images/gems.jpg", "pinkart": "images/pinkart.jpg", "bw": "images/bw.jpg", "green": "images/green.jpg", "blue": "images/blue.jpg", "dots": "images/dots.jpg", "butterfly": "images/butterfly.jpg", "bride": "images/bride.jpg", "soft": "images/soft.jpg", "profile": "images/profile.jpg", "afro": "images/afro.jpg", "tulle": "images/tulle.jpg", "emerald": "images/emerald.jpg", "redgloves": "images/redgloves.jpg", "leopard": "images/leopard.jpg", "bodyart": "images/bodyart.jpg"};
const works = [
  {id:'bodyart',cat:'art',title:"Créatrice d'univers",credit:'Body art et face painting, concept signé NG Beauty.'},
  {id:'redgloves',cat:'glam',title:'Valentine beauty',credit:'Photo @guyz_statois_officiel · Modèle @cam_white_officiel'},
  {id:'pinkart',cat:'art',title:'Poupée au cœur humain',credit:'Rose et perles : un maquillage-concept entre fragilité et force.'},
  {id:'bride',cat:'event',title:'Une année de plus',credit:"Look d'anniversaire, teint lumineux et regard doux."},
  {id:'butterfly',cat:'art',title:'Papillons',credit:'Couleurs franches et accessoires : un look qui raconte une histoire.'},
  {id:'blue',cat:'glam',title:'Glam bleu nuit',credit:'Modèle @miss_aanne'},
  {id:'tulle',cat:'art',title:'Objets ordinaires',credit:'Projet artistique avec @bernucia_gloire.'},
  {id:'whitelace',cat:'event',title:'Vêtue de blanc',credit:'Photo @prince_massen · Coiffure @ndomba.diamant'},
  {id:'gems',cat:'art',title:'Pas discret, assumé',credit:'Photo @odenphotographie'},
  {id:'leopard',cat:'glam',title:'Makeup 92i',credit:'Glam chaud, lèvres nude.'},
  {id:'emerald',cat:'event',title:'Soirée émeraude',credit:'Prestation à Brazzaville.'},
  {id:'hero',cat:'art',title:'Arc-en-ciel',credit:'Pigments et paillettes, de la paupière au cou.'},
  {id:'afro',cat:'glam',title:'Lumineux',credit:'Modèle @joliegamine_officiel'},
  {id:'clip',cat:'clip',title:'Sur le tournage',credit:'Maquillage plateau pour un clip à Brazzaville.'},
  {id:'soft',cat:'glam',title:"À l'ancienne",credit:'Teint satiné, regard ombré, rouge à lèvres rosé.'},
  {id:'bw',cat:'glam',title:'Noir & blanc',credit:'Shooting éditorial.'}
];
const cats = {all:'Tout',art:'Artistique',glam:'Glam & shooting',event:'Mariage & événements',clip:'Clips & tournages'};
const services = [
  {id:'bride',name:'Mariée',desc:'Un teint qui tient de la mairie à la dernière danse, pensé avec toi selon ta robe et ta coiffure.',price:'[PRIX] FCFA',meta:'≈ [DURÉE] · [PRIX] FCFA',img:'whitelace'},
  {id:'party',name:'Anniversaire & soirée',desc:'Glam lumineux ou look audacieux, pour être la plus belle sur toutes les photos de la soirée.',price:'[PRIX] FCFA',meta:'≈ [DURÉE] · [PRIX] FCFA',img:'bride'},
  {id:'shoot',name:'Shooting photo',desc:'Maquillage HD calibré pour la lumière du studio, avec retouches pendant la séance.',price:'[PRIX] FCFA',meta:'≈ [DURÉE] · [PRIX] FCFA',img:'blue'},
  {id:'clip',name:'Clip & tournage',desc:'Maquillage plateau pour artistes et figurants, tenue longue durée sous les projecteurs.',price:'[PRIX] FCFA',meta:'Selon le plateau · [PRIX] FCFA',img:'clip'},
  {id:'art',name:'Makeup artistique',desc:'Concept sur mesure : face painting, strass, couleurs, effets. Pour un projet, un concours ou une campagne.',price:'Sur devis',meta:'Concept sur mesure · sur devis',img:'pinkart'}
];
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* portfolio : carrousel collage */
let filter = 'all';
const tilt = [-4,3,-2,5,-3,2,-5,4,-1,3,-4,2,-3,5,-2,4];
const sizes = [[300,380],[260,320],[320,400],[250,300],[290,360],[270,340]];
const lift = [0,40,-10,30,-20,25,5,-15];
const track = $('#track');
function renderPf(){
  $('#chips').innerHTML = Object.entries(cats).map(([k,v]) => `<button class="chip" type="button" data-f="${k}" aria-pressed="${filter===k}">${v}</button>`).join('');
  const list = works.filter(w => filter==='all' || w.cat===filter);
  track.innerHTML = list.map((w,i) => { const [cw,ch] = sizes[i%sizes.length];
    return `<figure class="card" style="margin-top:${lift[i%lift.length]}px;transform:rotate(${tilt[i%tilt.length]}deg);margin-left:0;margin-bottom:0">
      <button class="ph" type="button" data-open="${w.id}" aria-label="Agrandir : ${esc(w.title)}" style="width:${cw}px;height:${ch}px;max-width:72vw"><img src="${IMG[w.id]}" alt="${esc(w.title)}, maquillage par Sylvia Grace" draggable="false"><span class="dot" aria-hidden="true">+</span></button>
      <figcaption class="lab"><strong>${esc(w.title)}</strong><span>${cats[w.cat]}</span></figcaption></figure>`; }).join('') + '<div style="flex:0 0 8vw"></div>';
  track.scrollLeft = 0; updCount();
}
function cardsArr(){ return [...track.querySelectorAll('.card')]; }
function curIndex(){ const c = cardsArr(), mid = track.scrollLeft + track.clientWidth*0.35; let best = 0; c.forEach((el,i) => { if (el.offsetLeft <= mid) best = i; }); return best; }
function updCount(){ const n = cardsArr().length, i = Math.min(n-1, curIndex()); $('#count').innerHTML = `${String(i+1).padStart(2,'0')} <span>/ ${String(n).padStart(2,'0')}</span>`; const max = track.scrollWidth - track.clientWidth; $('#barI').style.width = (max>0 ? 10 + 90*track.scrollLeft/max : 100) + '%'; }
function go(d){ const c = cardsArr(); const i = Math.max(0, Math.min(c.length-1, curIndex()+d)); track.scrollTo({left: c[i].offsetLeft - parseFloat(getComputedStyle(track).paddingLeft), behavior:'smooth'}); }
$('#prev').addEventListener('click', () => go(-1));
$('#next').addEventListener('click', () => go(1));
track.addEventListener('scroll', updCount, {passive:true});
track.addEventListener('keydown', e => { if (e.key==='ArrowRight'){ e.preventDefault(); go(1); } if (e.key==='ArrowLeft'){ e.preventDefault(); go(-1); } });
/* glisser à la souris (le doigt utilise le défilement natif), avec élan au lâcher et rebond en bout de course */
const calm = matchMedia('(prefers-reduced-motion: reduce)');
let dragX = null, startScroll = 0, moved = false, vel = 0, lastX = 0, lastT = 0, glide = 0;
track.addEventListener('pointerdown', e => { if (e.pointerType!=='mouse') return; cancelAnimationFrame(glide); dragX = lastX = e.clientX; lastT = performance.now(); vel = 0; startScroll = track.scrollLeft; moved = false; });
window.addEventListener('pointermove', e => {
  if (dragX===null) return;
  const dx = e.clientX - dragX; if (Math.abs(dx) > 5){ moved = true; track.classList.add('drag'); }
  track.scrollLeft = startScroll - dx;
  const now = performance.now(), dt = Math.max(1, now - lastT);
  vel = .8 * ((e.clientX - lastX) / dt) + .2 * vel; lastX = e.clientX; lastT = now;
});
window.addEventListener('pointerup', () => {
  if (dragX===null) return; dragX = null;
  let v = vel * 16;
  if (calm.matches || Math.abs(v) < 2 || performance.now() - lastT > 80){ track.classList.remove('drag'); return; }
  const max = track.scrollWidth - track.clientWidth;
  const step = () => {
    track.scrollLeft -= v; v *= .94;
    const atEdge = track.scrollLeft <= 0 || track.scrollLeft >= max - 1;
    if (atEdge && Math.abs(v) > 4){ track.animate([{translate:'0 0'},{translate:`${Math.sign(v)*Math.min(48, Math.abs(v)*2.5)}px 0`},{translate:'0 0'}], {duration:520, easing:'cubic-bezier(.2,.8,.2,1)'}); v = 0; }
    if (Math.abs(v) > .5) glide = requestAnimationFrame(step); else track.classList.remove('drag');
  };
  glide = requestAnimationFrame(step);
});
track.addEventListener('click', e => { if (moved){ e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
$('#chips').addEventListener('click', e => {
  const b = e.target.closest('[data-f]'); if (!b || b.dataset.f===filter) return;
  const run = () => { filter = b.dataset.f; renderPf(); };
  window.motion ? window.motion.swapPf(track, run) : run();
});
renderPf();

/* services */
$('#svcs').innerHTML = services.map((s,i) => `<div class="svc" data-img="${IMG[s.img]}"><span class="num">0${i+1}</span><div class="txt"><h3>${s.name}</h3><p>${s.desc}</p></div><div class="price"><span>À partir de</span><b>${s.price}</b></div><button type="button" data-book="${s.id}">Réserver</button></div>`).join('');

/* overlays */
let lastFocus = null;
function show(el, src){ if (el.hidden) lastFocus = document.activeElement; el.hidden = false; document.body.style.overflow = 'hidden'; el.querySelector('.close').focus(); window.motion && window.motion.ovIn(el, src); }
function hide(el){
  if (el.hidden) return;
  const done = () => { el.hidden = true; if ($('#lb').hidden && $('#bk').hidden){ document.body.style.overflow = ''; lastFocus && lastFocus.focus && lastFocus.focus(); } };
  window.motion ? window.motion.ovOut(el, done) : done();
}
function openLook(id, src){
  const w = works.find(x => x.id===id); if (!w) return;
  $('#lbImg').src = IMG[w.id]; $('#lbImg').alt = w.title; $('#lbCat').textContent = cats[w.cat]; $('#lbTitle').textContent = w.title; $('#lbCredit').textContent = w.credit;
  show($('#lb'), src);
}
document.addEventListener('click', e => {
  const o = e.target.closest('[data-open]'); if (o){ openLook(o.dataset.open, o); return; }
  const b = e.target.closest('[data-book]'); if (b){ e.preventDefault(); if (!$('#lb').hidden) hide($('#lb')); openBooking(b.dataset.book || null); return; }
  const c = e.target.closest('[data-close]'); if (c){ hide(c.closest('.ov')); }
});
document.addEventListener('keydown', e => { if (e.key==='Escape'){ ['#bk','#lb'].forEach(s => { if (!$(s).hidden) hide($(s)); }); } });

/* booking */
const TODAY = new Date(2026,9,16);
const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const B = {step:1, service:null, month:0, day:null, time:null, place:null, people:1, name:'', phone:'', note:''};
let shownStep = 0;
function openBooking(svc){ if (svc && services.some(s=>s.id===svc)){ B.service = svc; if (B.step===1) B.step = 2; } if (B.step===5) B.step = 1; renderBk(); show($('#bk')); }
const sel = () => services.find(s => s.id===B.service);
function dateLabel(){ if (!B.day) return '—'; const d = new Date(B.day); return ['dim.','lun.','mar.','mer.','jeu.','ven.','sam.'][d.getDay()]+' '+d.getDate()+' '+months[d.getMonth()]; }
const valid = () => ({1:!!B.service, 2:!!(B.day&&B.time), 3:!!(B.place&&B.name.trim()&&B.phone.trim()), 4:true})[B.step];
const hints = {1:'Choisis une prestation',2:'Choisis un jour et une heure',3:'Lieu, nom et WhatsApp requis',4:''};
function waText(){
  const s = sel();
  return encodeURIComponent(`Bonjour Sylvia ! Je souhaite réserver : ${s?s.name:''}\nDate : ${dateLabel()} à ${B.time||''}\nLieu : ${B.place||''}\nPersonnes : ${B.people}\nNom : ${B.name}\nWhatsApp : ${B.phone}${B.note?'\nLook souhaité : '+B.note:''}`);
}
function renderBk(){
  const s = sel();
  $('#bkImg').src = s ? IMG[s.img] : IMG.hero;
  $('#rS').textContent = s ? s.name : '—'; $('#rD').textContent = dateLabel(); $('#rT').textContent = B.time || '—'; $('#rP').textContent = s ? s.price : '—';
  $('#prog').innerHTML = ['Prestation','Date & heure','Infos','Confirmation'].map((l,i) => `<li class="${B.step===i+1?'cur':B.step>i+1?'done':''}"><i aria-hidden="true"></i><small>0${i+1}</small>${l}</li>`).join('');
  let h = '';
  if (B.step===1){
    h = `<div class="fcol" style="gap:16px"><h3>Quelle prestation ?</h3><div class="opts">${services.map(x => `<button class="opt" type="button" data-svc="${x.id}" aria-pressed="${B.service===x.id}"><img src="${IMG[x.img]}" alt=""><span><strong>${x.name}</strong><em>${x.meta}</em></span></button>`).join('')}</div></div>`;
  } else if (B.step===2){
    const base = new Date(2026, 9+B.month, 1), y = base.getFullYear(), m = base.getMonth();
    const lead = (base.getDay()+6)%7, n = new Date(y,m+1,0).getDate();
    let cells = ['LUN','MAR','MER','JEU','VEN','SAM','DIM'].map(d => `<span class="dow">${d}</span>`).join('');
    for (let i=0;i<lead;i++) cells += `<button class="day blank" type="button" disabled aria-hidden="true" tabindex="-1"></button>`;
    for (let d=1; d<=n; d++){ const dt = new Date(y,m,d), iso = dt.toISOString(), past = dt < TODAY; cells += `<button class="day" type="button" data-day="${y}-${m}-${d}" ${past?'disabled':''} aria-pressed="${B.day && new Date(B.day).getTime()===dt.getTime()}" aria-label="${d} ${months[m]}">${d}</button>`; }
    h = `<div class="fcol" style="gap:20px"><div class="cal-h"><h3>${months[m]} ${y}</h3><div style="display:flex;gap:8px"><button class="sq" type="button" data-mo="-1" aria-label="Mois précédent">←</button><button class="sq" type="button" data-mo="1" aria-label="Mois suivant">→</button></div></div>
      <div class="cal">${cells}</div>
      <div class="fcol"><span class="lbl">Heure de début · horaires [À CONFIRMER]</span><div class="pills">${['06:00','08:00','10:00','13:00','15:00','17:00'].map(t => `<button class="pill" type="button" data-time="${t}" aria-pressed="${B.time===t}">${t}</button>`).join('')}</div></div></div>`;
  } else if (B.step===3){
    h = `<div class="fcol" style="gap:20px"><h3>Où et pour qui ?</h3>
      <div class="fcol"><span class="lbl">Lieu</span><div class="pills">${['En studio','À domicile',"Sur le lieu de l'événement"].map(p => `<button class="pill" type="button" data-place="${esc(p)}" aria-pressed="${B.place===p}">${p}</button>`).join('')}</div></div>
      <div style="display:flex;flex-wrap:wrap;align-items:center;gap:16px"><span class="lbl">Personnes à maquiller</span><div class="stepper"><button type="button" data-ppl="-1" aria-label="Retirer une personne">−</button><output id="ppl">${B.people}</output><button type="button" data-ppl="1" aria-label="Ajouter une personne">+</button></div></div>
      <div class="fgrid"><label for="fName"><span class="lbl">Prénom &amp; nom</span><input class="field" id="fName" type="text" autocomplete="name" value="${esc(B.name)}" placeholder="Ex. Grâce Mabiala"></label>
      <label for="fPhone"><span class="lbl">Numéro WhatsApp</span><input class="field" id="fPhone" type="tel" autocomplete="tel" value="${esc(B.phone)}" placeholder="+242 06 000 00 00"></label></div>
      <label class="fcol" for="fNote"><span class="lbl">Ton look idéal (facultatif)</span><textarea class="field" id="fNote" rows="3" placeholder="Couleur de la tenue, inspiration, lien Instagram d'un look…">${esc(B.note)}</textarea></label></div>`;
  } else if (B.step===4){
    h = `<div class="fcol" style="gap:18px"><h3>On vérifie ?</h3><div class="sum"><strong>${s.name}</strong><span>${dateLabel()} · ${B.time}</span><span>${esc(B.place)} · ${B.people} personne${B.people>1?'s':''}</span><span>${esc(B.name)} · ${esc(B.phone)}</span><small>À partir de ${s.price}. Acompte de [MONTANT] pour bloquer la date.</small></div>
      <p style="margin:0;color:var(--muted)">Ta demande s'ouvre dans WhatsApp, déjà rédigée. Sylvia te confirme la disponibilité et le tarif exact sous [DÉLAI].</p></div>`;
  } else {
    h = `<div class="fcol" style="gap:16px"><span class="merci">merci.</span><p style="margin:0;max-width:520px;font-size:18px">Ton message pour « ${s?s.name:''} » le ${dateLabel()} est prêt dans WhatsApp. Envoie-le et Sylvia te répond très vite.</p>
      <div class="wa"><span>Si WhatsApp ne s'est pas ouvert, écris au</span><code>[NUMÉRO WHATSAPP]</code></div>
      <a class="btn-ghost" href="#portfolio" data-close style="align-self:flex-start">← Revoir le portfolio</a></div>`;
  }
  $('#bkBody').innerHTML = h;
  $('#bkNav').hidden = B.step===5;
  $('#bBack').disabled = B.step===1;
  const ok = valid();
  $('#bNext').disabled = !ok; $('#bHint').textContent = ok ? '' : hints[B.step];
  $('#bNext').textContent = B.step===4 ? 'Envoyer sur WhatsApp →' : 'Continuer →';
  if (B.step !== shownStep){ window.motion && window.motion.bkStep(B.step, shownStep); shownStep = B.step; }
}
$('#bkBody').addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.svc){ B.service = t.dataset.svc; }
  else if (t.dataset.mo){ B.month = Math.min(5, Math.max(0, B.month + +t.dataset.mo)); }
  else if (t.dataset.day){ const [y,m,d] = t.dataset.day.split('-').map(Number); B.day = new Date(y,m,d).toISOString(); }
  else if (t.dataset.time){ B.time = t.dataset.time; }
  else if (t.dataset.place){ B.place = t.dataset.place; }
  else if (t.dataset.ppl){ B.people = Math.min(15, Math.max(1, B.people + +t.dataset.ppl)); }
  else return;
  renderBk();
  /* petit rebond sur l'élément choisi (le contenu vient d'être redessiné) */
  const k = Object.keys(t.dataset)[0];
  const picked = $('#bkBody').querySelector(`[data-${k}="${CSS.escape(t.dataset[k])}"]`);
  if (picked && k!=='mo' && k!=='ppl') picked.classList.add('pop');
});
$('#bkBody').addEventListener('input', e => {
  if (e.target.id==='fName') B.name = e.target.value;
  if (e.target.id==='fPhone') B.phone = e.target.value;
  if (e.target.id==='fNote') B.note = e.target.value;
  const ok = valid(); $('#bNext').disabled = !ok; $('#bHint').textContent = ok ? '' : hints[B.step];
});
$('#bBack').addEventListener('click', () => { B.step = Math.max(1, B.step-1); renderBk(); });
$('#bNext').addEventListener('click', () => {
  if (!valid()) return;
  if (B.step===4){
    const a = document.createElement('a'); a.href = 'https://wa.me/[NUMERO]?text=' + waText(); a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove();
  }
  B.step++; renderBk();
});
