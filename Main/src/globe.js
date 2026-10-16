import { geoOrthographic, geoPath, geoGraticule10, geoDistance } from "d3-geo";
import { feature, mesh } from "topojson-client";

export function initGlobe(reducedMotion) {
  const canvas = document.querySelector("#globe");
  const wrap = canvas.parentElement;
  const ctx = canvas.getContext("2d");
  const fallback = document.querySelector("#globe-fallback");
  const motion = document.querySelector("#globe-motion");
  const tooltip = document.querySelector(".globe-tooltip");
  const preview = document.querySelector("#location-preview");
  const clip = document.querySelector("#location-video");
  const filters = [...document.querySelectorAll("[data-filter]")];
  const status = document.querySelector("#world-status");
  const sampleClip = {
    video: "/assets/location-barcelona.mp4",
    poster: "/assets/location-barcelona.webp",
  };
  const places = [
    {
      name: "Toronto",
      lon: -79.3832,
      lat: 43.6532,
      video: "/assets/location-toronto.mp4",
      poster: "/assets/location-toronto.webp",
    },
    { name: "Barcelona", lon: 2.1734, lat: 41.3851, ...sampleClip },
    { name: "Madrid", lon: -3.7038, lat: 40.4168, ...sampleClip },
    { name: "Miami", lon: -80.1918, lat: 25.7617, ...sampleClip },
    { name: "New York", lon: -74.006, lat: 40.7128, ...sampleClip },
    { name: "Amsterdam", lon: 4.9041, lat: 52.3676, ...sampleClip },
  ];
  const projection = geoOrthographic().rotate([80, -15]).precision(0.5);
  const path = geoPath(projection, ctx);
  const grid = geoGraticule10();
  let countries,
    borders,
    size = 500,
    visible = false,
    requested = false,
    filter = "all";
  let rotating = !reducedMotion.matches,
    frame = 0,
    previousTime = 0,
    drag;
  function updateMotion() {
    motion.textContent = rotating ? "Pause" : "Rotate";
    motion.setAttribute(
      "aria-label",
      rotating ? "Pause globe rotation" : "Start globe rotation",
    );
  }
  function hidePreview() {
    preview.hidden = true;
    clip.pause();
  }
  function syncPreview() {
    const canPlay =
      !preview.hidden &&
      visible &&
      !document.hidden &&
      !reducedMotion.matches &&
      !navigator.connection?.saveData;
    if (canPlay) clip.play().catch(() => {});
    else clip.pause();
  }
  function selectPlace(place) {
    document.querySelector("#globe-location").textContent =
      `Example location: ${place.name}`;
    document.querySelector("#globe-lat").textContent =
      `${Math.abs(place.lat).toFixed(4)}° ${place.lat >= 0 ? "N" : "S"}`;
    document.querySelector("#globe-lon").textContent =
      `${Math.abs(place.lon).toFixed(4)}° ${place.lon >= 0 ? "E" : "W"}`;
    if (!place.video) {
      hidePreview();
      return;
    }
    preview.hidden = false;
    clip.setAttribute("aria-label", `${place.name} event preview`);
    const mediaPath = (value) => {
      try {
        return new URL(value, location.origin).pathname;
      } catch {
        return value;
      }
    };
    if (mediaPath(clip.getAttribute("poster") || "") !== place.poster)
      clip.poster = place.poster;
    if (mediaPath(clip.getAttribute("src") || "") !== place.video) {
      clip.src = place.video;
      clip.load();
    }
    syncPreview();
  }
  function draw() {
    if (!ctx || !countries) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    path({ type: "Sphere" });
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.beginPath();
    path(countries);
    ctx.fillStyle = "#e7e7e7";
    ctx.fill();
    ctx.beginPath();
    path(grid);
    ctx.strokeStyle = "#d3d3d3";
    ctx.lineWidth = 0.65;
    ctx.stroke();
    ctx.beginPath();
    path(borders);
    ctx.strokeStyle = "#bfbfbf";
    ctx.lineWidth = 0.6;
    ctx.stroke();
    ctx.beginPath();
    path({ type: "Sphere" });
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 1;
    ctx.stroke();
    if (filter === "all") {
      const center = projection.invert([size / 2, size / 2]);
      for (const place of places) {
        if (geoDistance([place.lon, place.lat], center) > Math.PI / 2) continue;
        const [x, y] = projection([place.lon, place.lat]);
        ctx.fillStyle = "#ff5b61";
        ctx.fillRect(x - 3, y - 3, 6, 6);
      }
    }
  }
  function resize() {
    size = wrap.getBoundingClientRect().width;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    projection.translate([size / 2, size / 2]).scale(size * 0.475);
    draw();
  }
  function animate(time) {
    frame = 0;
    if (!visible || !rotating || document.hidden || !countries) {
      previousTime = 0;
      return;
    }
    if (previousTime) {
      const rotation = projection.rotate();
      projection.rotate([
        rotation[0] + Math.min(time - previousTime, 40) * 0.003,
        rotation[1],
        0,
      ]);
    }
    previousTime = time;
    draw();
    frame = requestAnimationFrame(animate);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    updateMotion();
    if (visible && rotating && !document.hidden && countries)
      frame = requestAnimationFrame(animate);
    syncPreview();
  }
  function rotateBy(amount) {
    rotating = false;
    const rotation = projection.rotate();
    projection.rotate([rotation[0] + amount, rotation[1], 0]);
    tooltip.hidden = true;
    draw();
    sync();
  }
  async function load() {
    if (requested || !ctx) return;
    requested = true;
    try {
      const response = await fetch("/assets/world-110m.json");
      if (!response.ok) throw new Error("Globe data unavailable");
      const world = await response.json();
      countries = feature(world, world.objects.countries);
      borders = mesh(world, world.objects.countries);
      wrap.classList.add("is-ready");
      resize();
      sync();
    } catch {
      fallback.textContent =
        "The world is waiting. Locations will be announced here.";
      canvas.hidden = true;
      document
        .querySelectorAll(".globe-controls button, [data-filter]")
        .forEach((button) => (button.disabled = true));
      document.querySelector("#globe-location").textContent =
        "Globe preview unavailable";
      document.querySelector("#globe-lat").textContent = "—";
      document.querySelector("#globe-lon").textContent = "—";
      hidePreview();
    }
  }
  if (!ctx) {
    canvas.hidden = true;
    fallback.style.zIndex = "1";
    document.querySelectorAll('.globe-controls button, [data-filter]').forEach(button => button.disabled = true);
    document.querySelector('#globe-location').textContent = 'Globe preview unavailable';
    document.querySelector('#globe-lat').textContent = '—';
    document.querySelector('#globe-lon').textContent = '—';
    hidePreview();
  }
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) load();
      sync();
    },
    { rootMargin: "150px" },
  );
  observer.observe(wrap);
  new ResizeObserver(resize).observe(wrap);
  document.addEventListener("visibilitychange", sync);
  reducedMotion.addEventListener("change", () => {
    rotating = !reducedMotion.matches;
    sync();
  });
  motion.addEventListener("click", () => {
    rotating = !rotating;
    sync();
  });
  document
    .querySelector("#globe-left")
    .addEventListener("click", () => rotateBy(-18));
  document
    .querySelector("#globe-right")
    .addEventListener("click", () => rotateBy(18));
  canvas.addEventListener("keydown", (event) => {
    if (
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(
        event.key,
      )
    ) {
      event.preventDefault();
      if (event.key === " ") {
        rotating = !rotating;
        sync();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight")
        rotateBy(event.key === "ArrowLeft" ? -12 : 12);
      else {
        rotating = false;
        const rotation = projection.rotate();
        projection.rotate([
          rotation[0],
          Math.max(
            -70,
            Math.min(70, rotation[1] + (event.key === "ArrowUp" ? 10 : -10)),
          ),
          0,
        ]);
        draw();
        sync();
      }
    }
  });
  canvas.addEventListener("pointerdown", (event) => {
    drag = {
      x: event.clientX,
      y: event.clientY,
      rotation: projection.rotate(),
      moved: false,
    };
  });
  function nearest(event) {
    if (filter !== "all" || !countries) return null;
    const rect = canvas.getBoundingClientRect();
    const center = projection.invert([size / 2, size / 2]);
    let best = null;
    let bestDistance = 22;
    for (const place of places) {
      if (geoDistance([place.lon, place.lat], center) > Math.PI / 2) continue;
      const [x, y] = projection([place.lon, place.lat]);
      const distance = Math.hypot(
        event.clientX - rect.left - x,
        event.clientY - rect.top - y,
      );
      if (distance < bestDistance) {
        best = place;
        bestDistance = distance;
      }
    }
    return best;
  }
  canvas.addEventListener("pointermove", (event) => {
    if (drag) {
      const dx = event.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) < 6) return;
      if (
        !drag.moved &&
        event.pointerType === "touch" &&
        Math.abs(event.clientY - drag.y) > Math.abs(dx)
      ) {
        drag = null;
        return;
      }
      drag.moved = true;
      rotating = false;
      canvas.setPointerCapture(event.pointerId);
      projection.rotate([drag.rotation[0] + dx * 0.3, drag.rotation[1], 0]);
      tooltip.hidden = true;
      draw();
      sync();
    } else {
      const place = nearest(event);
      tooltip.hidden = !place;
      if (place) {
        tooltip.textContent = `${place.name} · sample location`;
        selectPlace(place);
      }
    }
  });
  canvas.addEventListener("pointerup", (event) => {
    if (drag && !drag.moved) {
      const place = nearest(event);
      if (place) {
        selectPlace(place);
        tooltip.textContent = `${place.name} · sample location`;
        tooltip.hidden = false;
      }
    }
    drag = null;
    if (canvas.hasPointerCapture(event.pointerId))
      canvas.releasePointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointercancel", () => {
    drag = null;
  });
  canvas.addEventListener("pointerleave", () => {
    if (!drag) tooltip.hidden = true;
  });
  filters.forEach((button) =>
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      filters.forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      tooltip.hidden = true;
      status.textContent =
        filter === "all"
          ? "Explore the sample globe. Coffee Party cities are still to be confirmed."
          : "No upcoming destinations announced yet. Check back for confirmed Coffee Party cities.";
      if (filter === "all") selectPlace(places[0]);
      else {
        hidePreview();
        document.querySelector("#globe-location").textContent =
          "No upcoming locations announced";
        document.querySelector("#globe-lat").textContent = "—";
        document.querySelector("#globe-lon").textContent = "—";
      }
      draw();
    }),
  );
  updateMotion();
}
