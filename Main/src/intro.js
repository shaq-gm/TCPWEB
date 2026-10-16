// The percentage is the progress of the opening sequence, not a network meter.
export function initIntro(reducedMotion, mobile) {
  const root = document.documentElement;
  if (!root.classList.contains("intro-pending")) return;

  const media = document.querySelector(".hero-media");
  const brand = document.querySelector(".hero-brand");
  const progress = document.querySelector(".intro-progress");
  const percent = document.querySelector(".intro-percent");
  const bar = document.querySelector(".intro-bar");
  const regions = [
    ...document.querySelectorAll(".site-header, main, .site-footer"),
  ];
  const animations = [];
  let frame,
    finished = false;
  const start = performance.now();
  const out = "cubic-bezier(0.16, 1, 0.3, 1)";
  const inOut = "cubic-bezier(0.76, 0, 0.24, 1)";

  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(watchdog);
    cancelAnimationFrame(frame);
    root.classList.remove("intro-pending");
    for (const animation of animations) animation.cancel();
    for (const region of regions) {
      region.inert = false;
      region.removeAttribute("data-intro-inert");
    }
    reducedMotion.removeEventListener("change", onMotionChange);
    window.removeEventListener("pagehide", finish);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    try {
      sessionStorage.setItem("coffee-party:intro:v1", "played");
    } catch {}
  }
  const onMotionChange = () => {
    if (reducedMotion.matches) finish();
  };
  const onVisibilityChange = () => {
    if (document.hidden) finish();
  };
  const watchdog = setTimeout(finish, 6500);

  for (const region of regions) {
    region.inert = true;
    region.setAttribute("data-intro-inert", "");
  }
  reducedMotion.addEventListener("change", onMotionChange);
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pagehide", finish);

  function animate(element, frames, options) {
    const animation = element.animate(frames, { fill: "both", ...options });
    animations.push(animation);
    return animation;
  }
  try {
    // A center square, a held preview window, then a full-viewport reveal.
    animate(
      media,
      [
        { width: "0px", height: "0px", opacity: 0, offset: 0 },
        {
          width: "0px",
          height: "0px",
          opacity: 1,
          offset: 350 / 2950,
          easing: out,
        },
        { width: "64px", height: "64px", opacity: 1, offset: 950 / 2950 },
        { width: "64px", height: "64px", offset: 1150 / 2950, easing: inOut },
        {
          width: mobile.matches ? "65vw" : "45vw",
          height: mobile.matches ? "65vw" : "25vw",
          offset: 1950 / 2950,
        },
        {
          width: mobile.matches ? "65vw" : "45vw",
          height: mobile.matches ? "65vw" : "25vw",
          offset: 2150 / 2950,
          easing: inOut,
        },
        { width: "100%", height: "100%", opacity: 1, offset: 1 },
      ],
      { duration: 2950 },
    );
    const finalBrandWidth = getComputedStyle(brand).width;
    const previewBrandWidth = mobile.matches ? "55vw" : "35vw";
    animate(
      brand,
      [
        {
          transform: "translate(-50%, -50%) scale(0)",
          opacity: 0,
          width: previewBrandWidth,
          offset: 0,
          easing: inOut,
        },
        {
          transform: "translate(-50%, -50%) scale(1)",
          opacity: 1,
          width: previewBrandWidth,
          offset: 800 / 1800,
        },
        {
          transform: "translate(-50%, -50%) scale(1)",
          opacity: 1,
          width: previewBrandWidth,
          offset: 1000 / 1800,
          easing: inOut,
        },
        {
          transform: "translate(-50%, -50%) scale(1)",
          opacity: 1,
          width: finalBrandWidth,
          offset: 1,
        },
      ],
      { delay: 1150, duration: 1800 },
    );
    animate(
      progress,
      [
        { opacity: 0, transform: "translateX(-50%)", offset: 0 },
        { opacity: 1, transform: "translateX(-50%)", offset: 600 / 2650 },
        { opacity: 1, transform: "translateX(-50%)", offset: 2150 / 2650 },
        { opacity: 0, transform: "translateX(calc(-50% - 3em))", offset: 1 },
      ],
      { duration: 2650 },
    );
    const entering = [
      ...document.querySelectorAll(
        ".site-header, .hero-intro, .hero-next, .motion-control, .viewport-marks",
      ),
    ];
    const arrivals = entering.map((element) =>
      animate(
        element,
        element.matches(".motion-control, .viewport-marks")
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              {
                opacity: 0,
                transform: element.matches(".site-header")
                  ? "translateY(-32px)"
                  : "translateY(24px)",
              },
              { opacity: 1, transform: "translateY(0px)" },
            ],
        { delay: 3450, duration: 1000, easing: out },
      ),
    );

    function tick(now) {
      const t = Math.min(1, (now - start) / 2100);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const value = Math.round(eased * 100);
      percent.textContent = `${value}%`;
      bar.style.transform = `scaleX(${value / 100})`;
      if (!finished && t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    Promise.all(arrivals.map((animation) => animation.finished)).then(
      finish,
      finish,
    );
  } catch {
    finish();
  }
}
