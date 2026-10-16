// INLINE SCRIPT 0  type="text/javascript"
!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);

// INLINE SCRIPT 3 

  (function () {
    // ── Theme kleuren ──
    var OCEAN_COLOR = '#ffffff';
    var LAND_FILL_COLOR = '#dcdcdc';
    var LAND_STROKE_COLOR = '#909090';
    var GRID_COLOR = '#909090';
    var PIN_COLOR = 0xff2b29;
    var PIN_HOVER_COLOR = 0x000000;
    var BRACKET_COLOR = '#ff2b29';
    var BORDER_WIDTH = 2;
    var GRID_WIDTH = 2;
    var GRID_STEP = 15;

    // ── Pin size (mobile-aware) ──
    var IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;
    var MOBILE_PIN_PX = 6;
    var DESKTOP_PIN_SIZE = 0.03;
    var PIN_SIZE;
    var PIN_HOVER_BOOST;

    // ── Date parser (handles "MARCH 21 2026" format) ──
    function parseDate(dateStr) {
      if (!dateStr) return null;
      var months = {
        JANUARY: 0,
        FEBRUARY: 1,
        MARCH: 2,
        APRIL: 3,
        MAY: 4,
        JUNE: 5,
        JULY: 6,
        AUGUST: 7,
        SEPTEMBER: 8,
        OCTOBER: 9,
        NOVEMBER: 10,
        DECEMBER: 11,
      };
      var parts = dateStr.trim().toUpperCase().split(/\s+/);
      if (parts.length !== 3) {
        var d = new Date(dateStr);
        return isNaN(d.getTime()) ? null : d;
      }
      var m = months[parts[0]];
      var d = parseInt(parts[1], 10);
      var y = parseInt(parts[2], 10);
      if (m === undefined || isNaN(d) || isNaN(y)) return null;
      return new Date(y, m, d);
    }

    function parseDates(dateStr) {
      if (!dateStr) return [];
      return dateStr
        .split(',')
        .map(function (s) {
          var raw = s.trim();
          return { raw: raw, dateObj: parseDate(raw) };
        })
        .filter(function (d) {
          return d.raw.length > 0;
        });
    }

    function buildYearRange(dates) {
      var years = dates
        .map(function (d) {
          return d.dateObj ? d.dateObj.getFullYear() : null;
        })
        .filter(function (y) {
          return y !== null;
        });

      if (!years.length) return '';

      var minYear = Math.min.apply(null, years);
      var maxYear = Math.max.apply(null, years);
      var currentYear = new Date().getFullYear();

      if (minYear === maxYear) return String(minYear);
      if (maxYear >= currentYear) return minYear + ' - NOW';
      return minYear + ' - ' + maxYear;
    }

    // ── Lees locaties uit de Webflow Collection List ──
    var items = document.querySelectorAll('[data-globe="list"] [data-lat]');
    var PIN_LOCATIONS = [];

    items.forEach(function (el) {
      var lat = parseFloat(el.getAttribute('data-lat'));
      var lon = parseFloat(el.getAttribute('data-lon'));
      var city = el.getAttribute('data-city') || '';
      var country = el.getAttribute('data-country') || '';
      var dateRaw = el.getAttribute('data-date') || '';
      if (!isNaN(lat) && !isNaN(lon)) {
        PIN_LOCATIONS.push({
          lat: lat,
          lon: lon,
          city: city,
          country: country,
          dates: parseDates(dateRaw),
        });
      }
    });

    if (!PIN_LOCATIONS.length) {
      console.warn('Globe: no locations found. Add items to your Globe Locations CMS collection.');
    }

    // ── Helpers ──
    function latLonToVec3(lat, lon, radius) {
      var phi = (90 - lat) * (Math.PI / 180);
      var theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
    }

    function vec3ToLatLon(vec) {
      var radius = vec.length();
      var lat = 90 - (Math.acos(vec.y / radius) * 180) / Math.PI;
      var lon = (Math.atan2(vec.z, -vec.x) * 180) / Math.PI - 180;
      if (lon < -180) lon += 360;
      if (lon > 180) lon -= 360;
      return { lat: lat, lon: lon };
    }

    function makeSquareTexture(size) {
      var c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      var ctx = c.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(c);
    }

    function makeCornerBracketTexture(size, lineWidth, cornerLen) {
      var c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      var ctx = c.getContext('2d');
      ctx.strokeStyle = BRACKET_COLOR;
      ctx.lineWidth = lineWidth;
      var m = size * 0.15;
      var s = size - m * 2;
      ctx.beginPath();
      ctx.moveTo(m, m + cornerLen);
      ctx.lineTo(m, m);
      ctx.lineTo(m + cornerLen, m);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(m + s - cornerLen, m);
      ctx.lineTo(m + s, m);
      ctx.lineTo(m + s, m + cornerLen);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(m + s, m + s - cornerLen);
      ctx.lineTo(m + s, m + s);
      ctx.lineTo(m + s - cornerLen, m + s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(m + cornerLen, m + s);
      ctx.lineTo(m, m + s);
      ctx.lineTo(m, m + s - cornerLen);
      ctx.stroke();
      return new THREE.CanvasTexture(c);
    }

    // ── Earth texture: ocean + continenten + grid op één canvas ──
    function createEarthTexture(geoData) {
      var W = 4096,
        H = 2048;
      var canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      var ctx = canvas.getContext('2d');

      // 1. Ocean
      ctx.fillStyle = OCEAN_COLOR;
      ctx.fillRect(0, 0, W, H);

      // 2. Continenten + landsgrenzen
      if (geoData) {
        ctx.fillStyle = LAND_FILL_COLOR;
        ctx.strokeStyle = LAND_STROKE_COLOR;
        ctx.lineWidth = BORDER_WIDTH;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        geoData.features.forEach(function (feat) {
          var geom = feat.geometry;
          if (!geom) return;
          var polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.type === 'MultiPolygon' ? geom.coordinates : [];
          polys.forEach(function (rings) {
            ctx.beginPath();
            rings.forEach(function (ring) {
              var prevX = null;
              ring.forEach(function (c, i) {
                var x = ((c[0] + 180) * W) / 360;
                var y = ((90 - c[1]) * H) / 180;
                if (i === 0 || (prevX !== null && Math.abs(x - prevX) > W / 2)) {
                  ctx.moveTo(x, y);
                } else {
                  ctx.lineTo(x, y);
                }
                prevX = x;
              });
            });
            ctx.fill('evenodd');
            ctx.stroke();
          });
        });
      }

      // 3. Grid lat/lon op de bovenkant
      ctx.strokeStyle = GRID_COLOR;
      ctx.lineWidth = GRID_WIDTH;
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';

      var step = GRID_STEP;
      for (var lat = -90 + step; lat <= 90 - step; lat += step) {
        var y = ((90 - lat) * H) / 180;
        ctx.globalAlpha = lat === 0 ? 0.75 : 0.45;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      for (var lon = 0; lon < 360; lon += step) {
        var x = (lon * W) / 360;
        ctx.globalAlpha = lon % 45 === 0 ? 0.7 : 0.4;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      var tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = 4;
      tex.needsUpdate = true;
      return tex;
    }

    // ── DOM refs ──
    var container = document.getElementById('globe-canvas-wrap');
    var tooltipEl = document.getElementById('globe-tooltip');
    var ttLabel = document.getElementById('globe-tt-label');
    var ttDate = document.getElementById('globe-tt-date');
    var outlineDiv = document.getElementById('globe-outline');
    var hoverLatEls = null;
    var hoverLonEls = null;
    function getHoverEls() {
      if (hoverLatEls === null) {
        hoverLatEls = document.querySelectorAll('[data-hover-lat]');
        hoverLonEls = document.querySelectorAll('[data-hover-long]');
      }
    }

    var w = container.clientWidth;
    var h = container.clientHeight;

    // ── Three.js setup ──
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(0, 0, 5.2);
    camera.lookAt(0, 0, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    container.style.setProperty('touch-action', 'pan-y', 'important');
    renderer.domElement.style.setProperty('touch-action', 'pan-y', 'important');

    var globeGroup = new THREE.Group();
    scene.add(globeGroup);
    var R = 1.8;

    // ── Pin size helpers (na camera-setup) ──
    function pixelsToScale(px) {
      var fovRad = (camera.fov * Math.PI) / 180;
      var d = camera.position.length();
      // Approximatie voor pin nabij sphere-oppervlak (z ≈ R/2)
      var pixelsPerUnit = container.clientHeight / (2 * (d - R / 2) * Math.tan(fovRad / 2));
      return px / pixelsPerUnit;
    }
    function recomputePinSize() {
      IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;
      PIN_SIZE = IS_MOBILE ? pixelsToScale(MOBILE_PIN_PX) : DESKTOP_PIN_SIZE;
      PIN_HOVER_BOOST = IS_MOBILE ? PIN_SIZE * 0.33 : 0.01;
    }
    recomputePinSize();

    // Onzichtbare hit-mesh voor lat/lon hover output
    var globeHitMesh = new THREE.Mesh(new THREE.SphereGeometry(R, 64, 64), new THREE.MeshBasicMaterial({ visible: false }));
    globeGroup.add(globeHitMesh);

    // Earth sphere (texture async geladen)
    var earthMesh = null;
    function applyEarthTexture(geoData) {
      if (earthMesh) {
        globeGroup.remove(earthMesh);
        if (earthMesh.material.map) earthMesh.material.map.dispose();
        earthMesh.material.dispose();
        earthMesh.geometry.dispose();
      }
      var tex = createEarthTexture(geoData);
      earthMesh = new THREE.Mesh(new THREE.SphereGeometry(R, 128, 128), new THREE.MeshBasicMaterial({ map: tex }));
      earthMesh.renderOrder = -1;
      globeGroup.add(earthMesh);
    }
    applyEarthTexture(null);

    (function loadEarth() {
      var url = 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_admin_0_countries.geojson';
      fetch(url)
        .then(function (r) {
          return r.json();
        })
        .then(function (geoData) {
          applyEarthTexture(geoData);
        })
        .catch(function (err) {
          console.warn('Globe: kon geo-data niet laden', err);
        });
    })();

    // ── Outline overlay — dynamisch op exact de schermgrootte van de bol ──
    function sphereVisualScale() {
      var fovRad = (camera.fov * Math.PI) / 180;
      var d = camera.position.length();
      return R / (Math.tan(fovRad / 2) * Math.sqrt(d * d - R * R));
    }
    function updateOutline() {
      var scale = sphereVisualScale();
      var pct = (scale * 100).toFixed(3);
      var off = ((100 - scale * 100) / 2).toFixed(3);
      outlineDiv.style.width = pct + '%';
      outlineDiv.style.height = pct + '%';
      outlineDiv.style.top = off + '%';
      outlineDiv.style.left = off + '%';
    }
    updateOutline();

    // ── Pins ──
    var squareTex = makeSquareTexture(32);
    var bracketTex = makeCornerBracketTexture(256, 8, 55);
    var pinMeshes = [];
    var bracketMeshes = [];

    PIN_LOCATIONS.forEach(function (pin) {
      var pos = latLonToVec3(pin.lat, pin.lon, R);
      var n = pos.clone().normalize();
      var pinPos = pos.clone().add(n.clone().multiplyScalar(0.04));

      var headMat = new THREE.SpriteMaterial({
        map: squareTex,
        color: PIN_COLOR,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        sizeAttenuation: true,
      });
      var head = new THREE.Sprite(headMat);
      head.scale.set(PIN_SIZE, PIN_SIZE, 1);
      head.position.copy(pinPos);
      head.userData = {
        city: pin.city,
        country: pin.country,
        dates: pin.dates,
        visibleDates: pin.dates.slice(),
        normal: n.clone(),
        isVisible: true,
      };
      globeGroup.add(head);
      pinMeshes.push(head);

      var bracketMat = new THREE.SpriteMaterial({
        map: bracketTex,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        sizeAttenuation: true,
      });
      var bracket = new THREE.Sprite(bracketMat);
      bracket.scale.set(0.18, 0.18, 1);
      bracket.position.copy(pinPos);
      bracket.userData = { loopPhase: 0 };
      globeGroup.add(bracket);
      bracketMeshes.push(bracket);
    });

    // ── Filter logic ──
    var currentFilter = 'all';

    function applyFilter(filterName) {
      currentFilter = filterName;
      var now = new Date();
      now.setHours(0, 0, 0, 0);

      pinMeshes.forEach(function (pin, i) {
        var allDates = pin.userData.dates;
        var visibleDates;
        if (filterName === 'upcoming') {
          visibleDates = allDates.filter(function (d) {
            return d.dateObj && d.dateObj >= now;
          });
        } else {
          visibleDates = allDates.slice();
        }
        pin.userData.visibleDates = visibleDates;
        var visible = visibleDates.length > 0;
        pin.userData.isVisible = visible;
        pin.visible = visible;
        bracketMeshes[i].visible = visible;
      });

      document.querySelectorAll('[data-globe-filter]').forEach(function (el) {
        if (el.getAttribute('data-globe-filter') === filterName) {
          el.classList.add('is-active');
        } else {
          el.classList.remove('is-active');
        }
      });
    }

    document.querySelectorAll('[data-globe-filter]').forEach(function (el) {
      el.addEventListener('click', function () {
        applyFilter(el.getAttribute('data-globe-filter'));
      });
    });
    applyFilter('all');

    // ── Interactie state ──
    var drag = { isDragging: false, prevX: 0, prevY: 0, velocityY: 0, velocityX: 0 };
    var rot = { x: 0.25, y: 0 };
    var autoRotateDir = 1;
    var mouseNDC = { x: 0, y: 0 };
    var mouseInside = false;
    var hoverNDCx = 0;
    var raycaster = new THREE.Raycaster();
    var rayVec = new THREE.Vector2();
    var touchStart = { x: 0, y: 0, decided: false, mode: 'none' };

    function onMouseDown(e) {
      drag.isDragging = true;
      drag.prevX = e.clientX;
      drag.prevY = e.clientY;
      drag.velocityY = 0;
      drag.velocityX = 0;
      container.style.cursor = 'grabbing';
    }
    function onMouseUp() {
      drag.isDragging = false;
      container.style.cursor = 'grab';
    }
    function onMouseMove(e) {
      var rect = container.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      hoverNDCx = mouseNDC.x;
      if (drag.isDragging) {
        var dx = e.clientX - drag.prevX;
        var dy = e.clientY - drag.prevY;
        drag.velocityY = dx * 0.004;
        drag.velocityX = dy * 0.003;
        if (Math.abs(dx) > 0.5) autoRotateDir = dx > 0 ? 1 : -1;
        rot.y += dx * 0.004;
        rot.x += dy * 0.003;
        rot.x = Math.max(-1.2, Math.min(1.2, rot.x));
        drag.prevX = e.clientX;
        drag.prevY = e.clientY;
      }
    }
    function onMouseEnter() {
      mouseInside = true;
    }
    function onMouseLeave() {
      mouseInside = false;
      drag.isDragging = false;
      container.style.cursor = 'grab';
    }

    function onTouchStart(e) {
      if (e.touches.length !== 1) return;
      var t = e.touches[0];
      touchStart.x = t.clientX;
      touchStart.y = t.clientY;
      touchStart.decided = false;
      touchStart.mode = 'none';
      drag.isDragging = false;
      drag.prevX = t.clientX;
      drag.prevY = t.clientY;
      drag.velocityY = 0;
      drag.velocityX = 0;
    }
    function onTouchMove(e) {
      if (e.touches.length !== 1) return;
      var t = e.touches[0];
      if (!touchStart.decided) {
        var adx = Math.abs(t.clientX - touchStart.x);
        var ady = Math.abs(t.clientY - touchStart.y);
        if (adx < 10 && ady < 10) return;
        if (adx > ady * 2) {
          touchStart.mode = 'rotate';
          drag.isDragging = true;
          drag.prevX = t.clientX;
          drag.prevY = t.clientY;
        } else {
          touchStart.mode = 'scroll';
        }
        touchStart.decided = true;
      }
      if (touchStart.mode !== 'rotate') return;
      var dx = t.clientX - drag.prevX;
      drag.velocityY = dx * 0.004;
      drag.velocityX = 0;
      if (Math.abs(dx) > 0.5) autoRotateDir = dx > 0 ? 1 : -1;
      rot.y += dx * 0.004;
      drag.prevX = t.clientX;
      drag.prevY = t.clientY;
    }
    function onTouchEnd() {
      drag.isDragging = false;
      touchStart.decided = false;
      touchStart.mode = 'none';
    }

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    container.addEventListener('touchcancel', onTouchEnd, { passive: true });

    // ── Animation loop ──
    var activation = new Float32Array(PIN_LOCATIONS.length);
    var tmpVec = new THREE.Vector3();
    var defaultColor = new THREE.Color(PIN_COLOR);
    var activeColor = new THREE.Color(PIN_HOVER_COLOR);

    function animate() {
      requestAnimationFrame(animate);

      if (!drag.isDragging) {
        drag.velocityY *= 0.95;
        drag.velocityX *= 0.95;
        rot.y += drag.velocityY;
        rot.x += drag.velocityX;
        rot.x = Math.max(-1.2, Math.min(1.2, rot.x));
        rot.y += 0.001 * autoRotateDir;
        if (mouseInside && Math.abs(drag.velocityY) < 0.002) {
          rot.y += Math.abs(hoverNDCx) * 0.0015 * autoRotateDir;
        }
      }
      globeGroup.rotation.x = rot.x;
      globeGroup.rotation.y = rot.y;

      if (mouseInside) {
        getHoverEls();
        if (hoverLatEls.length || hoverLonEls.length) {
          rayVec.set(mouseNDC.x, mouseNDC.y);
          raycaster.setFromCamera(rayVec, camera);
          var hits = raycaster.intersectObject(globeHitMesh);
          if (hits.length > 0) {
            var localPoint = globeGroup.worldToLocal(hits[0].point.clone());
            var coords = vec3ToLatLon(localPoint);
            var latStr = Math.abs(coords.lat).toFixed(4) + '° ' + (coords.lat >= 0 ? 'N' : 'S');
            var lonStr = Math.abs(coords.lon).toFixed(4) + '° ' + (coords.lon >= 0 ? 'E' : 'W');
            hoverLatEls.forEach(function (el) {
              el.textContent = latStr;
            });
            hoverLonEls.forEach(function (el) {
              el.textContent = lonStr;
            });
          }
        }
      }

      var closestIdx = -1;
      var closestDist = Infinity;
      var cw = container.clientWidth;
      var ch = container.clientHeight;

      pinMeshes.forEach(function (pin, i) {
        if (!pin.userData.isVisible) return;
        pin.getWorldPosition(tmpVec);
        var sp = tmpVec.clone().project(camera);
        var dx = sp.x - mouseNDC.x;
        var dy = sp.y - mouseNDC.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var camDir = tmpVec.clone().sub(camera.position).normalize();
        var globeCenter = new THREE.Vector3();
        globeGroup.getWorldPosition(globeCenter);
        var pinDir = tmpVec.clone().sub(globeCenter).normalize();
        if (dist < 0.13 && camDir.dot(pinDir) < 0.15 && dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      });

      var showTooltip = false;

      pinMeshes.forEach(function (pin, i) {
        if (!pin.userData.isVisible) {
          activation[i] = 0;
          bracketMeshes[i].material.opacity = 0;
          bracketMeshes[i].userData.loopPhase = 0;
          return;
        }

        var target = i === closestIdx ? 1 : 0;
        activation[i] += (target - activation[i]) * 0.12;
        if (activation[i] < 0.005) activation[i] = 0;
        var a = activation[i];

        pin.material.color.lerpColors(defaultColor, activeColor, a);
        pin.material.opacity = 1;
        var s = PIN_SIZE + a * PIN_HOVER_BOOST;
        pin.scale.set(s, s, 1);

        var br = bracketMeshes[i];
        if (a > 0.3) {
          br.userData.loopPhase += 0.025;
          if (br.userData.loopPhase > 1) br.userData.loopPhase = 0;
          var phase = br.userData.loopPhase;
          var scale = 0.16 + phase * 0.06;
          var opacity = (1 - phase) * a * 0.85;
          br.scale.set(scale, scale, 1);
          br.material.opacity = opacity;
        } else {
          br.userData.loopPhase = 0;
          br.material.opacity *= 0.85;
          var cs = br.scale.x + (0.16 - br.scale.x) * 0.1;
          br.scale.set(cs, cs, 1);
        }

        if (i === closestIdx && a > 0.25) {
          pin.getWorldPosition(tmpVec);
          var sp2 = tmpVec.project(camera);
          var tx = (sp2.x * 0.5 + 0.5) * cw;
          var ty = (-sp2.y * 0.5 + 0.5) * ch;
          tooltipEl.style.left = tx + 'px';
          tooltipEl.style.top = ty + 'px';
          ttLabel.textContent = pin.userData.country ? pin.userData.city + ', ' + pin.userData.country : pin.userData.city;

          var dateHTML;
          if (currentFilter === 'upcoming') {
            dateHTML = pin.userData.visibleDates
              .map(function (d) {
                return d.raw;
              })
              .join('<br>');
          } else {
            dateHTML = buildYearRange(pin.userData.visibleDates);
          }
          ttDate.innerHTML = dateHTML;

          tooltipEl.style.opacity = '1';
          showTooltip = true;
        }
      });

      if (!showTooltip) tooltipEl.style.opacity = '0';

      renderer.render(scene, camera);
    }
    animate();

    // ── Resize handling — ResizeObserver + lastSize cache (lightest option) ──
    var lastSize = 0;
    function handleResize() {
      var size = container.clientWidth;
      if (size === 0 || size === lastSize) return;
      lastSize = size;
      w = size;
      h = size;
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(size, size);
      updateOutline();
      recomputePinSize();
    }

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(handleResize).observe(container);
    } else {
      window.addEventListener('resize', handleResize);
    }
  })();


// INLINE SCRIPT 4  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6aa9594e0e835535a1e63672_5d000859fe439956ee318115b8dc5a668e3bd004bffb49231e63355fac406ece.avif%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 5  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6aa95978f19362e37ae767f3_bfd97e771ba54159c61b38ce585fdc58f7cabc29dc65746b9c23f7e3eb8c6cf9.avif%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 6  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6aa959736de7739ec0af44ff_e43ec6498ee4b7b7342a621caac31836bc0d975b798286f197ff848eed848ed9.avif%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 7  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6aa9596a1e1fc57e72202fd3_74d881352094deaed0b0cd0162668dd33f82b2657272d3c25da27b6f387f1c98.avif%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 8  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6aa9597014d5621bce61b854_3588b3ed4611d663429184c0b77e953d74df1d2c21d906c00e4fec0096bdf58b.avif%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 9  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6a692b486befa01e137b5c11_riekeer-haven-ai-foto-wesbite_f79ba00f-cd23-4d47-ba96-dd64d51c45f2.jpeg%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 10  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6a6642ddbf94dabf981b766c_flevo-park-ai-foto.jpeg%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 11  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6a69f8a2a75332eb9fb393c3_MODEL_IBIZA_bbea6dbb-c196-4861-80eb-2cb15ee84807.jpeg%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 12  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6a5be163134c3cc8c4fa62e5_model_manchester_3dd252d7-6704-4f7b-b93d-e3487b56f432.jpeg%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 13  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6aa6832f17316e80e7347c29_d35a6bb884fdea4bf46b250d29b1b26677a5276a258639f96aa18e24f385210e.avif%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 14  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6aa9593914d5621bce619d96_14e06646c0cdeab08c9663081c9d91d1e56035c26bbebd4a249088183d5c0005.avif%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 15  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6aa9593de8455050d7211a70_aa1f73fe9f6d388b87401eef055ed631a0f14544f8570ce5471564075f1f92f6.avif%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 16  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6aa95935924e7ba657a2c5df_799feeb9197d0ff9acb38bdfd73f903e0b804f2435c4ccd9631c69c4d4168aff.avif%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 17  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6aa9591be1f9b20888995787_53fb01a09a930cb58d91f5363afc0161738af4e552af9ebaddfe19fc5e00805c.avif%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 18  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6aa9590d924e7ba657a2abed_0684eb93974d1b79e285b53fec28876370241753676a201622f9132dc235f791.avif%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 19  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6aa95917ee7527d3c9fa3687_41f0dd9d01d3f95fdc4edbba2ae196d659783454a84fdc845147eb2cf2779b33.avif%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 20  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6aa958dae1f9b20888994e47_13025173ba391f81c634a38626fc6dc962b141c5c19e039aeb9ce90fbb507ad5.avif%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 21  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6aa95899e8455050d720d6c0_4cb68fb0c05ad504458028e531e69b895ea1d80d92069c923bf224a4269c6bb9.avif%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 22  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6a91d1361f62990be92f52b7_MODEL10-compressed.jpeg%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 23  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6a91d1398b3c02569333b9f1_MODEL7-compressed.jpeg%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 24  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6a9086ca6d7af7d288af2182_MODEL_16-compressed_bf7f072a-eae6-4561-b846-3d1aafc07b3d.jpeg%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 25  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6a91d1304d8dfe77da6af2fa_MODEL_15-compressed.jpeg%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 26  type="text/x-wf-template" id="wf-template-876567e9-0d72-326f-75d5-ef1f270f3a61"
%3Cdiv%20role%3D%22listitem%22%20class%3D%22product-hover-data_gallery-item%20w-dyn-item%20w-dyn-repeater-item%22%3E%3Cimg%20src%3D%22https%3A%2F%2Fcdn.prod.website-files.com%2F6a229697fcb91dd1686822db%2F6a91d1617c851c8fe798d6a2_MAKEZ_Vinyl_Front.jpeg%22%20loading%3D%22lazy%22%20alt%3D%22%22%20class%3D%22product-hover-data_image%22%2F%3E%3C%2Fdiv%3E

// INLINE SCRIPT 38  type="text/javascript"
gsap.registerPlugin(ScrollTrigger,SplitText,ScrambleTextPlugin,Flip,CustomEase,Observer,Draggable,InertiaPlugin);

// INLINE SCRIPT 39 
document.addEventListener("DOMContentLoaded", function() {function loadnoartmusic(e){let t=document.createElement("script");t.setAttribute("src",e),t.setAttribute("type","module"),document.body.appendChild(t),t.addEventListener("load",()=>{console.log("Slater loaded No Art Music.js: https://slater.app/20350.js 🤙")}),t.addEventListener("error",e=>{console.log("Error loading file",e)})}let src=window.location.host.includes("webflow.io")?"https://slater.app/20350.js":"https://assets.slater.app/slater/20350.js?v=1.0";loadnoartmusic(src);})

// INLINE SCRIPT 44 

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


// INLINE SCRIPT 45 

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


// INLINE SCRIPT 46 

  document.addEventListener('DOMContentLoaded', function () {
    function updateTime() {
      const now = new Date();

      // Format time as HH:MM:SS (24-hour, zero-padded)
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const localTime = `${hours}:${minutes}:${seconds}`;

      // Get timezone abbreviation and UTC offset
      const tzAbbr = new Intl.DateTimeFormat('en-US', {
        timeZoneName: 'short',
      })
        .formatToParts(now)
        .find((p) => p.type === 'timeZoneName').value;

      const offsetMinutes = -now.getTimezoneOffset();
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const absMin = Math.abs(offsetMinutes);
      const offsetHours = Math.floor(absMin / 60);
      const offsetMins = absMin % 60;
      const offsetStr = offsetMins === 0 ? `UTC${sign}${offsetHours}` : `UTC${sign}${offsetHours}:${String(offsetMins).padStart(2, '0')}`;

      const timeZone = `${tzAbbr} (${offsetStr})`;

      // Fill all matching elements
      document.querySelectorAll('[data-local-time]').forEach((el) => {
        el.textContent = localTime;
      });
      document.querySelectorAll('[data-time-zone]').forEach((el) => {
        el.textContent = timeZone;
      });
    }

    updateTime();
    setInterval(updateTime, 1000);
  });
