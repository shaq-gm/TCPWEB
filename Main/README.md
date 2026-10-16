# Coffee Party — website preview

This independent replacement lives entirely in `Main`. The existing coming-soon website in `../site` is preserved. The homepage, Events listing, Partnerships and Community pages and reusable header/menu/footer are built. Nothing has been deployed.

## Run locally

Requires Node.js 20.19 or later.

```powershell
cd Main
npm ci
npm run dev
```

Open http://127.0.0.1:3100. `npm run dev` builds once and starts the local preview server; after source edits, run `npm run build` and reload the browser. The server binds to loopback and supports video byte ranges.

```powershell
npm run check
npm run build
```

## Edit

- Homepage content: `src/index.html`.
- Reusable header/menu and footer: `src/components/header.html` and `src/components/footer.html`. The build script inserts these into the page; later pages should use the same partials.
- Typography, spacing, responsive layout and controls: `src/styles.css`.
- Menu, honest preview dialogs, video, carousel and local clock: `src/app.js`.
- Opening sequence: `src/intro.js`, with first-paint setup in `src/index.html`.
- SMS/newsletter preview validation and feedback: `src/signup.js`. Markup is in `src/index.html` at `#join`.
- Orthographic canvas globe, rotation, dragging, sample markers and filters: `src/globe.js`.
- `dist/` contains the generated page, browser code, styles and web assets. Commit it for an immediately available static preview. Edit source files, then rebuild.

The globe's example city data is isolated in `src/globe.js`. Toronto, Barcelona and London are **sample coordinates, not confirmed Coffee Party destinations**. The Upcoming filter intentionally displays no destinations.

## Media

`npm run assets` regenerates assets from `../Assests/vid1.MP4` and the supplied SVG logos, then downloads the open font and geography data. Originals are untouched. Generated assets are committed, so this command is only needed when changing media.

The supplied film is a 576 × 1024 portrait video, about 25 seconds long. The 7–21 second passage avoids the large titles baked into its beginning and ending. The silent 14-second web loops are 576px wide (2,071,771 bytes) and 480px wide (1,588,342 bytes); they retain the source aspect ratio and are cropped with `object-fit: cover`. A landscape master would improve the desktop hero. The poster and four event stills come from the same clean passage.

Video defaults to a static poster for reduced-motion or data-saving visitors, with an explicit play control. Globe rotation defaults off for reduced motion. Video and globe motion stop offscreen or when the tab is hidden. The globe has a text fallback for unavailable canvas/data.

The opening sequence follows the reference's small center square → preview window → full-screen video reveal, with a 0–100% sequence indicator and delayed header/copy entrance. It lasts about 4.45 seconds and runs once per tab session, matching the reference's repeat-visit behavior. To see it again, open the homepage in a new tab. The percentage describes the animation, not bytes downloaded. Reduced-motion visitors skip the intro; returning to a hidden tab or a failed animation also releases the page without waiting for video download.

The mobile menu scales from the top-right corner in 200ms, with a 50ms opening offset and a short backdrop fade. Close, Escape, outside clicks and menu links all keep the native dialog modal until the exit finishes, then restore focus. Reduced motion skips the scale animation. The Menu button is opaque `#333` with white text and square. The white logo has no background box: it is anchored at the page top and scrolls away with the hero. The mobile Menu button stays fixed; desktop navigation stays fixed and changes text color over content. Header elements use no blending or inversion.

Desktop navigation has two compact rows: **Event / Partner / About**, then **Community / Projects / Tickets**. Those links occupy the right half of the page, in the same columns as the reference, with the last column flush to the right padding. The same six links are listed vertically in the menu. The header switches to the Menu button at 991px. Its size follows the reference at 1921px, 991px, 767px, and 479px. Other page breakpoints retain their existing behavior.

The bottom of the mobile menu contains only **Instagram, YouTube and SoundCloud**. Replace the three `href="#"` values in `src/components/header.html` with your approved profile URLs and remove their temporary “link coming soon” titles. Until then, ordinary clicks stay in the menu and do not jump the page. No account URLs are invented.

