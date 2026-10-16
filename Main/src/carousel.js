// Shared homepage/partnership pagination: previous, position markers, next.
export function initCarousel({ track, prev, next, barContainer, reducedMotion, label, status }) {
  const cards = [...track.children];
  let bars = [];
  const step = () => cards[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
  const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);
  const currentCard = () => track.scrollLeft >= maxScroll() - 3
    ? bars.length - 1 : Math.round(track.scrollLeft / step());
  function scrollToCard(index) {
    track.scrollTo({
      left: Math.min(maxScroll(), Math.max(0, index) * step()),
      behavior: reducedMotion.matches ? 'instant' : 'smooth',
    });
  }
  function update() {
    const overflow = maxScroll();
    prev.disabled = track.scrollLeft < 3;
    next.disabled = track.scrollLeft >= overflow - 3;
    const index = currentCard();
    bars.forEach((bar, i) => {
      bar.setAttribute('aria-current', String(index === i));
      bar.disabled = overflow < 3;
    });
    if (status) status.textContent = `Position ${index + 1} of ${bars.length}`;
  }
  prev.addEventListener('click', () => scrollToCard(currentCard() - 1));
  next.addEventListener('click', () => scrollToCard(currentCard() + 1));
  track.addEventListener('scroll', update, { passive: true });
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    scrollToCard(event.key === 'Home' ? 0 : event.key === 'End' ? bars.length - 1 : currentCard() + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  function resize() {
    const count = Math.max(1, Math.ceil((maxScroll() - 2) / step()) + 1);
    barContainer.replaceChildren();
    bars = Array.from({ length: count }, (_, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `${label} position ${i + 1}`);
      button.setAttribute('aria-controls', track.id);
      button.addEventListener('click', () => scrollToCard(i));
      barContainer.append(button);
      return button;
    });
    update();
  }
  new ResizeObserver(resize).observe(track);
  resize();
}
