const target = document.querySelector(".home-hero_background-video_content"),
  videoWrapper = document.querySelector(".background-video_wrapper"),
  loaderItems = document.querySelectorAll(".home-hero_loader-text_item"),
  loaderText = document.querySelector("[data-loader-text]"),
  loaderBar = document.querySelector("[data-loader-bar]");
if (target) {
  if (sessionStorage.getItem("heroLoaderPlayed"))
    (gsap.set(target, {
      position: "absolute",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      width: "100vw",
      height: "100vh",
      zIndex: 1,
      overflow: "hidden",
      autoAlpha: 1,
    }),
      videoWrapper && gsap.set(videoWrapper, { padding: 0 }),
      gsap.set(loaderItems, { autoAlpha: 0 }),
      gsap.set(".home-hero_loader-text_wrapper", { x: "-3em" }),
      gsap.set(".home-hero_loader-logo_wrapper", { scale: 1 }),
      loaderText && (loaderText.textContent = "100%"),
      loaderBar && gsap.set(loaderBar, { width: "100%" }),
      gsap.set(".home-hero_bottom > .container", { y: "0px", autoAlpha: 1 }),
      gsap.set(".navbar", { y: "0em", autoAlpha: 1 }),
      gsap.set(".navbar, .menu-button", { y: "0em", autoAlpha: 1 }),
      gsap.set(".home-hero-logo_markers, .marker-overlay", {
        autoAlpha: 1,
        scale: 1,
      }));
  else {
    (gsap.set(target, {
      position: "absolute",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      width: 0,
      height: 0,
      zIndex: 1,
      overflow: "hidden",
      autoAlpha: 0,
    }),
      gsap.set(loaderItems, { autoAlpha: 0 }),
      loaderText && (loaderText.textContent = "0%"),
      loaderBar && gsap.set(loaderBar, { width: "0%" }));
    const e = { value: 0 };
    gsap.to(e, {
      value: 100,
      duration: 2.1,
      ease: "power2.inOut",
      onUpdate: () => {
        const t = Math.round(e.value);
        (loaderText && (loaderText.textContent = t + "%"),
          loaderBar && (loaderBar.style.width = t + "%"));
      },
    });
    const t = gsap.timeline({
      defaults: { ease: "power4.inOut" },
      onComplete: () => {
        sessionStorage.setItem("heroLoaderPlayed", "true");
      },
    });
    (t.to(loaderItems, { autoAlpha: 1, duration: 0.6, ease: "power2.out" }),
      t.to(target, { autoAlpha: 1, duration: 0.05 }, "-=0.3"),
      t.to(
        target,
        { width: "4rem", height: "4rem", duration: 0.6, ease: "power4.out" },
        "-=0.3",
      ),
      t.to({}, { duration: 0.2 }));
    const o = window.matchMedia("(max-width: 767px)").matches;
    (t.to(target, {
      width: o ? "65vw" : "45vw",
      height: o ? "65vw" : "25vw",
      duration: 0.8,
      ease: "power4.inOut",
    }),
      t.to(
        ".home-hero_loader-logo_wrapper",
        { scale: 1, duration: 0.8, ease: "power4.inOut" },
        "<",
      ),
      t.to({}, { duration: 0.2 }),
      t.to(target, {
        width: "100vw",
        height: "100vh",
        duration: 0.8,
        ease: "power4.inOut",
      }),
      videoWrapper &&
        t.to(
          videoWrapper,
          { padding: 0, duration: 0.8, ease: "power4.inOut" },
          "<",
        ),
      t.to(
        loaderItems,
        { autoAlpha: 0, duration: 0.5, ease: "power2.in" },
        "<",
      ),
      t.to(
        ".home-hero_loader-text_wrapper",
        { x: "-3em", duration: 0.8, ease: "power4.inOut" },
        "<",
      ),
      t.to(
        ".home-hero_bottom > .container",
        { y: "0em", autoAlpha: 1, duration: 1, ease: "power4.out" },
        "+=0.5",
      ),
      t.to(
        ".navbar, .menu-button",
        { y: "0em", autoAlpha: 1, duration: 1, ease: "power4.out" },
        "<",
      ),
      t.to(
        ".home-hero-logo_markers, .marker-overlay",
        { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power4.out" },
        "<",
      ));
  }
}
gsap.to(".bunny-bg", {
  bottom: "-20%",
  ease: "none",
  scrollTrigger: {
    trigger: ".section_home-hero",
    start: "bottom bottom",
    end: "bottom top",
    scrub: !0,
  },
});
