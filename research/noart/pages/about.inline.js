!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);


  function initDraggableMarquee() {
    const wrappers = document.querySelectorAll('[data-draggable-marquee-init]');

    const getNumberAttr = (el, name, fallback) => {
      const value = parseFloat(el.getAttribute(name));
      return Number.isFinite(value) ? value : fallback;
    };

    wrappers.forEach((wrapper) => {
      if (wrapper.getAttribute('data-draggable-marquee-init') === 'initialized') return;

      const collection = wrapper.querySelector('[data-draggable-marquee-collection]');
      const list = wrapper.querySelector('[data-draggable-marquee-list]');
      if (!collection || !list) return;

      const duration = getNumberAttr(wrapper, 'data-duration', 20);
      const multiplier = getNumberAttr(wrapper, 'data-multiplier', 40);
      const sensitivity = getNumberAttr(wrapper, 'data-sensitivity', 0.01);

      const wrapperWidth = wrapper.getBoundingClientRect().width;
      const listWidth = list.scrollWidth || list.getBoundingClientRect().width;
      if (!wrapperWidth || !listWidth) return;

      // Make enough duplicates to cover screen
      const minRequiredWidth = wrapperWidth + listWidth + 2;
      while (collection.scrollWidth < minRequiredWidth) {
        const listClone = list.cloneNode(true);
        listClone.setAttribute('data-draggable-marquee-clone', '');
        listClone.setAttribute('aria-hidden', 'true');
        collection.appendChild(listClone);
      }

      const wrapX = gsap.utils.wrap(-listWidth, 0);

      gsap.set(collection, { x: 0 });

      const marqueeLoop = gsap.to(collection, {
        x: -listWidth,
        duration,
        ease: 'none',
        repeat: -1,
        onReverseComplete: () => marqueeLoop.progress(1),
        modifiers: {
          x: (x) => wrapX(parseFloat(x)) + 'px',
        },
      });

      // Direction can be used for css + set initial direction on load
      const initialDirectionAttr = (wrapper.getAttribute('data-direction') || 'left').toLowerCase();
      const baseDirection = initialDirectionAttr === 'right' ? -1 : 1;

      const timeScale = { value: 1 };

      timeScale.value = baseDirection;
      wrapper.setAttribute('data-direction', baseDirection < 0 ? 'right' : 'left');

      if (baseDirection < 0) marqueeLoop.progress(1);

      function applyTimeScale() {
        marqueeLoop.timeScale(timeScale.value);
        wrapper.setAttribute('data-direction', timeScale.value < 0 ? 'right' : 'left');
      }

      applyTimeScale();

      // Drag observer
      const marqueeObserver = Observer.create({
        target: wrapper,
        type: 'pointer,touch',
        preventDefault: true,
        debounce: false,
        onChangeX: (observerEvent) => {
          let velocityTimeScale = observerEvent.velocityX * -sensitivity;
          velocityTimeScale = gsap.utils.clamp(-multiplier, multiplier, velocityTimeScale);

          gsap.killTweensOf(timeScale);

          const restingDirection = velocityTimeScale < 0 ? -1 : 1;

          gsap.timeline({ onUpdate: applyTimeScale }).to(timeScale, { value: velocityTimeScale, duration: 0.1, overwrite: true }).to(timeScale, { value: restingDirection, duration: 1.0 });
        },
      });

      // Pause marquee when scrolled out of view
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => {
          marqueeLoop.resume();
          applyTimeScale();
          marqueeObserver.enable();
        },
        onEnterBack: () => {
          marqueeLoop.resume();
          applyTimeScale();
          marqueeObserver.enable();
        },
        onLeave: () => {
          marqueeLoop.pause();
          marqueeObserver.disable();
        },
        onLeaveBack: () => {
          marqueeLoop.pause();
          marqueeObserver.disable();
        },
      });

      wrapper.setAttribute('data-draggable-marquee-init', 'initialized');
    });
  }

  // Initialize Draggable Marquee (Directional)
  document.addEventListener('DOMContentLoaded', () => {
    initDraggableMarquee();
  });


gsap.registerPlugin(ScrollTrigger,SplitText,ScrambleTextPlugin,Flip,CustomEase,Observer,Draggable,InertiaPlugin);

