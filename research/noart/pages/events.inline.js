!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);

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



  // Number the event names
  document.querySelectorAll('.is-event-name').forEach((el, i) => {
    el.textContent = `[${i + 1}]`;
  });

  function updateSlideIndexes(swiper) {
    swiper.slides.forEach(function (slide, i) {
      let target = slide.querySelector('[data-slider-index]');
      if (target) {
        target.textContent = '[' + String(i + 1).padStart(2, '0') + ']';
      }
    });
  }

  // Check if mobile landscape or smaller (Webflow mobile landscape breakpoint: 767px)
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  const cardsSwiper = new Swiper('[data-events-swiper-vertical]', {
    direction: 'vertical',
    slidesPerView: 'auto',
    spaceBetween: 20,
    centeredSlides: true,
    loop: !isMobile,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    mousewheel: true,
    on: {
      init: function (swiper) {
        updateSlideIndexes(swiper);
      },
      update: function (swiper) {
        updateSlideIndexes(swiper);
      },
    },
  });

  // Grab both meta lists separately so indices reset per list
  const metaLists = document.querySelectorAll('.cl_event-names_list');

  function syncActiveMeta() {
    const activeIndex = cardsSwiper.realIndex;
    metaLists.forEach((list) => {
      list.querySelectorAll('.cl_event-names_item').forEach((item, i) => {
        item.classList.toggle('is-active', i === activeIndex);
      });
    });
  }

  metaLists.forEach((list) => {
    list.querySelectorAll('.cl_event-names_item').forEach((item, i) => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        if (isMobile) {
          cardsSwiper.slideTo(i);
        } else {
          cardsSwiper.slideToLoop(i);
        }
      });
    });
  });

  cardsSwiper.on('slideChange', syncActiveMeta);
  syncActiveMeta();
