import { initGlobe } from "./globe.js";
import { initIntro } from "./intro.js";
import { initSignupPreviews } from "./signup.js";

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const mobile = matchMedia("(max-width: 700px)");
const headerMenu = matchMedia("(max-width: 991px)");
const headerDesktopLock = matchMedia("(min-width: 1921px)");
const headerBands = [
  {
    query: matchMedia("(max-width: 479px)"),
    min: 320,
    max: 479,
    divisor: 390 / 16,
  },
  {
    query: matchMedia("(max-width: 767px)"),
    min: 480,
    max: 767,
    divisor: 600 / 16,
  },
  {
    query: matchMedia("(max-width: 991px)"),
    min: 768,
    max: 991,
    divisor: 834 / 16,
  },
];
const menu = document.querySelector("#site-menu");
const menuToggle = document.querySelector(".menu-toggle");
const preview = document.querySelector("#preview-dialog");
let previewOpener;
let menuAnimation;
let menuClosing;

menuToggle.addEventListener("click", () => {
  if (menu.open) return;
  menu.classList.remove("is-closing");
  menu.showModal();
  menuToggle.setAttribute("aria-expanded", "true");
  if (!reducedMotion.matches) {
    menuAnimation = menu.animate(
      [{ transform: "scale(0)" }, { transform: "scale(1)" }],
      {
        duration: 200,
        delay: 50,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "backwards",
      },
    );
  }
});
function closeMenu({ immediate = false } = {}) {
  if (!menu.open) return Promise.resolve();
  if (immediate || reducedMotion.matches) {
    menu.close();
    return Promise.resolve();
  }
  if (menuClosing) return menuClosing;
  const from = getComputedStyle(menu).transform;
  menuAnimation?.cancel();
  menu.classList.add("is-closing");
  menuAnimation = menu.animate(
    [{ transform: from }, { transform: "scale(0)" }],
    {
      duration: 200,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "forwards",
    },
  );
  // Keep the dialog modal until the panel and backdrop have both finished.
  menuClosing = Promise.allSettled([
    menuAnimation.finished,
    new Promise((resolve) => setTimeout(resolve, 250)),
  ])
    .then(() => {
      if (menu.open) menu.close();
    })
    .finally(() => {
      menuClosing = undefined;
    });
  return menuClosing;
}
document
  .querySelector("[data-close-menu]")
  .addEventListener("click", closeMenu);
menu.addEventListener("close", () => {
  menuToggle.setAttribute("aria-expanded", "false");
  menuAnimation?.cancel();
  menu.classList.remove("is-closing");
});
menu.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeMenu();
});
for (const dialog of [menu, preview])
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      dialog === menu ? closeMenu() : dialog.close();
  });

const messages = {
  Events: [
    "The next gathering.",
    "Event dates, locations and lineups are still to be announced. The cards on this homepage are design previews. The Events page will be built in the next stage.",
  ],
  Tickets: [
    "See you soon.",
    "Tickets are not on sale in this preview. Confirmed events and their official ticket links will appear on the Events page once announced.",
  ],
  "Our Story": [
    "Coffee. Music. People.",
    "This homepage is the first chapter. The full Coffee Party story will have its own page in a later stage.",
  ],
  Community: [
    "Find your people.",
    "The Community page is planned for a later stage. Cities, local networks and ways to take part will be added once confirmed.",
  ],
  Partnerships: [
    "Let’s make something.",
    "A dedicated Partnerships page and inquiry destination are planned. Contact details and approved collaboration stories still need to be supplied.",
  ],
  Projects: [
    "More to come.",
    "The Projects page is planned for a later stage. Confirmed initiatives and ways to take part will be added there.",
  ],
  Press: [
    "Watch this space.",
    "The Press page will be added when approved coverage, a press kit and a media contact are available.",
  ],
  Contact: [
    "Stay in touch.",
    "The Contact page is planned. A confirmed Coffee Party contact destination will be added before launch.",
  ],
  Privacy: [
    "Privacy, clearly.",
    "The privacy policy is awaiting approved content. This local homepage preview does not send or save signup details or use analytics.",
  ],
  Terms: [
    "The details matter.",
    "The terms page is awaiting approved content and will be added before the website launches.",
  ],
};
async function openPreview(key, opener) {
  previewOpener = menu.contains(opener) ? menuToggle : opener;
  if (menu.open) await closeMenu();
  const [heading, copy] = messages[key];
  document.querySelector("#dialog-heading").textContent = heading;
  document.querySelector("#dialog-copy").textContent = copy;
  preview.showModal();
}
document.querySelectorAll("[data-planned]").forEach((link) =>
  link.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    openPreview(link.dataset.planned, link);
  }),
);
document
  .querySelectorAll("[data-close-dialog]")
  .forEach((button) => button.addEventListener("click", () => preview.close()));
preview.addEventListener("close", () => previewOpener?.focus());

const groups = [...document.querySelectorAll(".footer-group")];
function footerLayout() {
  for (const group of groups) {
    group.open = !mobile.matches;
    group.querySelector("summary").tabIndex = mobile.matches ? 0 : -1;
  }
}
function clamp(min, value, max) {
  return Math.min(max, Math.max(min, value));
}
function headerScale(width) {
  for (const band of headerBands) {
    if (band.query.matches)
      return clamp(band.min, width, band.max) / band.divisor;
  }
  if (headerDesktopLock.matches) return 21.333333;
  return clamp(992, width, 2560) / 90;
}
function headerLayout() {
  // The layout width excludes the reserved scrollbar gutter during the intro.
  const width = document.documentElement.getBoundingClientRect().width;
  document.documentElement.style.setProperty(
    "--header-unit",
    `${headerScale(width)}px`,
  );
  if (!headerMenu.matches && menu.open) closeMenu({ immediate: true });
}
headerMenu.addEventListener("change", headerLayout);
headerDesktopLock.addEventListener("change", headerLayout);
for (const band of headerBands)
  band.query.addEventListener("change", headerLayout);
