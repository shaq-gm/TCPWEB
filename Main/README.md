# Coffee Party — homepage preview

This independent replacement lives entirely in `Main`. The existing coming-soon website in `../site` is preserved. Only the homepage and reusable header/menu/footer are built. Nothing has been deployed.

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

- No shop section or other page implementation.
- Four cards are labeled **Design preview**, with no invented dates, venues or ticket links.
- Navigation retains the intended future URLs. Ordinary clicks open an explanatory preview dialog; direct navigation to those routes is intentionally not implemented. Replace the preview handlers when those pages are built.
- Footer categories collapse into native accordions on mobile. Unconfirmed emails and social handles are omitted. Legal links explain that approved content is pending.
- Community signup is a disconnected UI with an explicit preview notice. There is no storage, API request or subscription claim. The existing Beehiiv integration remains in `../site` and has not been reused or altered.
- Search indexing is disabled for this local preview. Set the final domain, sharing image and indexing policy before launch.

## Reference and dependencies

See `REFERENCE-AUDIT.md` for the observed desktop/mobile values, adaptations and verification limits. Chivo Mono is self-hosted under its SIL Open Font License (`dist/assets/fonts/OFL.txt`). Arial/Helvetica substitutes for the reference's commercial Neue Haas font. No commercial reference font, imagery, copy or application code is bundled.

Globe geography is the Natural Earth 1:110m country dataset distributed by [world-atlas](https://github.com/topojson/world-atlas), using public-domain Natural Earth data. Rendering uses [d3-geo](https://github.com/d3/d3-geo) and [topojson-client](https://github.com/topojson/topojson-client). Their license notices are in `THIRD-PARTY-NOTICES.txt`. esbuild bundles the browser module; ffmpeg-static is used only by the media preparation script.
