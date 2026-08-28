/* =====================================================================
   TheFounder&Co. — shared site behaviour
   One config object drives every contact link on both pages.
   Change it here and nowhere else.
===================================================================== */

const SITE = {
  email:        'imran@rethinkhrs.com',
  phoneDisplay: '+966 54 123 4567',
  whatsapp:     '966541234567',          // digits only, country code first
  website:      'thefounderandco.com',
  linkedin:     '',                       // paste the profile URL and it appears everywhere
  location:     'Jeddah, Saudi Arabia'
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
  }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
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
