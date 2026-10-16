import { initCarousel } from "./carousel.js";
export function initPartnershipPreview() {
  initPartnerHero();
  document.querySelectorAll('[data-showcase]').forEach(section => {
    initCarousel({
      track: section.querySelector('.showcase-track'),
      prev: section.querySelector('[data-showcase-prev]'),
      next: section.querySelector('[data-showcase-next]'),
      barContainer: section.querySelector('.carousel-bars'),
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)'),
      label: section.querySelector('h2').textContent,
      status: section.querySelector('.showcase-status'),
    });
  });
  initPartnerLogoWall();
  const form = document.querySelector('[data-partnership-preview]');
  if (!form) return;
  const feedback = form.querySelector('[role="status"]');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    feedback.textContent = 'This is a UI preview. Nothing has been submitted.';
  });
  form.addEventListener('input', () => { feedback.textContent = ''; });
  // Keep the preview from submitting even if JavaScript fails to load.
  form.querySelector('fieldset').disabled = false;
}

function initPartnerHero() {
  const hero = document.querySelector('.partner-hero');
  if (!hero) return;
  const video = hero.querySelector('video');
  const toggle = hero.querySelector('.partner-video-toggle');
  const header = document.querySelector('.site-header');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let requested = !motion.matches && !navigator.connection?.saveData;
  let visible = true;
  video.muted = true;
  function updateControl() {
    const playing = !video.paused;
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? 'Pause background video' : 'Play background video');
    toggle.innerHTML = playing ? 'Pause video <span aria-hidden="true">Ⅱ</span>' : 'Play video <span aria-hidden="true">▷</span>';
  }
  function sync() {
    if (!requested || !visible || document.hidden) { video.pause(); return; }
    if (!video.getAttribute('src')) {
      video.src = matchMedia('(max-width: 700px)').matches ? '/assets/hero-mobile.mp4' : '/assets/hero.mp4';
      video.load();
    }
    video.play().catch(error => {
      // A visibility/manual pause can abort a pending play without opting out.
      if (error.name === 'AbortError' || !visible || document.hidden || !requested) return;
      requested = false;
      updateControl();
    });
  }
  toggle.addEventListener('click', () => { requested = !requested; sync(); });
  video.addEventListener('play', updateControl);
  video.addEventListener('pause', updateControl);
  video.addEventListener('error', () => { requested = false; video.pause(); updateControl(); });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    header.classList.toggle('is-over-content', !visible);
    sync();
  }).observe(hero);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', () => { requested = !motion.matches && !navigator.connection?.saveData; sync(); });
  toggle.hidden = false;
  updateControl();
  sync();
}

// Reference trigger: section top at viewport center, scale 0 -> 1 in 0.8s,
// back.out(1.4); reverse in 0.4s with power2.in. No translation or rotation.
function initPartnerLogoWall() {
  const wall = document.querySelector('.partner-logo-wall');
  if (!wall || !('IntersectionObserver' in window)) return;
  const stage = wall.querySelector('.partner-cup-stage');
  const cup = wall.querySelector('.partner-cup');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let animation;
  let entered;
  let near = false;
  let frame = 0;
  const clamp = value => Math.max(0, Math.min(1, value));
  const backOut = t => 1 + 2.4 * (t - 1) ** 3 + 1.4 * (t - 1) ** 2;
  function scaleNow() {
    const matrix = getComputedStyle(stage).transform;
    return matrix === 'none' ? 1 : new DOMMatrixReadOnly(matrix).a;
  }
  function transition(show) {
    const from = scaleNow();
    animation?.cancel();
    const to = show ? 1 : 0;
    stage.style.transform = `scale(${to})`;
    const keyframes = Array.from({ length: 61 }, (_, index) => {
      const t = index / 60;
      const easing = show ? backOut(t) : t ** 3;
      return { transform: `scale(${from + (to - from) * easing})`, offset: t };
    });
    animation = stage.animate(keyframes, { duration: show ? 800 : 400, easing: 'linear' });
  }
  function update() {
    frame = 0;
    wall.classList.toggle('has-cup-motion', !reduced.matches);
    if (reduced.matches) {
      animation?.cancel();
      stage.style.removeProperty('transform');
      cup.style.removeProperty('transform');
      entered = undefined;
      return;
    }
    const bounds = wall.getBoundingClientRect();
    const height = window.innerHeight;
    const show = bounds.top <= height / 2;
    if (show !== entered) {
      entered = show;
      transition(show);
    }
    // Match the reference's subtle 1 -> 1.1 scroll growth, independently of pop-in.
    const progress = clamp((height - bounds.top) / (height + bounds.height));
    cup.style.transform = `scale(${1 + progress * .1})`;
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  // Hide before the first observer callback; deep links still grow in place.
  if (!reduced.matches) stage.style.transform = 'scale(0)';
  new IntersectionObserver(entries => {
    near = entries[0].isIntersecting;
    schedule();
  }, { rootMargin: '100% 0px' }).observe(wall);
  window.addEventListener('scroll', () => { if (near) schedule(); }, { passive: true });
  window.addEventListener('resize', schedule);
  reduced.addEventListener('change', schedule);
  schedule();
}
