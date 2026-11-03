// ===== header: sticky shadow, back-to-top, mobile menu, search =====
const bar=document.getElementById('hdBar'),topBtn=document.getElementById('toTop');
addEventListener('scroll',()=>{bar.classList.toggle('stuck',scrollY>133);topBtn.classList.toggle('show',scrollY>500)});
topBtn.onclick=()=>scrollTo({top:0,behavior:'smooth'});
const menu=document.getElementById('mainMenu'),burger=document.getElementById('burger'),ov=document.getElementById('mmOverlay'),closeBtn=document.getElementById('menuClose');
const isOpen=()=>menu.classList.contains('open');
function openMenu(){menu.classList.add('open');ov.classList.add('show');burger.classList.add('on');burger.setAttribute('aria-expanded','true');document.body.classList.add('no-scroll');setTimeout(()=>closeBtn.focus(),300)}
function closeMenu(back=true){menu.classList.remove('open');ov.classList.remove('show');burger.classList.remove('on');burger.setAttribute('aria-expanded','false');document.body.classList.remove('no-scroll');if(back)burger.focus()}
burger.onclick=()=>isOpen()?closeMenu():openMenu();
closeBtn.onclick=()=>closeMenu();ov.onclick=()=>closeMenu();
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>isOpen()&&closeMenu(false)));
addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(isOpen())closeMenu();sp.classList.remove('open')}
  if(e.key==='Tab'&&isOpen()){const f=[...menu.querySelectorAll('a,button,input')].filter(x=>x.offsetParent);const a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
addEventListener('resize',()=>{if(innerWidth>=992&&isOpen())closeMenu(false)});
// search: jumps to the first section that contains the text
const sp=document.getElementById('srchPanel'),sb=document.getElementById('srchBtn');
sb.onclick=()=>{const o=sp.classList.toggle('open');sb.setAttribute('aria-expanded',o);if(o)sp.querySelector('input').focus()};
document.querySelectorAll('.js-search').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();
  const q=f.querySelector('input').value.trim().toLowerCase(),m=f.querySelector('.s-msg');
  const hit=[...document.querySelectorAll('section[id],header[id]')].find(s=>s.textContent.toLowerCase().includes(q));
  if(hit){m.textContent='';sp.classList.remove('open');if(isOpen())closeMenu(false);hit.scrollIntoView({behavior:'smooth'})}else m.textContent='No results for “'+f.querySelector('input').value+'”.'}));
// reveal on scroll
document.querySelectorAll('.sv-item,.team-card,.proj,.section-head,.info-row').forEach((e,i)=>{e.classList.add('reveal');e.style.transitionDelay=(i%3)*0.1+'s'});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(e=>io.observe(e));
// counters
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);
  const n=+e.target.dataset.count;let c=0;const s=Math.max(1,Math.ceil(n/60));
  const t=setInterval(()=>{c=Math.min(n,c+s);e.target.textContent=c+(e.target.dataset.suffix||'');if(c>=n)clearInterval(t)},25)}),{threshold:.6});
document.querySelectorAll('[data-count]').forEach(e=>co.observe(e));
// project filter
document.querySelectorAll('.btn-chip').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.btn-chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');
  document.querySelectorAll('.proj').forEach(p=>p.classList.toggle('hide',b.dataset.f!=='all'&&p.dataset.c!==b.dataset.f))});
// demo forms
['quoteForm','contactForm'].forEach(id=>document.getElementById(id).addEventListener('submit',e=>{
  e.preventDefault();e.target.querySelector('.form-msg').hidden=false;e.target.reset()}));

// Testimonials: auto-sliding fade carousel; dots show progress and are clickable.
(()=>{const box=document.getElementById('testi2');if(!box)return;
const items=[...box.querySelectorAll('.tm-item')],dots=[...box.querySelectorAll('.tm-dots button')];
const DELAY=4500,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let cur=0,timer=null;
const show=n=>{cur=(n+items.length)%items.length;
  items.forEach((el,i)=>{const on=i===cur;el.classList.toggle('is-active',on);el.setAttribute('aria-hidden',on?'false':'true')});
  dots.forEach((d,i)=>{const on=i===cur;d.classList.toggle('active',on);d.setAttribute('aria-selected',on)})};
const stop=()=>{clearInterval(timer);timer=null};
const play=()=>{stop();if(!reduce&&items.length>1)timer=setInterval(()=>show(cur+1),DELAY)};
dots.forEach((d,i)=>d.addEventListener('click',()=>{show(i);play()}));
let x0=null;box.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});
box.addEventListener('touchend',e=>{if(x0===null)return;const d=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(d)>45){show(d<0?cur+1:cur-1);play()}});
document.addEventListener('visibilitychange',()=>document.hidden?stop():play());
show(0);play();})();
const yearEl=document.getElementById('currentYear');
if(yearEl) yearEl.textContent=new Date().getFullYear();

// services image slider: auto-play, seamless loop
(()=>{const box=document.getElementById('svSlider'),tr=document.getElementById('svTrack');
const orig=[...tr.children],total=orig.length;
orig.slice(0,4).forEach(s=>tr.appendChild(s.cloneNode(true)));
let i=0;const n=()=>+getComputedStyle(box).getPropertyValue('--n')||4;
const set=(x,anim)=>{tr.style.transition=anim?'transform .8s ease':'none';tr.style.transform=`translateX(${-x*100/n()}%)`};
const next=()=>{i++;set(i,true)};
const prev=()=>{if(i===0){i=total;set(i,false);tr.offsetWidth}i--;set(i,true)};
tr.addEventListener('transitionend',()=>{if(i>=total){i=0;set(0,false)}});
box.querySelector('.next').onclick=()=>{next();restart()};
box.querySelector('.prev').onclick=()=>{prev();restart()};
let t=setInterval(next,3000);const restart=()=>{clearInterval(t);t=setInterval(next,3000)};
addEventListener('resize',()=>{if(i>=total)i=0;set(i,false)});
let x0=null;box.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});
box.addEventListener('touchend',e=>{if(x0===null)return;const d=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(d)>45){d<0?next():prev();restart()}});})();