## Community signup UI

The new **Stay in the loop** section sits directly after Upcoming Events and before the globe. On desktop it has two equal columns separated by a fine vertical rule; mobile stacks the forms with a horizontal divider. The SMS form has a phone field including country code. The newsletter form has a free-text city field, then email. The footer's Join the party link opens `/#join`.

These are UI previews only. Required fields, whitespace-only city text, email format and basic international phone formatting are checked locally. Valid entries display **“Signup isn’t connected yet. Nothing has been submitted.”** Each form has independent feedback that clears when its fields are edited. The handler prevents default submission; it calls no service, storage or logging API. Inputs remain only in the current page UI. Fieldsets stay disabled if JavaScript cannot initialize their submit handlers.

Anchor entry points such as `/#join` skip the opening hero animation. SMS delivery, email provider setup, durable records and real subscriptions remain later work. The existing Beehiiv implementation in `../site` is unchanged.

## Preview boundaries

- The homepage has one Shopify-linked cold brew product and eight supplied stockist logos. The Store locator opens a searchable modal with all 22 supplied addresses; no separate page or map is used. Events, Partnerships and Community are implemented; other pages and event slug pages remain deferred.
- Four cards are labeled **Design preview**, with no invented dates, venues or ticket links.
- Events and Tickets open the listing; Partner opens `/partnerships`. Other planned URLs show explanatory preview dialogs; those routes remain unimplemented.
- Footer categories collapse into native accordions on mobile. Unconfirmed emails and social handles are omitted. Legal links explain that approved content is pending.
- Community signup is a disconnected UI with an explicit preview notice. There is no storage, API request or subscription claim. The existing Beehiiv integration remains in `../site` and has not been reused or altered.
- Search indexing is disabled for this local preview. Set the final domain, sharing image and indexing policy before launch.

## Reference and dependencies

See `REFERENCE-AUDIT.md` for the observed desktop/mobile values, adaptations and verification limits. Chivo Mono is self-hosted under its SIL Open Font License (`dist/assets/fonts/OFL.txt`). Arial/Helvetica substitutes for the reference's commercial Neue Haas font. No commercial reference font, imagery, copy or application code is bundled.

