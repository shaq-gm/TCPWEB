export function initAbout() {
 if (!document.querySelector('.about-page')) return;
 initAboutGallery();
 initPhotoStrip();
}
// A discrete, looping three-image gallery; thumbnails and pagination stay in sync.
export function initAboutGallery(gallery = document.querySelector('.about-gallery')) {
  if (!gallery) return;
  const slides = [...gallery.querySelectorAll('[data-gallery-slide]')];
  const copies = [...gallery.querySelectorAll('[data-gallery-copy]')];
  const selectors = [...gallery.querySelectorAll('[data-about-slide]')];
  const status = gallery.querySelector('[data-gallery-status]');
  let current = 0;
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    copies.forEach((copy, i) => { copy.hidden = i !== current; });
    selectors.forEach(button => button.setAttribute('aria-current', String(Number(button.dataset.aboutSlide) === current)));
    status.textContent = `${slides[current].querySelector('figcaption').textContent.trim()}`;
  }
  selectors.forEach(button => button.addEventListener('click', () => show(Number(button.dataset.aboutSlide))));
  gallery.querySelector('[data-gallery-prev]').addEventListener('click', () => show(current - 1));
  gallery.querySelector('[data-gallery-next]').addEventListener('click', () => show(current + 1));
  gallery.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    show(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : current + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  let touchStart;
  const display = gallery.querySelector('.about-gallery-display');
  display.addEventListener('touchstart', event => { touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null; }, { passive: true });
  display.addEventListener('touchend', event => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });
  display.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
}

function initPhotoStrip() {
 const track = document.querySelector('.about-photo-track');
 const pause = document.querySelector('[data-photo-pause]');
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 let paused = motion.matches || !!navigator.connection?.saveData;
 let hovering = false, focused = false, visible = false, previous = 0, frame;
 const originals = [...track.children];
 // Duplicate only presentation images to make the continuous strip seamless.
 originals.forEach(item => { const clone = item.cloneNode(true); clone.setAttribute('aria-hidden','true'); clone.querySelector('img').alt=''; track.append(clone); });
 const loopWidth = () => track.children[originals.length].offsetLeft - originals[0].offsetLeft;
 function paint(time) {
  const delta = previous ? Math.min(time-previous, 50) : 0; previous = time;
  if (!paused && !hovering && !focused && visible && !document.hidden) {
   track.scrollLeft += delta * .035;
   if (track.scrollLeft >= loopWidth()) track.scrollLeft -= loopWidth();
  }
  frame = requestAnimationFrame(paint);
 }
 function label() { pause.textContent = paused ? 'Play' : 'Pause'; pause.setAttribute('aria-label', paused ? 'Play photo carousel' : 'Pause photo carousel'); pause.setAttribute('aria-pressed',String(paused)); }
 function move(direction) { paused=true; label(); track.scrollBy({left: direction * (originals[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap)),behavior:motion.matches?'instant':'smooth'}); }
 pause.hidden=false; label();
 pause.addEventListener('click',()=>{paused=!paused;label()});
 document.querySelector('[data-photo-prev]').addEventListener('click',()=>move(-1));
 document.querySelector('[data-photo-next]').addEventListener('click',()=>move(1));
 track.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();move(event.key==='ArrowLeft'?-1:1)}});
 track.addEventListener('pointerenter',()=>{hovering=true}); track.addEventListener('pointerleave',()=>{hovering=false});
 track.addEventListener('focusin',()=>{focused=true}); track.addEventListener('focusout',()=>{focused=false});
 track.addEventListener('touchstart',()=>{paused=true;label()},{passive:true});
 motion.addEventListener('change',()=>{if(motion.matches){paused=true;label()}});
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting}).observe(track);
 frame=requestAnimationFrame(paint);
 window.addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
}
