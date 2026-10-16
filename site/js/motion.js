/* Motion — intro, apparitions au défilement, parallaxe, défilement fluide, micro-interactions.
   Dépend de GSAP + ScrollTrigger + Lenis (CDN). Si l'un manque ou si l'appareil demande moins
   de mouvement, le site reste statique et main.js fonctionne seul (window.motion non défini). */
(() => {
  const root = document.documentElement;
  const header = document.querySelector('.top');

  /* En-tête : fond au défilement, caché en descendant, visible en remontant (indépendant de GSAP) */
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    header.classList.toggle('away', y > 320 && y > lastY + 2);
    if (y < lastY - 2) header.classList.remove('away');
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  if (!root.classList.contains('m') || !window.gsap || !window.ScrollTrigger){ root.classList.remove('m'); return; }

  const {gsap, ScrollTrigger} = window;
  gsap.registerPlugin(ScrollTrigger);
  try {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const small = matchMedia('(max-width: 820px)').matches;
  const EASE = 'power3.out', EXPO = 'expo.out';

  /* Découpe un titre en lettres animables (lu en entier par les lecteurs d'écran) */
  const split = el => {
    const txt = el.textContent;
    el.setAttribute('aria-label', txt);
    el.innerHTML = [...txt].map(c => c === ' ' ? ' ' : `<span class="ch" aria-hidden="true">${c}</span>`).join('');
    return $$('.ch', el);
  };

  /* ---------- Défilement fluide ---------- */
  let lenis = null;
  if (window.Lenis){
    lenis = new window.Lenis({duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true});
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    /* liens internes (#portfolio, #menu) : défilement doux, avec marge pour l'en-tête */
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.hasAttribute('data-book') || a.hasAttribute('data-close')) return;
      const target = document.querySelector(a.getAttribute('href'));
      if (target){ e.preventDefault(); lenis.scrollTo(target, {offset: 0, duration: 1.4}); }
    });
    /* bloque le défilement de la page quand une fenêtre (look, réservation) est ouverte */
    const lock = () => ($('#lb').hidden && $('#bk').hidden) ? lenis.start() : lenis.stop();
    new MutationObserver(lock).observe($('#lb'), {attributes: true, attributeFilter: ['hidden']});
    new MutationObserver(lock).observe($('#bk'), {attributes: true, attributeFilter: ['hidden']});
  }

  /* ---------- 1. Intro de l'accueil ---------- */
  const intro = gsap.timeline({defaults: {ease: EXPO}});
  intro
    .to('.hero > img.bg', {scale: 1, duration: 2.4, ease: 'power2.out'}, 0)
    .to('.hero h1 .ln > span', {y: 0, duration: 1.3, stagger: .11}, .15)
    .to('.top', {opacity: 1, duration: .8, ease: EASE}, .5)
    .fromTo('.hero p', {opacity: 0, y: 24}, {opacity: 1, y: 0, duration: 1}, .75)
    .fromTo('.hero-ctas', {opacity: 0, y: 24}, {opacity: 1, y: 0, duration: 1}, .85)
    .fromTo('.pola-w', {opacity: 0, y: -160, rotation: i => i ? 18 : -22},
      {opacity: 1, y: 0, rotation: 0, duration: 1.6, ease: 'elastic.out(1, .65)', stagger: .15}, .55)
    .fromTo('.spaced > span', {opacity: 0, yPercent: 80}, {opacity: 1, yPercent: 0, duration: .9, stagger: .045, ease: EASE}, .9);

  /* Polaroïds qui suivent légèrement la souris */
  if (fine){
    const polas = $$('.pola-w').map((el, i) => ({
      x: gsap.quickTo(el, 'x', {duration: 1.1, ease: EASE}),
      y: gsap.quickTo(el, 'y', {duration: 1.1, ease: EASE}),
      depth: i ? -26 : 34
    }));
    $('.hero').addEventListener('pointermove', e => {
      if (intro.isActive()) return;
      const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      polas.forEach(p => { p.x(nx * p.depth); p.y(ny * p.depth); });
    });
  }

  /* Sortie de l'accueil : le fond descend moins vite, le titre s'efface */
  gsap.to('.hero > img.bg', {yPercent: 14, ease: 'none', scrollTrigger: {trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true}});
  gsap.to('.hero-c', {yPercent: -12, opacity: .2, ease: 'none', scrollTrigger: {trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true}});

  /* ---------- 2. Apparitions au défilement ---------- */
  const reveal = (targets, vars = {}) => {
    const els = typeof targets === 'string' ? $$(targets) : targets;
    if (!els.length) return;
    gsap.set(els, {opacity: 0, y: vars.y ?? 46});
    ScrollTrigger.batch(els, {
      start: 'top 88%', once: true,
      onEnter: batch => gsap.to(batch, {opacity: 1, y: 0, duration: 1.1, ease: EASE, stagger: vars.stagger ?? .12, overwrite: true, clearProps: 'opacity,transform'})
    });
  };
  reveal('.bold .eyebrow, .bold-quote, .bold-l p:not(.bold-quote)');
  reveal('.pf-head > *', {y: 30});
  reveal('.car-ctrl, .pf-more', {y: 24});
  reveal('.how-head > *');
  reveal('.step', {stagger: .16, y: 70});
  reveal('.about-tx > *', {stagger: .1});
  reveal('.cta-in > p, .cta-in > .btn, .cta-in > .eyebrow', {y: 30});
  reveal('.foot > *', {y: 20, stagger: .08});

  /* Le mot BOLD monte, la photo dans les lettres se déplace au défilement */
  gsap.from('.bold-word', {yPercent: 30, opacity: 0, duration: 1.3, ease: EXPO, scrollTrigger: {trigger: '.bold', start: 'top 75%', once: true}});
  gsap.fromTo('.bold-word', {backgroundPosition: '50% 0%'}, {backgroundPosition: '50% 85%', ease: 'none', scrollTrigger: {trigger: '.bold', start: 'top bottom', end: 'bottom top', scrub: true}});
  gsap.fromTo('.bold-r img', {scale: 1.18, yPercent: -6}, {scale: 1.05, yPercent: 6, ease: 'none', scrollTrigger: {trigger: '.bold', start: 'top bottom', end: 'bottom top', scrub: true}});

  /* Carrousel : les cartes arrivent en éventail */
  const pfIn = (delay = 0) => gsap.fromTo($$('.card > *', $('#track')), {opacity: 0, y: 60},
    {opacity: 1, y: 0, duration: .9, ease: EASE, stagger: .05, delay, clearProps: 'opacity,transform'});
  ScrollTrigger.create({trigger: '.car', start: 'top 85%', once: true, onEnter: () => pfIn()});
  gsap.set($$('.card > *', $('#track')), {opacity: 0});

  /* Photo de l'« À propos » : le polaroïd se pose en tournant */
  gsap.fromTo('.about-ph figure', {rotation: -12, y: 80, opacity: 0}, {rotation: -3, y: 0, opacity: 1, duration: 1.4, ease: EXPO, scrollTrigger: {trigger: '.about', start: 'top 75%', once: true}});

  /* Menu : chaque ligne se dessine puis le contenu monte */
  $$('.svc').forEach(row => {
    gsap.set(row, {'--line': 0});
    gsap.set(row.children, {opacity: 0, y: 30});
    ScrollTrigger.create({trigger: row, start: 'top 90%', once: true, onEnter: () => {
      gsap.to(row, {'--line': 1, duration: 1.1, ease: 'power3.inOut'});
      gsap.to(row.children, {opacity: 1, y: 0, duration: .9, ease: EASE, stagger: .06, delay: .25, clearProps: 'opacity,transform'});
    }});
  });

  /* ---------- 3. Grands visages en profondeur + grands mots ---------- */
  const depth = small ? 6 : 12;
  $$('.banner > img, .cta > img').forEach(img => {
    gsap.fromTo(img, {yPercent: -depth, scale: 1.2}, {yPercent: depth, scale: 1.2, ease: 'none',
      scrollTrigger: {trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true}});
  });
  const scrubIn = (trigger, start = 'top 85%', end = 'center 55%') => ({trigger, start, end, scrub: .8});

  const unique = split($('.thin-word'));
  gsap.fromTo(unique, {opacity: 0, yPercent: 40, filter: small ? 'none' : 'blur(10px)'},
    {opacity: 1, yPercent: 0, filter: small ? 'none' : 'blur(0px)', stagger: .08, ease: 'power2.out', scrollTrigger: scrubIn('#portfolio .banner')});

  const makeover = split($('.fat-word'));
  gsap.fromTo(makeover, {yPercent: 70, opacity: 0, rotation: i => (i % 2 ? 8 : -8)},
    {yPercent: 0, opacity: 1, rotation: 0, stagger: .06, ease: 'power2.out', scrollTrigger: scrubIn('#menu .banner')});

  const you = split($('.you'));
  gsap.fromTo(you, {opacity: 0, scale: .4, yPercent: 30}, {opacity: 1, scale: 1, yPercent: 0, stagger: .12, ease: 'power2.out', scrollTrigger: scrubIn('.cta')});

  gsap.from('.how h2', {letterSpacing: '.12em', opacity: 0, ease: 'none', scrollTrigger: scrubIn('.how', 'top 90%', 'top 45%')});

  /* ---------- 4. Photo qui suit la souris sur le menu ---------- */
  if (fine){
    const float = document.createElement('div');
    float.className = 'svc-float'; float.setAttribute('aria-hidden', 'true');
    float.innerHTML = '<img alt="">';
    document.body.appendChild(float);
    const fImg = $('img', float);
    const fx = gsap.quickTo(float, 'x', {duration: .6, ease: EASE});
    const fy = gsap.quickTo(float, 'y', {duration: .6, ease: EASE});
    const fr = gsap.quickTo(float, 'rotation', {duration: .8, ease: EASE});
    gsap.set(float, {xPercent: -50, yPercent: -50});
    let px = 0;
    const list = $('#svcs');
    list.addEventListener('pointermove', e => { fx(e.clientX + 230); fy(e.clientY); fr(gsap.utils.clamp(-12, 12, (e.clientX - px) * .6)); px = e.clientX; });
    list.addEventListener('pointerover', e => {
      const row = e.target.closest('.svc'); if (!row || fImg.getAttribute('src') === row.dataset.img) return;
      fImg.src = row.dataset.img;
      gsap.fromTo(fImg, {scale: 1.25}, {scale: 1, duration: .6, ease: EASE});
    });
    list.addEventListener('pointerenter', e => { gsap.set(float, {x: e.clientX + 230, y: e.clientY}); gsap.to(float, {opacity: 1, scale: 1, duration: .45, ease: 'back.out(1.6)'}); });
    list.addEventListener('pointerleave', () => gsap.to(float, {opacity: 0, scale: .6, duration: .3, ease: 'power2.in'}));
  }

  /* ---------- 5. Boutons magnétiques ---------- */
  if (fine){
    $$('.btn, .arw, .top a.nav, .sq').forEach(el => {
      el.classList.add('magnet');
      gsap.set(el, {'--mx': '0px', '--my': '0px'});
      const mx = gsap.quickTo(el, '--mx', {duration: .5, ease: EASE});
      const my = gsap.quickTo(el, '--my', {duration: .5, ease: EASE});
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * .3); my((e.clientY - r.top - r.height / 2) * .35);
      });
      el.addEventListener('pointerleave', () => { mx(0); my(0); });
    });
  }

  /* Les images chargées tard décalent la page : on recalcule les déclencheurs */
  window.addEventListener('load', () => ScrollTrigger.refresh());

  /* ---------- Points d'accroche appelés par main.js ---------- */
  window.motion = {
    /* changement de filtre du portfolio : les cartes sortent puis rentrent en cascade */
    swapPf(track, run){
      const cards = $$('.card > *', track);
      gsap.to(cards, {opacity: 0, y: 24, duration: .22, stagger: .015, ease: 'power2.in', overwrite: true, onComplete: () => { run(); pfIn(); }});
      if (!cards.length) { run(); pfIn(); }
    },

    /* ouverture d'une fenêtre : fondu, et pour un look la photo grandit depuis sa vignette */
    ovIn(el, src){
      gsap.killTweensOf(el);
      gsap.fromTo(el, {opacity: 0}, {opacity: 1, duration: .35, ease: 'power2.out'});
      if (el.id === 'lb'){
        const img = $('#lbImg'), from = src && src.querySelector('img');
        gsap.fromTo($$('.lb-tx > *', el), {opacity: 0, x: 40}, {opacity: 1, x: 0, duration: .8, ease: EXPO, stagger: .07, delay: .2});
        const flip = () => {
          if (!from) return gsap.fromTo(img, {scale: .9, opacity: 0}, {scale: 1, opacity: 1, duration: .7, ease: EXPO});
          const a = from.getBoundingClientRect(), b = img.getBoundingClientRect();
          if (!b.width) return;
          gsap.fromTo(img, {x: a.left - b.left, y: a.top - b.top, scaleX: a.width / b.width, scaleY: a.height / b.height, transformOrigin: '0 0'},
            {x: 0, y: 0, scaleX: 1, scaleY: 1, duration: .85, ease: EXPO, clearProps: 'transform'});
        };
        img.complete ? flip() : img.addEventListener('load', flip, {once: true});
      } else {
        gsap.fromTo($('.bk', el), {y: 50, opacity: 0, scale: .98}, {y: 0, opacity: 1, scale: 1, duration: .8, ease: EXPO, clearProps: 'transform'});
      }
    },
    ovOut(el, done){
      gsap.killTweensOf(el);
      gsap.to(el, {opacity: 0, duration: .25, ease: 'power2.in', onComplete: () => { done(); gsap.set(el, {clearProps: 'opacity'}); }});
    },

    /* réservation : glissement entre étapes, barre qui se remplit, « merci » festif */
    bkStep(step, prev){
      const dir = step >= prev ? 1 : -1;
      gsap.fromTo($('#bkBody').children, {opacity: 0, x: 50 * dir}, {opacity: 1, x: 0, duration: .6, ease: EXPO, clearProps: 'transform'});
      const bar = $('#prog li.cur i');
      if (bar && dir > 0) gsap.fromTo(bar, {scaleX: 0}, {scaleX: 1, duration: .8, ease: 'power3.inOut', delay: .1});
      if (step === 5) celebrate();
    }
  };

  function celebrate(){
    const word = $('.merci'); if (!word) return;
    const chars = split(word);
    gsap.fromTo(chars, {yPercent: 100, opacity: 0, rotation: 12}, {yPercent: 0, opacity: 1, rotation: 0, duration: 1, ease: 'elastic.out(1, .6)', stagger: .06});
    const box = $('#bk .bk-main'), br = box.getBoundingClientRect(), wr = word.getBoundingClientRect();
    const cx = wr.left - br.left + wr.width / 2, cy = wr.top - br.top + wr.height / 2;
    for (let i = 0; i < 46; i++){
      const s = document.createElement('span');
      s.className = 'spark' + (i % 3 ? (i % 3 === 1 ? ' s2' : ' s3') : '');
      s.setAttribute('aria-hidden', 'true');
      box.appendChild(s);
      const ang = Math.random() * Math.PI * 2, dist = 90 + Math.random() * 260;
      gsap.fromTo(s, {left: cx, top: cy, scale: 0, opacity: 1},
        {x: Math.cos(ang) * dist, y: Math.sin(ang) * dist * .7 + 60, scale: gsap.utils.random(.6, 1.6), rotation: gsap.utils.random(-180, 180),
         opacity: 0, duration: gsap.utils.random(1.1, 2), ease: 'power3.out', delay: .15 + Math.random() * .2, onComplete: () => s.remove()});
    }
  }
  } catch (err) {
    console.error('motion désactivé :', err);
    ScrollTrigger.getAll().forEach(t => t.kill()); gsap.globalTimeline.clear();
    gsap.set([...document.querySelectorAll('body *')].filter(el => !el.closest('#track')), {clearProps: 'opacity,transform,filter,--line'});
    root.classList.remove('m'); delete window.motion;
  }
})();