Globe geography is the Natural Earth 1:110m country dataset distributed by [world-atlas](https://github.com/topojson/world-atlas), using public-domain Natural Earth data. Rendering uses [d3-geo](https://github.com/d3/d3-geo) and [topojson-client](https://github.com/topojson/topojson-client). Their license notices are in `THIRD-PARTY-NOTICES.txt`. esbuild bundles the browser module; ffmpeg-static is used only by the media preparation script.

## Events listing

Open /events (or /events/) for the full-height vertical gallery. Edit src/events.html for preview titles, dates and artwork, src/events.js for gallery behavior, and the Events block at the end of src/styles.css for presentation. The build writes dist/events/index.html and activates Events/Tickets links on both pages. Individual event routes remain deferred; artwork clicks explain the preview status.

Desktop has synchronized title/date selectors and a looping gallery. Mobile shows captions under images and stops at each end. Wheel, drag/swipe and Up/Down/Page Up/Page Down/Home/End navigation are supported. The black entry reveal and slide motion honor reduced motion. The listing uses the shared menu and a black logo on white, with no footer, following the reference composition. All four events are labeled design previews and have unannounced dates.

Restart an already-running preview server after changing scripts/serve.mjs. If 3100 is occupied, use a free port (PowerShell: $env:PORT='3101'; npm run dev). No deployment is included.


## Coffee shop and stockists

The `#shop` section sits between the globe and footer. Edit its product and stockist markup in `src/index.html`, styles in the coffee-shop block of `src/styles.css`, the modal markup in `src/index.html`, and search/filter behavior in `src/store-locator.js`. The single can (`can1.webp`) changes to the pack (`can2.webp`) on hover/keyboard focus; both represent one Shopify product. No product pagination or price is included.

`npm run build` copies the two can originals to `dist/assets/` and PNGs from `Assests/STORE-logos/` to `dist/assets/store-logos/`. The eight supplied logos replace the initial Bloom placeholders, with accessible stockist names; desktop uses four columns and mobile uses two. Edit the image list in `src/index.html` when adding or replacing stockists. The Store locator button opens a dedicated native modal with address/postal-code search, nearest-first results, and brand/availability filters. Purchases go to the exact Shopify variant URL supplied by the user.


## Store locator data and search

Edit `src/stores.json` for the 22 locations, coordinates and availability states. Statuses: confirmed (six Summerhill branches), active (four other supplied stockists), reported (two deliveries needing reconciliation), rollout (ten Revitasize branches with receipt unverified). Updating a state updates the public availability note and confirmed-only filter. Coordinates were geocoded at supplied street numbers with Photon/OpenStreetMap; unit and floor text remains in addresses. No live inventory is claimed.

The simplest architecture here is a local location list plus client-side distance calculation. `src/store-locator.js` calls https://photon.komoot.io/api/ for submitted Canadian address/city/postal searches only; no key or server integration is needed for the preview. It requests no GPS permissions and saves no search history. Visitors see which service receives their query, the matched location, approximate straight-line distances, and required OpenStreetMap attribution. Exact supplied addresses can resolve locally. Ambiguous results offer matching choices; no-match/unavailable feedback preserves list browsing.

Photon’s public demo has reasonable-use/availability limits (https://github.com/komoot/photon#demo-server); review the endpoint/provider before public launch. For production, use a suitable hosted geocoder if traffic/uptime requires it. No new page, map, backend or deployment is included.

Run `npm test` for distance/ranking and supplied-data integrity checks. Locator CSS is grouped after `.store-locator` in `src/styles.css`. Browser checks covered postal/address search, filters, no-match/empty states, reset, Escape/focus return and desktop/mobile layouts.

## Partnerships

`/partnerships` is an expanded editorial page inspired by Daybreaker's section structure, using Coffee Party's shared header/footer and original copy. Sources are `src/partnerships.html`, `src/partnerships.css` and `src/partnerships.js`.

The sequence covers an introduction and Let's get started action, Dance with us / brand partnerships, Fueling the fun with the supplied cold brew can, recent collaborations (F1 Paddock Club, World Baseball Classic, Toronto Raptors), partner product sampling, a staggered wall of the other 19 supplied brand logos, dedicated venues and artists sections, Dance without waiting for the night, sourced press coverage, five FAQs, a three-step introduction process and Get in touch.

The collaborator logo wall uses four side columns around a transparent cup on desktop/tablet, and three staggered logo columns below a smaller cup on phones (below 768px). The cup grows in place when the wall top crosses the viewport center: scale 0 to 1 over 800ms with a slight overshoot, reversing over 400ms above that boundary. A 100vh sticky centered stage in a wrapper starting at -175vh matches the reference geometry; it ends with the wall. The image also grows subtly from 1 to 1.1 through the scroll. There is no translation, exit fade or rotation. Become a sponsor is inside the wall with a transparent surrounding area and links to #inquiry; Venues is the following white foreground surface. Sizing adjusts at 991/767/479px, with extra phone space before the CTA below 480px. Reduced motion and missing animation JS keep a static stage. The wall remains white without column rules. The build uses the existing ffmpeg dependency to generate `dist/assets/partner-cup.webp` from `../Assests/cup.png`, preserving the original. The three featured collaborators have no subpage links yet; those stories are explicitly deferred. General event stills come from supplied footage and do not claim to depict a named collaboration.

Copy explains partnership opportunities, the initial process, and practical topics for brands, venues and artists. SEO/AEO preparation includes a descriptive title/description, semantic headings, static readable copy and five FAQ answers with matching FAQPage JSON-LD. Keep visible FAQ copy and JSON-LD synchronized when editing. No reach statistics, guaranteed results, case-study deliverables or current sponsor tiers are invented. The local preview retains `noindex, nofollow`; domain/canonical, indexing and submission configuration belong to launch preparation, and discovery/rankings have not been measured.

Press cards link to verified coverage from TorontoToday, Streets of Toronto and Secret Toronto. Summaries are original; no borrowed press photographs or outlet logos are used.

Get in touch still has only full name, company and email plus Request a callback. It sends/stores nothing, and shows an explicit preview notice. Fieldsets remain disabled if the handler cannot load. No backend or deployment was added. Supplied originals remain untouched.

### Showcase images and carousels — October 16, 2026

Four independent image-led carousels now cover recent brand collabs (3), venue partnerships (4 pending slots), artist partnerships (6 pending portrait slots) and press coverage (3). The venue and artist introductions also have wide image placeholders. These follow the user's marked Daybreaker screenshots: media above captions, partial next card, progress rule and bottom-right arrows. The existing 19-brand logo carousel remains separate.

Edit `src/partnerships.html` to supply images/names. Inside each `.showcase-media`, replace the placeholder note with `<img class="showcase-photo" src="/assets/APPROVED-FILE" alt="DESCRIPTIVE TEXT" loading="lazy" />`; remove the enclosing placeholder `role`/`aria-label`, and keep logo/outlet overlays only if legible. Landscape cards use a 1.6 aspect ratio; artist portraits use .84; venue/artist feature frames use 1.4. Copy any new media through the build pipeline. No unknown venue/artist identities or reel URLs are fabricated.

### Shared pagination

Homepage events and the four image-led partnership showcases share `src/carousel.js` and the existing `.carousel-controls` / `.carousel-bars` styles. The partnership showcase progress lines/right arrows have been replaced by centered Prev/Next text and clickable position bars. Counts adapt to viewport width and overflow; keyboard, scroll, disabled ends and reduced motion remain supported. The separate 19-brand logo strip keeps its own controls.

### Press coverage data and images

The People are talking carousel contains all 15 supplied article/segment links. Edit titles, dates, summaries, actions, image alt text and credits in `src/press.json`; `scripts/build.mjs` generates the static cards at `<!-- press:cards -->`. Optimized local thumbnails live in `assets/press/`, with provenance in `assets/press/SOURCES.md`. Add a WebP named for the entry id when adding an item. The build validates unique safe ids and HTTPS destinations and copies the images into dist/assets/press. Photos are lazy-loaded; no publisher image hotlinks are used at runtime. Source inspection/preparation scripts require Python/Pillow and are optional; ordinary npm builds use committed local files.

CP24's thumbnail visibly shows Coffee Party-branded shirts; its text does not name the interviewees. The Ontario Post summary is based on publisher metadata, as its article body was not exposed in the retrieved page. Dates use publisher values when available and the supplied month/year otherwise.

## Community

Open /community or /community/. Edit src/community.html and src/community.css; the build inserts src/components/community-signup.html for the two disconnected forms. The page follows the shared visual language, with philosophy, values, local connections, initiative/Projects cross-links and a #join destination. Confirmed city lists and named initiatives await approved content; no programs or locations are invented. Images reuse supplied-film stills. Shared signup initialization serves both the homepage and Community; no API, storage or subscription integration is present. Projects still displays its preview notice. See WEBSITE-PLAN.md for verification and remaining content.

### Partnership video hero

The page opens with a muted looping video and centered white headline. Existing hero.mp4/hero-mobile.mp4 and hero-poster.webp are reused. The description, CTA and opportunity links follow on white; the old panorama image is removed. The local partnership module handles pause/play, offscreen/hidden-tab suspension and poster defaults for reduced motion/data saving. A visitor can explicitly play from the poster. The shared white logo is retained on Partnerships; desktop nav becomes dark after leaving the hero. This does not use the homepage intro animation.
