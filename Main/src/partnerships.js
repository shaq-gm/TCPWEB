import { initCarousel } from "./carousel.js";
export function initPartnershipPreview() {
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
  const track = document.querySelector('.partner-logo-track');
  if (track) {
    const prev = document.querySelector('[data-brand-prev]');
    const next = document.querySelector('[data-brand-next]');
    const status = document.querySelector('.partner-carousel-status');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const items = [...track.children];
    function update() {
      prev.disabled = track.scrollLeft < 3;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 3;
      const box = track.getBoundingClientRect();
      const visible = items.map((item, i) => ({ i, box: item.getBoundingClientRect() }))
        .filter(item => item.box.right > box.left + 4 && item.box.left < box.right - 4);
      if (visible.length) status.textContent = `Brands ${visible[0].i + 1}–${visible.at(-1).i + 1} of ${items.length}`;
    }
    function move(direction) {
      track.scrollBy({ left: direction * track.clientWidth, behavior: motion.matches ? 'instant' : 'smooth' });
    }
    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('scroll', update, { passive: true });
    track.addEventListener('keydown', event => {
      if (event.target !== track) return;
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        if (event.key === 'Home' || event.key === 'End') track.scrollTo({ left: event.key === 'Home' ? 0 : track.scrollWidth, behavior: motion.matches ? 'instant' : 'smooth' });
        else move(event.key === 'ArrowLeft' ? -1 : 1);
      }
    });
    new ResizeObserver(update).observe(track);
    update();
  }
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
