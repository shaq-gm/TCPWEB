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



  gsap.registerPlugin(Observer);

  function initInfiniteDraggableGrid() {
    const wrappers = document.querySelectorAll('[data-infinite-grid-init]');

    const wheelSpeed = 0.75;
    const dragSpeed = 1.25;

    // Ambient drift settings
    const initialDriftX = 0.3; // starting drift speed on x (px per frame at 60fps)
    const initialDriftY = 0.15; // starting drift speed on y
    const maxDriftSpeed = 1.2; // cap on auto-drift speed after a swipe
    const driftDecay = 0.995; // how slowly drift fades (closer to 1 = longer)

    wrappers.forEach((wrapper) => {
      const collection = wrapper.querySelector('[data-infinite-grid-collection]');
      const sourceList = wrapper.querySelector('[data-infinite-grid-list]');
      const originalItems = Array.from(sourceList.querySelectorAll('[data-infinite-grid-item]'));

      if (!collection || !sourceList || !originalItems.length) return;

      let observer;
      let resizeTimer;
      let scrollTimeout;
      let hasMouseLeaveListener = false;
      let tileWidth = 0;
      let tileHeight = 0;
      let currentX = 0;
      let currentY = 0;
      let xTo;
      let yTo;

      // Ambient drift state
      let driftVX = initialDriftX;
      let driftVY = initialDriftY;
      let driftTicker = null;
      let isUserInteracting = false;
      let isPopupOpen = false;

      function setStatus(status) {
        wrapper.setAttribute('data-infinite-grid-status', status);
      }

      function buildGrid() {
        if (observer) observer.kill();
        if (driftTicker) {
          gsap.ticker.remove(driftTicker);
          driftTicker = null;
        }
        setStatus('loading');
        collection.innerHTML = '';
        const measureItem = originalItems[0].cloneNode(true);

        measureItem.style.position = 'absolute';
        measureItem.style.visibility = 'hidden';
        measureItem.style.pointerEvents = 'none';

        wrapper.appendChild(measureItem);

        const itemRect = measureItem.getBoundingClientRect();
        const itemWidth = itemRect.width;
        const itemHeight = itemRect.height;

        measureItem.remove();

        if (!itemWidth || !itemHeight) return;

        const columns = Math.max(1, Math.ceil(wrapper.clientWidth / itemWidth) + 1);
        const rows = Math.max(1, Math.ceil(wrapper.clientHeight / itemHeight) + 1);
        const itemsPerList = columns * rows;
        const fragment = document.createDocumentFragment();

        for (let listIndex = 0; listIndex < 4; listIndex++) {
          const list = sourceList.cloneNode(false);
          list.style.setProperty('--grid-columns', columns);

          if (listIndex > 0) {
            list.setAttribute('aria-hidden', 'true');
          }

          for (let itemIndex = 0; itemIndex < itemsPerList; itemIndex++) {
            const item = originalItems[itemIndex % originalItems.length].cloneNode(true);
            if (listIndex > 0) {
              item.setAttribute('aria-hidden', 'true');
            }
            list.appendChild(item);
          }
          fragment.appendChild(list);
        }

        collection.appendChild(fragment);
        requestAnimationFrame(setGrid);
      }

      function setGrid() {
        const lists = Array.from(collection.querySelectorAll('[data-infinite-grid-list]'));
        const firstList = lists[0];
        if (!firstList) return;

        const firstItem = firstList.querySelector('[data-infinite-grid-item]');
        if (!firstItem) return;

        const listRect = firstList.getBoundingClientRect();
        const itemRect = firstItem.getBoundingClientRect();

        tileWidth = listRect.width;
        tileHeight = listRect.height;

        const itemHeight = itemRect.height;

        gsap.set(lists[0], { xPercent: 0, yPercent: 0 });
        gsap.set(lists[1], { xPercent: 100, yPercent: 0 });
        gsap.set(lists[2], { xPercent: 0, yPercent: 100 });
        gsap.set(lists[3], { xPercent: 100, yPercent: 100 });

        const wrapX = gsap.utils.wrap(-tileWidth, 0);
        const wrapY = gsap.utils.wrap(-tileHeight, 0);

        currentX = wrapX((wrapper.clientWidth - tileWidth) * 0.5);
        currentY = wrapY((wrapper.clientHeight - itemHeight) * 0.5);

        xTo = gsap.quickTo(collection, 'x', {
          duration: 1.2,
          ease: 'expo.out',
          modifiers: {
            x: gsap.utils.unitize(wrapX),
          },
        });

        yTo = gsap.quickTo(collection, 'y', {
          duration: 1.2,
          ease: 'expo.out',
          modifiers: {
            y: gsap.utils.unitize(wrapY),
          },
        });

        gsap.set(collection, {
          x: currentX,
          y: currentY,
        });

        requestAnimationFrame(() => {
          setStatus('idle');
        });

        observer = Observer.create({
          target: wrapper,
          type: 'wheel,touch,pointer',
          preventDefault: true,
          dragMinimum: 3,
          onPress() {
            isUserInteracting = true;
            setStatus('dragging');
          },
          onRelease() {
            isUserInteracting = false;
            setStatus('idle');
          },
          onStop() {
            isUserInteracting = false;
            setStatus('idle');
          },
          onChangeX(self) {
            handleMovement(self, 'x');
          },
          onChangeY(self) {
            handleMovement(self, 'y');
          },
        });

        if (!hasMouseLeaveListener) {
          document.documentElement.addEventListener('mouseleave', handleMouseLeave);
          hasMouseLeaveListener = true;
        }

        startDrift();
      }

      function startDrift() {
        if (driftTicker) gsap.ticker.remove(driftTicker);

        // 60fps reference: gsap.ticker fires per frame, so multiply by deltaRatio
        driftTicker = (time, deltaTime, frame, elapsed) => {
          if (isUserInteracting || isPopupOpen) return;

          // deltaRatio normalizes to 60fps (1 = 16.67ms frame)
          const dr = gsap.ticker.deltaRatio();

          currentX += driftVX * dr;
          currentY += driftVY * dr;

          xTo(currentX);
          yTo(currentY);

          // Decay the drift gently toward a baseline (but never fully stop)
          // We decay toward the initial direction so motion never dies completely
          driftVX = driftVX * driftDecay + initialDriftX * (1 - driftDecay);
          driftVY = driftVY * driftDecay + initialDriftY * (1 - driftDecay);
        };

        gsap.ticker.add(driftTicker);
      }

      function handleMouseLeave() {
        setStatus('idle');
        isUserInteracting = false;
        if (observer) {
          observer.disable();
          observer.enable();
        }
      }

      function handleMovement(self, axis) {
        const isWheel = self.event.type === 'wheel';

        if (isWheel) {
          setStatus('scrolling');
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            setStatus('idle');
          }, 200);
        }

        const multiplier = isWheel ? wheelSpeed : dragSpeed;
        const rawDelta = self[`delta${axis.toUpperCase()}`] * multiplier;
        const delta = gsap.utils.clamp(-80, 80, rawDelta);

        // The direction the content actually moves on this axis
        const contentDelta = isWheel ? -delta : delta;

        if (axis === 'x') {
          currentX += contentDelta;
          xTo(currentX);
          // Bias future drift toward the user's swipe direction
          // Normalize the impulse so big swipes don't fling drift wildly
          const impulse = gsap.utils.clamp(-maxDriftSpeed, maxDriftSpeed, contentDelta * 0.04);
          driftVX = gsap.utils.clamp(-maxDriftSpeed, maxDriftSpeed, driftVX * 0.5 + impulse);
        } else {
          currentY += contentDelta;
          yTo(currentY);
          const impulse = gsap.utils.clamp(-maxDriftSpeed, maxDriftSpeed, contentDelta * 0.04);
          driftVY = gsap.utils.clamp(-maxDriftSpeed, maxDriftSpeed, driftVY * 0.5 + impulse);
        }
      }

      // Expose pause/resume for the popup script
      wrapper._setDriftPaused = (paused) => {
        isPopupOpen = paused;
      };

      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
          buildGrid();
        }, 200);
      });

      buildGrid();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initInfiniteDraggableGrid();
  });



  function initFixedPopup() {
    const wrapper = document.querySelector('[data-infinite-grid-init]');
    if (!wrapper) return;

    let activePopup = null;
    let activePopupParent = null;
    let activePopupNextSibling = null;
    let activeItem = null;
    let pressX = 0;
    let pressY = 0;
    let isDragging = false;
    const DRAG_THRESHOLD = 5;

    wrapper.addEventListener('pointerdown', (e) => {
      const card = e.target.closest('.infinite-grid__card');
      if (!card) return;
      pressX = e.clientX;
      pressY = e.clientY;
      isDragging = false;
    });

    wrapper.addEventListener('pointermove', (e) => {
      if (pressX === 0 && pressY === 0) return;
      const dx = Math.abs(e.clientX - pressX);
      const dy = Math.abs(e.clientY - pressY);
      if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
        isDragging = true;
      }
    });

    wrapper.addEventListener('pointerup', (e) => {
      const card = e.target.closest('.infinite-grid__card');
      if (!card || isDragging) {
        pressX = 0;
        pressY = 0;
        return;
      }

      const item = card.closest('[data-infinite-grid-item]');
      const popup = item ? item.querySelector('.event-card_about_popup') : null;
      if (!popup) return;

      // Close any previously open popup
      if (activePopup && activePopup !== popup) {
        closeActivePopup();
      }

      // Remember where this popup came from
      activePopupParent = popup.parentNode;
      activePopupNextSibling = popup.nextSibling;

      // Move popup to body so position: fixed works
      document.body.appendChild(popup);
      popup.classList.add('is-open');
      activePopup = popup;

      // Mark this item as active and fade the rest
      activeItem = item;
      item.classList.add('is-active');
      wrapper.classList.add('has-active-popup');

      // Pause the ambient drift
      if (wrapper._setDriftPaused) wrapper._setDriftPaused(true);

      pressX = 0;
      pressY = 0;
    });

    function closeActivePopup() {
      if (!activePopup) return;

      // Resume the ambient drift
      if (wrapper._setDriftPaused) wrapper._setDriftPaused(false);

      activePopup.classList.remove('is-open');

      // Return popup to its original DOM location
      if (activePopupParent) {
        if (activePopupNextSibling && activePopupNextSibling.parentNode === activePopupParent) {
          activePopupParent.insertBefore(activePopup, activePopupNextSibling);
        } else {
          activePopupParent.appendChild(activePopup);
        }
      }

      // Remove active state and unfade siblings
      if (activeItem) {
        activeItem.classList.remove('is-active');
      }
      wrapper.classList.remove('has-active-popup');

      activePopup = null;
      activePopupParent = null;
      activePopupNextSibling = null;
      activeItem = null;
    }

    document.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('[data-pop-up-close]');
      if (!closeBtn) return;
      const popup = closeBtn.closest('.event-card_about_popup');
      if (popup && popup === activePopup) {
        closeActivePopup();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initFixedPopup();
  });