document.addEventListener("DOMContentLoaded", function() {function loadnoartmusic(e){let t=document.createElement("script");t.setAttribute("src",e),t.setAttribute("type","module"),document.body.appendChild(t),t.addEventListener("load",()=>{console.log("Slater loaded No Art Music.js: https://slater.app/20350.js 🤙")}),t.addEventListener("error",e=>{console.log("Error loading file",e)})}let src=window.location.host.includes("webflow.io")?"https://slater.app/20350.js":"https://assets.slater.app/slater/20350.js?v=1.0";loadnoartmusic(src);})


  // ============================================
  // PAGE TRANSITIONS
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('.page-transition');
    const content = document.querySelector('.page-content');

    // Make content visible now that GSAP is ready (no flicker)
    gsap.set(content, { opacity: 1, visibility: 'visible' });
    // Position overlay covering the screen
    gsap.set(overlay, { y: 0 });
    gsap.to(overlay, {
      y: '-100%',
      duration: 0.8,
      delay: 0.5,
      ease: 'power3.inOut'
    });
    // ----- EXIT ANIMATION (runs before navigating away) -----
    const handleLinkClick = (e) => {
      const link = e.currentTarget;
      const href = link.getAttribute('href');
      // Bail out if it's not a real navigation
      if (
        !href ||
        href.startsWith('#') ||                          // anchor link
        href.startsWith('mailto:') ||                    // email
        href.startsWith('tel:') ||                       // phone
        link.target === '_blank' ||                      // new tab
        link.hasAttribute('download') ||                 // download
        e.metaKey || e.ctrlKey || e.shiftKey             // user opening in new tab
      ) {
        return;
      }
      // Only intercept internal links (same origin)
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      e.preventDefault();
      // Animate overlay back in, then navigate
      gsap.set(overlay, { y: '100%' }); // ensure it starts below
      gsap.to(overlay, {
        y: 0,
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => {
          window.location.href = href;
        }
      });
    };
    // Attach to every internal link
    document.querySelectorAll('a[href]').forEach(link => {
      link.addEventListener('click', handleLinkClick);
    });
    // ----- BFCACHE FIX -----
    // When user hits back button, browser may restore the page with
    // the overlay still covering it. Re-run the reveal in that case.
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        gsap.set(overlay, { y: 0 });
        gsap.to(overlay, {
          y: '-100%',
          duration: 0.8,
          delay: 0.5,
          ease: 'power3.inOut'
        });
      }
    });
  });



  // ============================================
  // PRODUCT CARDS: hover image + contain switches
  // Hover image: 2nd gallery image from the hidden [data-product-hover-data] list
  // (gallery image 1 is the main image).
  // Contain: CMS switches "Main image contain" / "Hover image contain", read from the
  // hidden [data-product-fit] lists (filtered on those switches). The empty space
  // gets the edge colour of the photo, so it blends with white or any flat background.
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    // slug -> src of the 2nd gallery image
    const hoverImages = {};
    document.querySelectorAll('[data-product-hover-data] [data-hover-slug]').forEach((item) => {
      const image = item.querySelectorAll('img')[1];
      const src = image && image.getAttribute('src');
      if (src) hoverImages[item.getAttribute('data-hover-slug')] = src;
    });

    const getFitSlugs = (type) => new Set(
      Array.from(document.querySelectorAll(`[data-product-fit="${type}"] [data-fit-slug]`))
        .map((item) => item.getAttribute('data-fit-slug'))
    );
    const fitMain = getFitSlugs('main');
    const fitHover = getFitSlugs('hover');

    if (!Object.keys(hoverImages).length && !fitMain.size && !fitHover.size) return;

    // Edge colour of a photo: median of the border pixels, cached per src
    const edgeColors = {};
    const getEdgeColor = (src) => {
      if (!edgeColors[src]) {
        edgeColors[src] = new Promise((resolve) => {
          const image = new Image();
          image.crossOrigin = 'anonymous';
          image.onload = () => {
            try {
              const size = 24;
              const canvas = document.createElement('canvas');
              canvas.width = size;
              canvas.height = size;
              const context = canvas.getContext('2d');
              context.drawImage(image, 0, 0, size, size);
              const data = context.getImageData(0, 0, size, size).data;
              const channels = [[], [], []];
              for (let i = 0; i < size * size; i++) {
                const x = i % size;
                const y = Math.floor(i / size);
                if (x > 0 && y > 0 && x < size - 1 && y < size - 1) continue;
                for (let c = 0; c < 3; c++) channels[c].push(data[i * 4 + c]);
              }
              const median = (values) => values.sort((a, b) => a - b)[values.length >> 1];
              resolve(`rgb(${channels.map(median).join(', ')})`);
            } catch (error) {
              resolve(null);
            }
          };
          image.onerror = () => resolve(null);
          image.src = src;
        });
      }
      return edgeColors[src];
    };

    const containLayer = (card, layer, attribute) => {
      const image = layer && layer.querySelector('img');
      const src = image && image.getAttribute('src');
      if (!src) return;
      card.setAttribute(attribute, '');
      getEdgeColor(src).then((color) => {
        if (color) layer.style.backgroundColor = color;
      });
    };

    const getSlug = (card) =>
      (card.getAttribute('href') || '').split(/[?#]/)[0].split('/').filter(Boolean).pop();

    const setupCard = (card) => {
      if (card.hasAttribute('data-card-ready')) return;
      card.setAttribute('data-card-ready', '');
      const slug = getSlug(card);
      const main = card.querySelector('.product-card_thumbnail_main');
      const secondary = card.querySelector('.product-card_thumbnail_secondary');
      const target = secondary && secondary.querySelector('img');
      const hoverSrc = hoverImages[slug];

      if (hoverSrc && target) {
        target.removeAttribute('srcset');
        target.removeAttribute('sizes');
        target.setAttribute('src', hoverSrc);
        card.setAttribute('data-hover-image', '');
      }
      if (fitMain.has(slug)) containLayer(card, main, 'data-fit-main');
      if (fitHover.has(slug) && card.hasAttribute('data-hover-image')) {
        containLayer(card, secondary, 'data-fit-hover');
      }
    };

    document.querySelectorAll('.product-card').forEach(setupCard);

    // Cards added later (filters, slider clones) are set up as soon as they appear
    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.matches('.product-card')) setupCard(node);
          node.querySelectorAll('.product-card').forEach(setupCard);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  });



  document.addEventListener('DOMContentLoaded', function () {
    let imageEl = document.querySelector('.about-image_slider');
    let thumbEl = document.querySelector('.about-thumbnail_slider');
    if (!imageEl) return;
    let imageWrapper = imageEl.querySelector('.about-image_swiper-wrapper');
    if (!imageWrapper || imageWrapper.children.length === 0) return;
    let totalSlides = imageWrapper.children.length;
    let thumbCards = thumbEl ? Array.from(thumbEl.querySelectorAll('.image-card')) : [];
    let textItems = Array.from(document.querySelectorAll('.about-text_slider-item'));
    // Find the section containing this slider so we can locate nav + pagination
    let section = imageEl.closest('section') || document;
    let prevEl = section.querySelector('[swiper-button-prev]');
    let nextEl = section.querySelector('[swiper-button-next]');
    let paginationEl = section.querySelector('.swiper_pagination.is-about, .swiper_pagination.is-label, .swiper_pagination');
    function updateCounters(realIndex) {
      imageEl.querySelectorAll('.swiper-slide').forEach(function (slide) {
        let counter = slide.querySelector('.is-opacity-50');
        let slideRealIndex = slide.getAttribute('data-swiper-slide-index');
        let idx = slideRealIndex !== null ? parseInt(slideRealIndex) + 1 : realIndex + 1;
        if (counter) {
          counter.textContent = '(' + idx + ' of ' + totalSlides + ')';
        }
      });
      thumbCards.forEach(function (card, i) {
        let counter = card.querySelector('.is-opacity-50');
        if (counter) {
          counter.textContent = '(' + (i + 1) + ' of ' + totalSlides + ')';
        }
      });
    }
    function setActiveThumb(realIndex) {
      thumbCards.forEach(function (card, i) {
        card.classList.toggle('is-active', i === realIndex);
      });
    }
    function setActiveText(realIndex) {
      textItems.forEach(function (item, i) {
        item.classList.toggle('is-active', i === realIndex);
      });
    }
    let imageSwiper = new Swiper(imageEl, {
      effect: 'fade',
      fadeEffect: { crossFade: true },
      speed: 200,
      loop: true,
      slidesPerView: 1,
      allowTouchMove: true,
      navigation: {
        prevEl: prevEl,
        nextEl: nextEl,
      },
      pagination: paginationEl
        ? {
            el: paginationEl,
            clickable: true,
          }
        : undefined,
      on: {
        init: function (swiper) {
          updateCounters(swiper.realIndex);
          setActiveThumb(swiper.realIndex);
          setActiveText(swiper.realIndex);
        },
        slideChange: function (swiper) {
          updateCounters(swiper.realIndex);
          setActiveThumb(swiper.realIndex);
          setActiveText(swiper.realIndex);
        },
      },
    });
    thumbCards.forEach(function (card, i) {
      card.addEventListener('click', function () {
        imageSwiper.slideToLoop(i, 200);
      });
    });
  });



  if (typeof Draggable !== 'undefined') {
    Draggable.create('[data-draggable]', {
      bounds: '.section_about-image',
      inertia: true,
    });
  }
