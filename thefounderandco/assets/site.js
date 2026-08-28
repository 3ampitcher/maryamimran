/* =====================================================================
   TheFounder&Co. — shared site behaviour
   One config object drives every contact link on both pages.
   Change it here and nowhere else.
===================================================================== */

const SITE = {
  email:        'imran@rethinkhrs.com',
  phoneDisplay: '+966 50 778 4932',
  whatsapp:     '966507784932',          // digits only, country code first
  website:      'thefounderandco.com',
  linkedin:     'https://ae.linkedin.com/in/middleeastleadership',
  location:     'GCC · MENA',
  domain:       'https://thefounderandco.com',

  // Where the solver's email capture posts. Paste a Formspree / Getform /
  // Basin endpoint here and submissions go straight to your inbox with the
  // visitor's full selection attached. Leave it empty and the form falls
  // back to opening a prefilled email instead, so it still works today.
  formEndpoint: ''
};

/* ---------- footer contact block ---------- */
function renderContact(el){
  if(!el) return;
  const rows = [
    `<a href="mailto:${SITE.email}">${SITE.email}</a>`,
    `<a href="tel:+${SITE.whatsapp}">${SITE.phoneDisplay}</a>`,
    `<a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>`,
    `<a href="https://${SITE.website}">${SITE.website}</a>`
  ];
  if(SITE.linkedin) rows.push(`<a href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`);
  rows.push(`<span>${SITE.location}</span>`);
  el.innerHTML = rows.join('');
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

document.addEventListener('DOMContentLoaded', ()=>{
  renderContact(document.getElementById('footContact'));
  renderContact(document.getElementById('contactList'));
  const yr = document.getElementById('yr');
  if(yr) yr.textContent = new Date().getFullYear();
  initProgress();
  initReveal();
});
