export function initEvents(reducedMotion) {
  const stage = document.querySelector('.events-listing');
  const viewport = stage.querySelector('.listing-viewport');
  const track = stage.querySelector('.listing-track');
  const originals = [...track.children];
  const selectors = [...stage.querySelectorAll('[data-event-select]')];
  const announcement = stage.querySelector('#event-announcement');
  const small = matchMedia('(max-width: 767px)');
  const cursor = stage.querySelector('.listing-cursor');
  let active = 0, position = 0, prefix = 0, moving = false, timer, wheelTime = 0;
  let start, dragged = false;
  const count = originals.length;
  const mod = n => (n % count + count) % count;
  const step = () => originals[0].getBoundingClientRect().height + 20;
  function paint(animate = false) {
    track.classList.toggle('is-moving', animate && !reducedMotion.matches);
    const y = (viewport.clientHeight - originals[0].getBoundingClientRect().height) / 2 - (position + prefix) * step();
    track.style.transform = `translateY(${y}px)`;
    [...track.children].forEach((card, i) => {
      const selected = i === position + prefix;
      card.classList.toggle('is-active', selected);
      card.querySelector('button').tabIndex = selected ? 0 : -1;
    });
    selectors.forEach(button => button.setAttribute('aria-pressed', String(+button.dataset.eventSelect === active)));
  }
  function settle() {
    clearTimeout(timer);
    moving = false;
    position = active;
    paint();
  }
  function select(index, animate = true) {
    if (document.querySelector('dialog[open]')) return;
    if (small.matches) index = Math.max(0, Math.min(count - 1, index));
    else if (index < -1 || index > count) index = mod(index);
    if (index === position) return;
    if (moving) settle();
    position = index;
    active = mod(index);
    paint(animate);
    announcement.textContent = `${active + 1} of ${count}. ${originals[active].getAttribute('aria-label')}. Date to be announced.`;
    moving = true;
    timer = setTimeout(settle, reducedMotion.matches ? 0 : 310);
  }
  function layout() {
    settle();
    track.querySelectorAll('[data-clone]').forEach(e => e.remove());
    prefix = small.matches ? 0 : count;
    if (prefix) {
      const clone = card => {
        const copy = card.cloneNode(true);
        copy.dataset.clone = '';
        copy.setAttribute('aria-hidden', 'true');
        copy.querySelector('button').tabIndex = -1;
        copy.querySelector('button').removeAttribute('data-planned');
        copy.querySelector('button').addEventListener('click', () => card.querySelector('button').click());
        return copy;
      };
      track.prepend(...originals.map(clone));
      track.append(...originals.map(clone));
    }
    position = active;
    paint();
  }
  selectors.forEach(button => button.addEventListener('click', () => select(+button.dataset.eventSelect)));
  stage.addEventListener('wheel', event => {
    if (document.querySelector('dialog[open]') || Math.abs(event.deltaY) < 3) return;
    event.preventDefault();
    const now = performance.now();
    if (now - wheelTime < 360) return;
    wheelTime = now;
    select(position + Math.sign(event.deltaY));
  }, { passive: false });
  viewport.addEventListener('keydown', event => {
    const directions = { ArrowDown: 1, ArrowUp: -1, PageDown: 1, PageUp: -1 };
    if (event.key in directions || ['Home', 'End'].includes(event.key)) {
      event.preventDefault();
      select(event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : position + directions[event.key]);
    }
  });
  viewport.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    start = { y: event.clientY, id: event.pointerId };
    dragged = false;
  });
  window.addEventListener('pointermove', event => {
    if (!start || event.pointerId !== start.id) return;
    if (Math.abs(event.clientY - start.y) > 12) dragged = true;
  });
  window.addEventListener('pointerup', event => {
    if (!start || event.pointerId !== start.id) return;
    const delta = start.y - event.clientY;
    start = undefined;
    if (Math.abs(delta) > 35) select(position + Math.sign(delta));
    setTimeout(() => { dragged = false; }, 0);
  });
  window.addEventListener('pointercancel', () => { start = undefined; dragged = false; });
  viewport.addEventListener('click', event => {
    if (dragged) { event.preventDefault(); event.stopPropagation(); }
  }, true);
  viewport.addEventListener('dragstart', event => event.preventDefault());
  viewport.addEventListener('pointermove', event => {
    cursor.style.left = `${event.clientX + 16}px`;
    cursor.style.top = `${event.clientY + 16}px`;
    cursor.classList.toggle('is-visible', !!event.target.closest('.is-active .listing-art'));
  });
  viewport.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  small.addEventListener('change', layout);
  new ResizeObserver(() => { settle(); paint(); }).observe(viewport);
  reducedMotion.addEventListener('change', settle);
  layout();
  // Independent of the homepage's once-per-session video introduction.
  if (!reducedMotion.matches) {
    const cover = document.createElement('div');
    cover.className = 'events-reveal';
    cover.innerHTML = '<span><span class="square"></span> Coffee. Music. People.</span>';
    document.body.append(cover);
    const animation = cover.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }], {
      duration: 800, delay: 500, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards'
    });
    animation.finished.catch(() => {}).finally(() => cover.remove());
    setTimeout(() => cover.remove(), 1800);
    addEventListener('pageshow', event => { if (event.persisted) cover.remove(); });
  }
}
