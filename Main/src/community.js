import { initCarousel } from './carousel.js';

export function initCommunity() {
  if (!document.querySelector('.community-page')) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.community-hero');
  const about = document.querySelector('.community-about');
  const callout = document.querySelector('.community-partner-callout');
  const clamp = value => Math.max(0, Math.min(1, value));
  let frame = 0;
  function updateSurface() {
    frame = 0;
    const bounds = about.getBoundingClientRect();
    // Start on paper and reach black as the about section fills the viewport.
    const progress = motion.matches ? 1 : clamp((innerHeight * .85 - bounds.top) / (innerHeight * .7));
    const paper = Math.round(255 - 247 * progress);
    about.style.setProperty('--about-paper', paper);
    // Keep text readable through the middle-gray part of the scroll transition.
    about.style.setProperty('--about-ink', paper <= 117 ? 255 : 0);
    const overHero = hero.getBoundingClientRect().bottom > 65;
    const overAbout = bounds.top < 65 && bounds.bottom > 65;
    const end = callout.getBoundingClientRect();
    const overCallout = end.top < 65 && end.bottom > 65;
    header.classList.toggle('is-over-content', !overHero);
    header.classList.toggle('is-over-dark', overHero || overAbout || overCallout);
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(updateSurface); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  motion.addEventListener('change', schedule);
  updateSurface();

  document.querySelectorAll('.community-video-section').forEach(section => {
    const video = section.querySelector('video');
    const toggle = section.querySelector('.community-video-toggle');
    let requested = !motion.matches && !navigator.connection?.saveData;
    let visible = false;
    let failed = false;
    video.muted = true;
    function updateControl() {
      const playing = !video.paused;
      toggle.textContent = failed ? 'Video unavailable' : playing ? 'Pause video Ⅱ' : 'Play video ▷';
      toggle.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${toggle.dataset.videoName} video`);
      toggle.setAttribute('aria-pressed', String(playing));
      toggle.disabled = failed;
    }
    function sync() {
      if (!requested || !visible || document.hidden || failed) { video.pause(); return; }
      if (!video.getAttribute('src')) {
        video.src = matchMedia('(max-width: 700px)').matches ? '/assets/hero-mobile.mp4' : '/assets/hero.mp4';
        video.load();
      }
      video.play().catch(error => {
        if (error.name === 'AbortError' || !visible || document.hidden || !requested) return;
        requested = false;
        updateControl();
      });
    }
    toggle.addEventListener('click', () => { requested = !requested; sync(); });
    video.addEventListener('play', updateControl);
    video.addEventListener('pause', updateControl);
    video.addEventListener('error', () => { failed = true; video.pause(); updateControl(); });
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .05 }).observe(section);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', () => { requested = !motion.matches && !navigator.connection?.saveData; sync(); });
    toggle.hidden = false;
    updateControl();
  });
  const ventures = document.querySelector('.community-ventures');
  initCarousel({ track: ventures.querySelector('.community-venture-track'), prev: ventures.querySelector('[data-ventures-prev]'), next: ventures.querySelector('[data-ventures-next]'), barContainer: ventures.querySelector('.carousel-bars'), reducedMotion: motion, label: 'Community ventures', status: ventures.querySelector('.community-venture-status') });
}
