import stores from "./stores.json";

export function distanceKm([lon1, lat1], [lon2, lat2]) {
  const rad = (n) => n * Math.PI / 180;
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}

export function rankStores(locations, origin) {
  return locations.map((store) => ({ ...store,
    distance: origin && store.coordinates ? distanceKm(origin, store.coordinates) : null,
  })).sort((a, b) => origin
    ? (a.distance ?? Infinity) - (b.distance ?? Infinity)
    : a.brand.localeCompare(b.brand) || a.branch.localeCompare(b.branch));
}

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const confirmed = (store) => ["confirmed", "active"].includes(store.status);
const stockists = stores.filter(confirmed);

export function initStoreLocator() {
  const dialog = document.querySelector("#store-dialog");
  if (!dialog) return;
  const opener = document.querySelector("[data-open-stores]");
  const form = dialog.querySelector("form");
  const query = dialog.querySelector("#store-search");
  const submit = form.querySelector('button[type="submit"]');
  const status = dialog.querySelector("#store-search-status");
  const matches = dialog.querySelector("#store-matches");
  const brand = dialog.querySelector("#store-brand");
  const list = dialog.querySelector("#store-results");
  const summary = dialog.querySelector("#store-result-summary");
  const reset = dialog.querySelector("#store-reset");
  let origin = null;
  let originName = "";
  let request;
  let revision = 0;
  let lastSearch = 0;

  for (const name of [...new Set(stockists.map((s) => s.brand))].sort()) {
    brand.add(new Option(name, name));
  }

  function render() {
    const selected = stockists.filter((s) => !brand.value || s.brand === brand.value);
    const ranked = rankStores(selected, origin);
    const nearest = origin ? ranked[0] : null;
    summary.textContent = `${ranked.length} ${ranked.length === 1 ? "location" : "locations"} · ${origin ? "Nearest first" : "A–Z"}`;
    reset.hidden = !origin && !query.value && !brand.value;
    list.replaceChildren();
    for (const store of ranked) {
      const item = document.createElement("li");
      item.className = "store-result";
      const copy = document.createElement("div");
      if (store === nearest) {
        const tag = document.createElement("span");
        tag.className = "store-nearest";
        tag.textContent = "Closest stockist";
        copy.append(tag);
      }
      const heading = document.createElement("h3");
      heading.textContent = store.brand;
      const branch = document.createElement("p");
      branch.className = "store-branch";
      branch.textContent = store.branch;
      const address = document.createElement("address");
      address.textContent = `${store.address}, ${store.city}, ON`;
      copy.append(heading, branch, address);
      const distance = document.createElement("span");
      distance.className = "store-distance";
      distance.textContent = store.distance === null ? "" :
        `≈ ${store.distance < 1 ? "<1" : Math.round(store.distance)} km`;
      item.append(copy, distance);
      list.append(item);
    }
    if (!ranked.length) {
      const empty = document.createElement("li");
      empty.className = "store-empty";
      empty.textContent = "No locations match this brand. Try another filter or reset search.";
      list.append(empty);
    }
    list.scrollTop = 0;
  }

  function stopSearch() {
    revision++;
    request?.abort();
    submit.disabled = false;
    submit.textContent = "Find closest ↗";
    form.removeAttribute("aria-busy");
  }
  function choose(feature) {
    origin = feature.geometry.coordinates;
    const p = feature.properties;
    originName = [...new Set([
      [p.housenumber, p.street].filter(Boolean).join(" "), p.name,
      p.city || p.district, p.postcode,
    ].filter(Boolean))].join(", ");
    status.textContent = `Near ${originName}. Distances are approximate, in a straight line.`;
    matches.replaceChildren();
    render();
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = query.value.trim();
    if (input.length < 3) {
      status.textContent = "Enter an address, city or Canadian postal code (at least 3 characters).";
      query.focus();
      return;
    }
    stopSearch();
    const token = revision;
    matches.replaceChildren();
    origin = null;
    render();
    // Exact supplied store addresses can be resolved locally, without a service request.
    const known = stockists.find((s) => s.coordinates &&
      [s.address, `${s.address}, ${s.city}`].some((a) => normalize(a) === normalize(input)));
    if (known) {
      choose({geometry: {coordinates: known.coordinates}, properties: {name: known.address, city: known.city}});
      return;
    }
    if (Date.now() - lastSearch < 1000) {
      status.textContent = "Please wait a moment before searching again.";
      return;
    }
    lastSearch = Date.now();
    request = new AbortController();
    const timer = setTimeout(() => request?.abort(), 10000);
    submit.disabled = true;
    submit.textContent = "Searching…";
    form.setAttribute("aria-busy", "true");
    status.textContent = "Finding your location…";
    const url = new URL("https://photon.komoot.io/api/");
    const postal = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(input);
    const compactPostal = input.replace(/\s/g, "").toUpperCase();
    const searchText = postal ? `${compactPostal.slice(0, 3)} ${compactPostal.slice(3)}` : input;
    url.search = new URLSearchParams({q: searchText, countrycode: "CA", limit: "3", lang: "en"});
    try {
      const response = await fetch(url, {signal: request.signal, credentials: "omit", referrerPolicy: "no-referrer"});
      if (!response.ok) throw new Error("Geocoder unavailable");
      const data = await response.json();
      if (token !== revision) return;
      const candidates = (data.features || []).filter((f) => {
        const c = f.geometry?.coordinates;
        return f.properties?.countrycode?.toUpperCase() === "CA" &&
          Array.isArray(c) && c.length === 2 && c.every(Number.isFinite) &&
          (!postal || [f.properties.postcode, f.properties.name].some((v) => v && normalize(v) === normalize(input)));
      });
      if (!candidates.length) {
        status.textContent = "We couldn’t match that location. Try a full street address with city, or a nearby Canadian postal code. You can still browse all stores below.";
      } else if (candidates.length === 1) choose(candidates[0]);
      else {
        status.textContent = "Choose the matching location to see your closest stores.";
        for (const candidate of candidates) {
          const p = candidate.properties;
          const button = document.createElement("button");
          button.type = "button";
          button.textContent = [...new Set([[p.housenumber, p.street].filter(Boolean).join(" "), p.name,
            p.city || p.district, p.state, p.postcode].filter(Boolean))].join(", ");
          button.addEventListener("click", () => { choose(candidate); query.focus(); });
          matches.append(button);
        }
        matches.querySelector("button")?.focus();
      }
    } catch {
      if (token === revision) status.textContent = "Location search is unavailable right now. Try again, or browse the store list below.";
    } finally {
      clearTimeout(timer);
      if (token === revision) {
        submit.disabled = false;
        submit.textContent = "Find closest ↗";
        form.removeAttribute("aria-busy");
      }
    }
  });

  query.addEventListener("input", () => {
    stopSearch();
    matches.replaceChildren();
    origin = null;
    status.textContent = "";
    render();
  });
  brand.addEventListener("change", render);
  reset.addEventListener("click", () => {
    stopSearch();
    query.value = brand.value = "";
    origin = null;
    status.textContent = "";
    matches.replaceChildren();
    render();
    query.focus();
  });
  opener.addEventListener("click", () => { dialog.showModal(); render(); });
  dialog.querySelector("[data-close-stores]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const r = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
  });
  dialog.addEventListener("close", () => {
    stopSearch();
    query.value = brand.value = "";
    origin = null;
    status.textContent = "";
    matches.replaceChildren();
    opener.focus();
  });
  opener.disabled = false;
  render();
}
