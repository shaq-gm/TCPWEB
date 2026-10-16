// Same curtain as noartmusic.com: a black panel rises to cover the page,
// the next document paints underneath it, then the panel leaves through the top.
// A short line rides in the middle and changes on each page change.
const STORAGE_KEY = "coffee-party:page-transition";
const LINE_KEY = "coffee-party:page-transition-line";
const INDEX_KEY = "coffee-party:page-transition-index";
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const LINES = [
  "Coffee. Music. People.",
  "A different kind of morning",
  "Come for the coffee.",
  "Stay for the people.",
];
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ.";

export function initPageTransition(reducedMotion) {
  const root = document.documentElement;
  const overlay = document.querySelector(".page-transition");
  if (!overlay) return;

  const label = overlay.querySelector(".page-transition-text");
  let leaving = false;
  let generation = 0;
  let stopScramble = () => {};

  function clearOverlay() {
    stopScramble();
    overlay.getAnimations().forEach((animation) => animation.cancel());
    overlay.style.transform = "";
    root.classList.remove("page-enter", "page-leave");
  }

  function writeLine(line, scramble) {
    stopScramble();
    if (!label) return;
    if (!scramble) {
      label.textContent = line;
      return;
    }
    const target = line.toUpperCase();
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / 480);
      const keep = Math.floor(progress * target.length);
      let out = "";
      for (let i = 0; i < target.length; i++) {
        const char = target[i];
        if (char === " " || char === "." || i < keep) out += char;
        else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      label.textContent = out;
      if (progress < 1) frame = requestAnimationFrame(tick);
      else label.textContent = line;
    };
    let frame = requestAnimationFrame(tick);
    stopScramble = () => cancelAnimationFrame(frame);
  }

  function nextLine() {
    let index = 0;
    try {
      index = Number(sessionStorage.getItem(INDEX_KEY)) || 0;
    } catch {}
    return { line: LINES[index % LINES.length], index };
  }

  function reveal() {
    const id = ++generation;
    if (label && !label.textContent) label.textContent = LINES[0];
    if (reducedMotion.matches) {
      clearOverlay();
      return;
    }
    overlay.getAnimations().forEach((animation) => animation.cancel());
    const animation = overlay.animate(
      [{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }],
      { duration: 800, delay: 500, easing: EASE, fill: "forwards" },
    );
    animation.finished.then(() => {
      if (id === generation) clearOverlay();
    }, () => {});
  }

  if (root.classList.contains("page-enter")) reveal();

  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    root.classList.add("page-enter");
    reveal();
  });

  document.addEventListener(
    "click",
    (event) => {
      const source = event.target instanceof Element ? event.target : event.target?.parentElement;
      const link = source?.closest?.("a[href]") ?? null;
      if (!link || !shouldTransition(event, link)) return;
      event.preventDefault();
      event.stopPropagation();
      if (leaving) return;

      const href = new URL(link.href, location.href).href;
      const menu = document.querySelector("#site-menu");
      if (menu?.open) menu.close();
      if (reducedMotion.matches) {
        location.href = href;
        return;
      }

      leaving = true;
      const id = ++generation;
      const choice = nextLine();
      writeLine(choice.line, true);
      overlay.style.transform = "translateY(100%)";
      root.classList.remove("page-enter");
      root.classList.add("page-leave");
      overlay.getAnimations().forEach((animation) => animation.cancel());
      const animation = overlay.animate(
        [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }],
        { duration: 600, easing: EASE, fill: "forwards" },
      );
      let gone = false;
      const go = () => {
        if (gone || id !== generation) return;
        gone = true;
        try {
          sessionStorage.setItem(STORAGE_KEY, "1");
          sessionStorage.setItem(LINE_KEY, choice.line);
          sessionStorage.setItem(INDEX_KEY, String((choice.index + 1) % LINES.length));
        } catch {}
        location.href = href;
      };
      animation.finished.then(go, () => {
        if (id !== generation) return;
        leaving = false;
        clearOverlay();
      });
      setTimeout(go, 1000);
    },
    true,
  );
}

function shouldTransition(event, link) {
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (event.defaultPrevented) return false;
  if (link.target === "_blank" || link.hasAttribute("download")) return false;
  if (link.hasAttribute("data-planned") || link.hasAttribute("data-social-placeholder")) return false;
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  let url;
  try {
    url = new URL(link.href, location.href);
  } catch {
    return false;
  }
  if (url.origin !== location.origin) return false;
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  if (url.pathname === location.pathname && url.search === location.search) return false;
  return true;
}