window.addEventListener("resize", headerLayout);
new ResizeObserver(headerLayout).observe(document.documentElement);
headerLayout();
document.querySelectorAll("[data-social-placeholder]").forEach((link) => {
  link.addEventListener("click", (event) => {
    // Adding a real href activates the link without changing this handler.
    if (link.getAttribute("href") === "#") event.preventDefault();
  });
});
groups.forEach((group) =>
  group.querySelector("summary").addEventListener("click", (event) => {
    if (!mobile.matches) event.preventDefault();
  }),
);
mobile.addEventListener("change", footerLayout);
footerLayout();
document
  .querySelectorAll("[data-year]")
  .forEach((el) => (el.textContent = new Date().getFullYear()));

const video = document.querySelector(".hero-video");
const videoToggle = document.querySelector("#video-toggle");
let playRequested = !reducedMotion.matches && !navigator.connection?.saveData;
let heroVisible = true;
function loadVideo() {
  if (video.getAttribute("src")) return;
  video.src = mobile.matches ? "/assets/hero-mobile.mp4" : "/assets/hero.mp4";
  video.load();
}
function syncVideo() {
  if (playRequested && heroVisible && !document.hidden) {
    loadVideo();
    video.play().catch(() => {
      playRequested = false;
      updateVideoButton();
    });
  } else video.pause();
  updateVideoButton();
}
function updateVideoButton() {
  const playing = playRequested && heroVisible && !document.hidden;
  videoToggle.innerHTML = playing
    ? 'Pause video <span aria-hidden="true">Ⅱ</span>'
    : 'Play video <span aria-hidden="true">▷</span>';
  videoToggle.setAttribute(
    "aria-label",
    playing ? "Pause background video" : "Play background video",
  );
}
videoToggle.addEventListener("click", () => {
  playRequested = !playRequested;
  syncVideo();
});
video.addEventListener("error", () => {
  playRequested = false;
  videoToggle.textContent = "Video unavailable";
  videoToggle.setAttribute(
    "aria-label",
    "Background video unavailable; still image displayed",
  );
  videoToggle.disabled = true;
});
new IntersectionObserver(
  ([entry]) => {
    heroVisible = entry.isIntersecting;
    document
      .querySelector(".site-header")
      .classList.toggle("is-over-content", !heroVisible);
    syncVideo();
  },
  { threshold: 0.05 },
).observe(video);
document.addEventListener("visibilitychange", syncVideo);
reducedMotion.addEventListener("change", () => {
  playRequested = !reducedMotion.matches && !navigator.connection?.saveData;
  syncVideo();
});

const track = document.querySelector("#event-track");
const cards = [...track.querySelectorAll(".event-card")];
const prev = document.querySelector("#events-prev");
const next = document.querySelector("#events-next");
const barContainer = document.querySelector(".carousel-bars");
let bars = [];
const step = () => cards[0].getBoundingClientRect().width + 20;
const maxScroll = () => track.scrollWidth - track.clientWidth;
const currentCard = () =>
  track.scrollLeft >= maxScroll() - 3
    ? bars.length - 1
    : Math.round(track.scrollLeft / step());
function scrollToCard(index) {
  track.scrollTo({
    left: Math.min(maxScroll(), Math.max(0, index) * step()),
    behavior: reducedMotion.matches ? "instant" : "smooth",
  });
}
function updateCarousel() {
  const overflow = track.scrollWidth - track.clientWidth;
  prev.disabled = track.scrollLeft < 3;
  next.disabled = track.scrollLeft >= overflow - 3;
  const index = currentCard();
  bars.forEach((bar, i) => {
    bar.setAttribute("aria-current", String(index === i));
    bar.disabled = overflow < 3;
  });
}
prev.addEventListener("click", () => scrollToCard(currentCard() - 1));
next.addEventListener("click", () => scrollToCard(currentCard() + 1));
track.addEventListener("scroll", updateCarousel, { passive: true });
track.addEventListener("keydown", (event) => {
  if (event.target !== track) return;
  if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
    event.preventDefault();
    scrollToCard(
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? cards.length - 1
          : currentCard() + (event.key === "ArrowLeft" ? -1 : 1),
    );
  }
});
function resizeCarousel() {
  // Ignore subpixel rounding at the end of a full card width.
  const count = Math.max(1, Math.ceil((maxScroll() - 2) / step()) + 1);
  barContainer.replaceChildren();
  bars = Array.from({ length: count }, (_, i) => {
    const button = document.createElement("button");
    button.setAttribute("aria-label", `Event preview position ${i + 1}`);
    button.addEventListener("click", () => scrollToCard(i));
    barContainer.append(button);
    return button;
  });
  updateCarousel();
}
new ResizeObserver(resizeCarousel).observe(track);
resizeCarousel();

const time = document.querySelector("#local-time");
const zone = document.querySelector("#local-zone");
function updateTime() {
  const now = new Date();
  time.dateTime = now.toISOString();
  time.textContent = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);
  zone.textContent = Intl.DateTimeFormat()
    .resolvedOptions()
    .timeZone.replaceAll("_", " ");
}
updateTime();
setInterval(() => {
  if (!document.hidden) updateTime();
}, 1000);
initSignupPreviews();
initGlobe(reducedMotion);
initIntro(reducedMotion, mobile);
