/* =====================================================================
   TheFounder&Co. — shared site behaviour
   One config object drives every contact link on both pages.
   Change it here and nowhere else.
===================================================================== */

const SITE = {
  email:        'imran@thefounderand.co',
  phoneDisplay: '+966 50 778 4932',
  whatsapp:     '966507784932',          // digits only, country code first
  website:      'thefounderand.co',
  linkedin:     'https://ae.linkedin.com/in/middleeastleadership',
  location:     'GCC · MENA',
  domain:       'https://thefounderand.co',

  // ---------------------------------------------------------------
  // WHERE SOLVER SUBMISSIONS GO.  Two minutes, once, then the solver
  // stops throwing away the answers people give it.
  //
  //   Web3Forms  (fastest -- no account)
  //     1. https://web3forms.com -> enter imran@thefounderand.co
  //     2. they email you an access key
  //     3. formEndpoint = 'https://api.web3forms.com/submit'
  //        formKey      = the key they sent
  //
  //   Formspree / Getform / Basin  (account, more features)
  //     create a form, paste its POST URL into formEndpoint,
  //     leave formKey empty.
  //
  // Leave both empty and the form still works -- it opens a prefilled
  // email instead -- but nothing reaches you unless the visitor sends it.
  // ---------------------------------------------------------------
  formEndpoint: '',
  formKey:      ''
};

/* ---------- footer contact block ---------- */
function renderContact(el){
  if(!el) return;
  // No site URL -- you are already on it. No LinkedIn -- it is Imran's
  // personal profile, so it belongs next to him, not in the company footer.
  el.innerHTML = [
    `<a href="mailto:${SITE.email}">${SITE.email}</a>`,
    `<a href="tel:+${SITE.whatsapp}">${SITE.phoneDisplay}</a>`,
    `<a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>`,
    `<span>${SITE.location}</span>`
  ].join('');
}

/* ---------- scroll progress ---------- */
function initProgress(){
  const bar = document.getElementById('progress');
  if(!bar) return;
  let ticking = false;
  const update = ()=>{
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? Math.min(window.scrollY / h, 1) : 0})`;
    ticking = false;
  };
  window.addEventListener('scroll', ()=>{
    if(!ticking){ ticking = true; requestAnimationFrame(update); }
  }, {passive:true});
  update();
}

/* ---------- scroll reveals ---------- */
function initReveal(root){
  const targets = (root || document).querySelectorAll('.rv, .rv-l, .lines, .draw');
  if(!targets.length) return;
  if(!('IntersectionObserver' in window) ||
     window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    targets.forEach(t=>t.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  // position-based, not ratio-based: a very tall element (a full service
  // column on mobile) may never reach a 12% visibility ratio.
  }, {threshold:0, rootMargin:'0px 0px -12% 0px'});
  targets.forEach(t=>io.observe(t));
}

/* <a data-site-link="linkedin"> picks up its href from SITE, and hides
   itself if that link is not set. */
function wireSiteLinks(){
  document.querySelectorAll('[data-site-link]').forEach(el=>{
    const url = SITE[el.dataset.siteLink];
    if(url) el.href = url; else el.remove();
  });
}

/* ---------- mobile menu ---------- */
/* The inline nav links are hidden under 720px. Rather than duplicate them in
   every page's markup, build the sheet from whatever .nav-link elements the
   page already has, so each page offers its own real navigation. */
function initMobileNav(){
  const nav = document.querySelector('.nav-outer > nav');
  if(!nav) return;
  const links = [...nav.querySelectorAll('.nav-link')];
  const cta   = nav.querySelector('.nav-cta');
  if(!links.length && !cta) return;

  const btn = document.createElement('button');
  btn.className = 'nav-menu';
  btn.type = 'button';
  btn.id = 'navMenu';
  btn.setAttribute('aria-label', 'Open menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'navSheet');
  btn.innerHTML = '<i></i>';
  nav.querySelector('.nav-right').insertBefore(btn, cta);

  const sheet = document.createElement('div');
  sheet.className = 'nav-sheet';
  sheet.id = 'navSheet';
  sheet.hidden = true;
  const rows = links.map((a,n)=>
    `<a href="${a.getAttribute('href')}"><em>0${n+1}</em>${a.textContent.trim()}</a>`);
  // the bar keeps only the wordmark and the menu button on phones, so the
  // action comes back here at full width instead of as a squeezed pill
  const action = cta
    ? `<a class="sheet-cta" href="${cta.getAttribute('href')}">Solve yours <span class="ar">&rarr;</span></a>`
    : '';
  sheet.innerHTML =
    `<div class="sheet-h">Menu</div>
     <nav class="sheet-links">${rows.join('')}</nav>
     ${action}
     <div class="sheet-foot">
       <a href="mailto:${SITE.email}">${SITE.email}</a>
       <a href="tel:+${SITE.whatsapp}">${SITE.phoneDisplay}</a>
       <span>${SITE.location}</span>
     </div>`;
  document.body.appendChild(sheet);

  let open = false, hideTimer = null;
  function setOpen(next){
    if(next === open) return;
    open = next;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', open);
    clearTimeout(hideTimer);
    if(open){
      sheet.hidden = false;
      // one frame with the element laid out, so the fade actually runs
      requestAnimationFrame(()=>sheet.classList.add('open'));
    } else {
      sheet.classList.remove('open');
      hideTimer = setTimeout(()=>{ if(!open) sheet.hidden = true; }, 360);
    }
  }

  btn.addEventListener('click', ()=>setOpen(!open));
  // a same-page hash does not reload, so the sheet has to close itself
  sheet.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>setOpen(false)));
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape' && open){ setOpen(false); btn.focus(); }
  });
  // the sheet only exists under 720px; leaving that width must not strand it
  window.addEventListener('resize', ()=>{ if(window.innerWidth > 720) setOpen(false); });
}

document.addEventListener('DOMContentLoaded', ()=>{
  wireSiteLinks();
  renderContact(document.getElementById('footContact'));
  renderContact(document.getElementById('contactList'));
  const yr = document.getElementById('yr');
  if(yr) yr.textContent = new Date().getFullYear();
  initProgress();
  initMobileNav();
  initReveal();
});
