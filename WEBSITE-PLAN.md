# Coffee Party website: shared project brief

Updated: October 16, 2026
Status: homepage approved for progression; homepage, shared components, Events listing, Partnerships, Community and About pages are implemented in `Main/` as a local design preview. SMS/newsletter forms remain preview-only. Event slug/detail pages are explicitly deferred at the user’s request; other pages and provider integrations remain unbuilt.

## Start here in a new chat

Read this file and README.md before starting work. Inspect current files and Git status. This file captures decisions and proposals across chats; it is not a claim that future chats automatically inherit the conversation. Update the status and handoff notes after each completed stage.

The existing `site/` is a coming-soon page with a Beehiiv subscription integration described in README.md. It is preserved. The replacement homepage is isolated in the user-requested `Main/` folder. Do not silently replace the signup provider or deploy the replacement.

## Scope and sequence

Build the public Coffee Party website first. Work page by page, reviewing the homepage before developing the remaining pages. The quick-link subdomain, dedicated waitlist pages, internal dashboard, Supabase integration, and Twilio messaging are later work. The replacement uses static HTML/CSS and JavaScript, built with esbuild; no frontend framework is required for this stage.

1. Establish sitemap, section outlines, navigation, and visitor journeys (this brief).
2. Inspect No Art visually on desktop and mobile; record design values and actual interactions. Build shared header/menu/footer and the homepage with supplied Coffee Party assets and original placeholder copy. Review and finalize this stage.
3. Build Events using No Art’s events reference (listing implemented October 15). The user explicitly deferred event slug/detail pages. Confirm real event content before launch.
4. Build Partnerships and its inquiry section; add detailed collaboration pages when approved material is available.
5. Build Community, Our Story, and Projects individually.
6. Add Press, general Contact, and legal/support content as needed; perform complete navigation, responsive, accessibility, search, and launch verification.
7. Build the other platform parts individually after the main website is finalized.

## Reference roles

- Homepage visual and interaction reference: https://www.noartmusic.com/
- Events visual and interaction reference: https://www.noartmusic.com/events
- Content organization: https://www.daybreaker.com/
- Partnerships sections: https://www.daybreaker.com/partnerships/
- Community sections: https://www.daybreaker.com/community/
- Our Story sections: https://www.daybreaker.com/our-story/
- Press sections: https://www.daybreaker.com/press/

The user's requested direction is a close one-for-one recreation of No Art's homepage and events presentation: colors, typography, layout, header/menu behavior, footer composition, globe, and responsive behavior, adapted to Coffee Party branding. Do not substitute a generic event-site design. Include the single-product homepage shop/stockist section requested October 15, superseding the earlier instruction to omit the shop.

Daybreaker supplies the organizational model, not an alternative visual theme. Write original temporary Coffee Party copy with a similar purpose and approximate length. Do not import Daybreaker's names, achievements, founder history, program claims, event dates, or statistics as Coffee Party facts.

Reference text and hierarchy were reviewed during planning. Desktop/mobile visual inspection and computed typography inspection were completed for the homepage stage on October 15. See `Main/REFERENCE-AUDIT.md` for observed values, interactions, implementation checks and limitations. The adaptation follows the white/black surfaces, Chivo Mono labels/body, large sans-serif headings, fixed header, inset mobile menu, image carousel, pale globe and outlined footer. Arial/Helvetica substitutes for the reference's commercial Neue Haas font. No exact pixel match or identical animation timing is claimed.

## Proposed routes and sections

Sections below are on-page sections/anchors, not separate routes, unless explicitly identified as a detail page. Routes and section labels are proposed and can be adjusted in review.

### Home `/`

Requested order:
1. Hero video and Coffee Party branding.
2. Short about introduction, linking to Our Story.
3. Upcoming events preview, linking to Events. Use clearly identified design placeholders until event content is decided; do not publish fake events.
4. Community signup section `#join`, explicitly added by the user after review: two columns for SMS invites and city-based newsletter updates. SMS has a phone input including country code; newsletter has a free-text city input followed by email. Use the existing Coffee Party visual language. Stack the forms on mobile.
5. Globe/world section, matching the reference presentation and interactions. Coffee Party city names and any location data remain to be confirmed; do not inherit No Art destinations as real Coffee Party locations.
6. Coffee shop and stockist section: one product on the left, store locator and eight supplied stockist logos on the right; no product pagination.
7. Shared footer, matching reference composition with Coffee Party labels and destinations.

The shop/stockist section was explicitly added by the user on October 15, superseding the earlier no-shop decision. The user's approved two-column signup section supersedes the original footer-only signup proposal. The footer's Join the party link points to `/#join`. Final signup channels/providers are deferred; the existing Beehiiv integration remains untouched. Valid preview submissions must say “Signup isn’t connected yet. Nothing has been submitted.” No details are sent, stored or claimed as subscribed.

### Events `/events`

- Upcoming events listing.
- Event detail route `/events/[slug]` is explicitly deferred by the user; do not build it during the listing stage.
- Event details connect to external tickets or a clearly labeled pre-sale/waitlist destination.
- Desktop and mobile presentation/interaction should follow the No Art events reference.
- The listing currently reuses four clearly marked Coffee Party design previews with “To be announced” dates. No invented event dates, venues, ticket links or destinations.

### Partnerships `/partnerships`

- Brand partnerships / introduction.
- Current partners (use "tour partners" only if accurate).
- Recent brand collaborations / proof of past work.
- Product sampling.
- Venue collaborations.
- Artists / performers.
- Get in touch section `/partnerships#inquiry`: full name, company and email, followed by Request a callback. UI only. No inquiry-type select, long message, phone field or additional questionnaire; this supersedes the original multi-category form proposal.
- Optional later detail route `/partnerships/[slug]` for substantial brand experiences (e.g. Formula One or Raptors), using approved facts and assets. Keep short examples as sections/cards initially.

### Projects `/projects`

- Introduction: work beyond the core events.
- Broader ventures / products.
- Community initiatives.
- Educational programs.
- Explore or participate action per project when a real destination exists.

These are content categories, not assertions that Coffee Party currently operates programs in every category. Use marked placeholders and omit unsupported claims before launch.

### Community `/community`

- Coffee, music, and connection: community philosophy.
- Global cities / local networks, populated only with confirmed locations.
- Community initiatives.
- Join / subscribe action.
- Cross-link to Projects for initiative details rather than repeating full descriptions.

### About / Our Story `/our-story`

- Implemented October 16, following https://www.noartmusic.com/about.
- Opening About label and right-column headline/paragraph, followed by a wide continuous photo carousel.
- Coffee / Music / People thumbnail gallery moved from Partnerships to this page, with Coffee Party copy and imagery.
- Shared header/footer; About links now open this page. Keep the existing route; do not create a competing About page.
- Founders, history and milestones remain deferred until approved facts and assets are supplied.

### Press `/press` — proposed supporting page

- Media coverage.
- Press releases.
- Press kit and media inquiry entry point when available.

The user provided this reference and screenshot sections; treat Press as a supporting page rather than a fourth initial header item. Do not invent media endorsements.

### Contact `/contact` — proposed supporting page

- General inquiry entry point.
- Direct partnership inquiries to `/partnerships#inquiry`.
- Press inquiry destination as appropriate.

Privacy and Terms should be footer destinations before launch, with supplied/approved content. Purchases link directly to the supplied Shopify product; no local shop route is needed. The store locator is a searchable homepage modal; no separate `/store-locator` route is planned.

## Navigation and shared elements

Current top navigation and menu items, updated at the user's explicit request:
- Desktop row one: Event -> `/events`; Partner -> `/partnerships`; About -> `/our-story`.
- Desktop row two: Community -> `/community`; Projects -> `/projects`; Tickets -> `/events#upcoming`.
- Mobile uses these same six links vertically, in row-major order. Do not invent a separate ticketing system.
- Coffee Party logo -> `/`.

Keep the wider site discoverable through the footer and relevant contextual links. The user's six-item header request supersedes the original Events/About/Tickets-only proposal.

The mobile menu's bottom row contains Instagram, YouTube and SoundCloud only, using editable `href="#"` placeholders in `Main/src/components/header.html`. The user will supply their profile URLs. No Facebook link. The previous menu logo/tagline is removed.

The solid white header logo is anchored at the document top and scrolls away with the hero. It has no dark background box and no inversion. The mobile Menu button stays fixed; desktop navigation remains fixed, with compact two-row spacing based on the reference. The desktop links switch to the Menu button at 991px. Header padding, type, and the Menu inset follow No Art's size steps at 1921px, 991px, 767px, and 479px.

Reproduce No Art footer layout and responsive behavior while replacing its brand name, copyright, email addresses, destinations, and social accounts with Coffee Party equivalents. Include only relevant confirmed destinations. Do not imply the reference agency built this site or import No Art shop support links.

Build header, menu, footer, typography, buttons, and core spacing once and reuse them on later pages. Subsequent page work should preserve the reviewed homepage and shared elements unless a change is required and documented.

## Visitor journeys

- Attendee: Home -> Events -> Event detail -> external ticketing or pre-sale.
- Business partner: Home/footer -> Partnerships -> collaboration proof -> inquiry.
- Community member: Home/globe/footer -> Community, Projects, or Our Story -> subscribe, join, or explore.
- Media: Footer -> Press -> coverage, press kit, or inquiry.

## Confirmed assets

Asset folder spelling is `Assests` in this workspace; preserve originals.

- Hero video: `Assests/vid1.MP4` (18,707,806 bytes).
- Black SVG logo: `Assests/logos/CP_Logo_SVG_Black.svg`.
- White SVG logo: `Assests/logos/CP_Logo_SVG_White.svg`.
- PNG variants: `Assests/logos/CP_B.png` and `Assests/logos/CP_W.png`.
- Other logo exports are also present in `Assests/logos/`.
- Partner-logo candidates are in `Assests/brand-logos/`, including Formula One-related and Toronto Raptors files. Presence of an asset does not establish current sponsorship status or authorize a fabricated case study.

Choose white or black logo according to the reference surface. Prepare optimized web derivatives without altering supplied originals. Final hero crop/poster and video behavior require visual review.

## Homepage review criteria

- Requested order preserved, including the single-product shop/stockist section directly before the footer.
- Coffee Party logo and supplied `vid1.MP4` used correctly.
- No Art visual values and interactions audited and reproduced closely on desktop/mobile.
- Header/menu opening, closing, scroll behavior, and keyboard use verified.
- Globe visually matches the reference and uses confirmed or clearly marked preview data.
- Footer follows the reference with Coffee Party-specific content.
- Event placeholders and form behavior are honest and appropriate for a preview.
- Video/globe do not prevent reading or navigation; handle reduced motion and unsupported rendering sensibly.
- Remaining pages are not treated as finished merely because a route or placeholder exists.

## Handoff status

Completed: planning, reference desktop/mobile audit, homepage implementation, shared header/menu/footer, asset preparation and local browser verification. All implementation is in `Main/`; the existing `site/` and supplied originals are unchanged. No deployment was created.

### What is built

- Hero with the supplied Coffee Party SVG wordmark, video poster, silent looping footage and an accessible play/pause control.
- Original temporary introduction, four clearly labeled event design previews in a responsive carousel, and an interactive country globe, plus the single-product coffee shop and stockist preview.
- Shared six-link header: Event / Partner / About above Community / Projects / Tickets on desktop; the same labels vertically on mobile. An inset mobile menu uses a native modal dialog with Escape support and focus return, plus Instagram/YouTube/SoundCloud placeholders at its bottom.
- Follow-up review fixes: staged first-visit video reveal with percentage/bar and delayed header/copy entrance; top-right scale animation on menu open and close; opaque dark Menu button with white text/square; solid white top-left logo anchored to the page top. Header blending and the dark logo backing are removed; the logo scrolls out of view while Menu stays pinned.
- Shared outlined footer with desktop link groups and mobile accordions. Join the party links to the new homepage signup UI. No signup success is implied, and Beehiiv remains untouched.
- Two independent signup preview forms below Upcoming Events: phone number for SMS, free-text city and email for newsletter. Visible labels, 16px inputs, keyboard focus, native required/email validation, a country-code/phone-format check and inline status messages are implemented. Forms are disabled until their local submit handler is attached so a missing script cannot accidentally submit details in a URL. No backend, storage, analytics or provider connection was added.
- Local globe geography, drag/keyboard rotation, motion control, sample-marker information and All/Upcoming filters. Toronto, Barcelona and London are visibly labeled sample coordinates, not confirmed Coffee Party destinations. Upcoming correctly shows no announced locations.
- Events and Tickets links now open `/events` and `/events#upcoming`. Other future URLs retain preview notices; Our Story, Projects, Press, Contact and legal pages remain unbuilt. Community is now implemented (see its stage below). Partnerships is now implemented (see the latest stage below).
- Reduced-motion defaults, poster/text fallbacks and offscreen/hidden-tab motion suspension.
- The intro runs once per tab session, matching the reference; a fresh tab replays it. Its percentage tracks the sequence, not network bytes. Reduced motion skips the intro and menu scale animations. Escape, outside clicks and menu links wait for the animated menu exit before restoring focus or opening the preview notice.

### Files and local preview

Read `Main/README.md` and `Main/REFERENCE-AUDIT.md` before further changes. Source is in `Main/src/`, reusable partials in `Main/src/components/`, generated output and media in `Main/dist/`, and build/asset/preview scripts in `Main/scripts/`.

From the repository root:

```powershell
cd Main
npm ci
npm run dev
```

Open http://127.0.0.1:3100. The dev command builds once; rebuild and reload after edits. `npm run check` validates script syntax; `npm run build` regenerates the static preview. Assets are already prepared; `npm run assets` is only needed when changing supplied media.

The original video is 576 × 1024 portrait footage, about 25 seconds long. Web derivatives use its clean 7–21 second passage to avoid duplicated baked-in titles. The silent desktop/mobile loops are approximately 2.07 MB and 1.59 MB. A landscape master remains desirable for desktop cropping.

### Verification

Syntax checks and production bundling passed. Homepage and all nine distinct static resources referenced by HTML returned HTTP 200; video byte-range serving returned HTTP 206. Desktop/mobile visual checks covered the hero, introduction, carousel, globe, menu and footer. No page horizontal overflow was found at 320, 390, 768 and 1440px widths.

Video pause, carousel end states, mobile menu, Tickets preview notice, Escape/focus return, globe dragging/rotation/keyboard controls, Upcoming empty state, mobile footer accordion and inactive signup notice were exercised in the browser. Error/warning logs were empty during checked interactions. Full detail and untested cases are documented in `Main/REFERENCE-AUDIT.md`; OS-level reduced motion, forced rendering/network failures, touch hardware, Safari/Firefox, a screen reader and production subscription behavior have not been verified.

Follow-up checks confirmed a fresh-tab opening sequence and repeat-load skip, animated menu dismissal by Escape/outside click, delayed transition into the Tickets preview, restored focus and scroll, and opaque header colors on video and white sections. See the follow-up section in `Main/REFERENCE-AUDIT.md` for observed reference timing, implementation choices and limits. The sequence and menu code are local implementations; their easing is a CSS/WAAPI approximation of the reference.

The latest review checks confirmed reference-matched mobile panel inset/font/vertical spacing at 390px, all six navigation links, three inactive social placeholders, no logo background, and separate logo/Menu scroll behavior. The compact desktop rows were checked at 1440px. No horizontal overflow or browser error/warning logs appeared in these checks. See `Main/README.md` for replacing the social URLs and the latest audit notes for measurements.

The header now switches to the Menu button at 991px, and the desktop links fill the reference's right-hand column span. At a 1171px layout width that group measured about 594px from the left and 545px wide, with Tickets on the right edge. Details are in `Main/REFERENCE-AUDIT.md`.

Signup UI checks: desktop at 1440px shows two equal columns with aligned input rows/buttons; 390px and 320px show stacked forms without horizontal overflow. Required phone, missing country code, whitespace-only city and invalid email cases were rejected. Valid SMS and newsletter entries produced their own explicit preview notices and left the URL unchanged. The footer anchor was exercised. Anchor entry points skip the hero intro so signup deep links are immediately usable. Syntax/build checks passed and browser error/warning logs were empty during checked interactions. Signup-specific behavior is in `Main/src/signup.js`; no real signup or delivery test was performed.

Next: review the Events listing and provide confirmed artwork, event names, dates, locations and ticket destinations. Individual event slug pages remain deferred. Partnerships is now implemented; proceed to another page when requested; preserve the completed homepage, shared components and coming-soon site.

## Events listing — completed October 15, 2026

The user confirmed the homepage is done and authorized the Events listing in Main. They requested the No Art events layout, animation, sizing, styling and typography; they explicitly excluded event slug/detail pages from this stage.

- Added a real static /events route with a full-viewport vertical image gallery. Desktop uses a centered four-column image span within the reference’s 12-column geometry, faded neighboring artwork, corner registration marks, left event-name selectors and right date selectors. Mobile hides side lists and puts index/name/date beneath each image. No footer is added to this immersive page, matching the reference.
- Reuses the existing shared header/menu with black Coffee Party artwork over the white events surface; homepage header behavior stays intact. Events and Tickets now navigate to the listing from the homepage, cards, footer and menu. Other unbuilt routes retain preview notices.
- Uses the same self-hosted Chivo Mono as the reference. No large commercial heading font is needed on this listing. Artwork and branding use supplied Coffee Party assets; the reference’s event artwork, real dates and countries are not imported. Four clearly labeled design previews reuse the homepage titles/stills; dates say “To be announced.”
- Vertical navigation supports wheel, pointer drag/swipe, Up/Down, Page Up/Down, Home/End and title/date selection. Desktop loops; mobile stops at first/last, following the reference. Selection updates both metadata lists and a live status announcement. Active artwork opens an honest details-coming-soon notice, with no slug route or ticket transaction.
- A black entry panel lifts after 500ms over 800ms, reflecting the reference transition with Coffee Party copy. Reduced motion skips that transition and gallery easing. Timings use local CSS/WAAPI approximations.
- Build writes dist/events/index.html; preview server resolves /events and /events/. PORT can override 3100; verification used 3101 because an existing preview occupied 3100. Restart an older server to load the updated route handling.

Verification: syntax checks and production build passed. Browser checks covered desktop metadata selection and last-to-first looping, mobile captions, wheel/drag navigation, end stops, event preview notice, menu-to-Tickets navigation and Escape/focus behavior. Layout was checked at 320, 390, 768 and 1440px; no horizontal page overflow was found. At 390px, the layout area is 375px (reserved scrollbar gutter), gallery width is about 336.53px and active card starts around y=276.58px, closely matching the reference’s 336.56px and y=276.62px. Browser error/warning logs were empty during checked interactions. Real touch hardware, screen readers, other browsers and OS reduced-motion behavior remain untested. Exact pixel identity is not claimed: Coffee Party artwork, titles, entry copy and branding intentionally differ; motion is an independent approximation.

Read Main/README.md and Main/REFERENCE-AUDIT.md for implementation and reference details. Update this file after the next completed stage.


## Homepage coffee shop and stockists — completed October 15, 2026

The user explicitly added a bottom-of-homepage section inspired by No Art’s shop. This supersedes all earlier no-shop guidance. It sits after the globe and before the footer, retaining the white surface, square eyebrow markers, Chivo Mono labels, large sans-serif stockist heading, fine rules and outlined button styling.

- One product card on the left, using `Assests/can1.webp` as the main image. `can2.webp` reveals the pack on hover or keyboard focus within the same product link. No pagination, additional product, invented price or checkout was added. Product card and Shop coffee link both open the exact supplied URL: https://shop.thecoffeeparty.ca/products/coffee?variant=44435692421199.
- Right side: Store locator button followed by eight supplied logos from `Assests/STORE-logos/`, replacing the initial nine Bloom placeholders. Four columns/two rows on desktop; two columns/four rows on mobile. Logos retain their supplied colors and proportions, with accessible stockist names. Placeholder copy is removed.
- Store locator opens a dedicated searchable modal with 22 supplied locations, address/postal-code distance sorting and brand/availability filters. No separate page or map is needed. This supersedes the earlier coming-soon notice and deferred locator-route proposal.
- Mobile stacks the product above the locator and logos. The locator spans the available width. Reduced motion disables new transitions.
- Source: `Main/src/index.html`, the coffee-shop CSS block in `Main/src/styles.css`, and StoreLocator copy in `Main/src/app.js`. Build copies all three supplied image files into `Main/dist/assets/` without modifying originals.

Verification: syntax checks and production build passed. Browser checked the desktop two-column presentation and stacked 390px mobile layout; no horizontal overflow at desktop, 390px or 320px. Both can images and all nine logo instances loaded. The exact product destinations were inspected; locator dialog, Escape and focus return were exercised. Browser warning/error logs were empty. Shopify checkout, real stockist data, touch hardware and cross-browser behavior were not tested. No deployment. Local verification used port 3102.


### Supplied store logos — October 15, 2026

Replaced all Bloom placeholders with the eight supplied STORE-logos assets: Eagles Nest Golf Club, Life Time, Orangetheory Fitness, Pure Athletic Club, Pure Muscle + Fitness, Revitasize Wellness Cafe, Roses Social and Summerhill Market. The counter now reads [01–08]. Build copies the PNG originals into `Main/dist/assets/store-logos/`; supplied originals remain unchanged. The locator still opens its coming-soon dialog, with outdated placeholder wording removed. Addresses and the locator page remain deferred.

Verification: syntax/build passed; all eight logos loaded in the browser. Desktop and 390px mobile layouts visually reviewed; no horizontal overflow or browser warning/error logs. Locator dialog and Escape/focus return still work.


### Product Shop now hover — October 15, 2026

Added the missing Shop now cursor bubble over the product image, following No Art’s observed red (#ff2b29), white uppercase mono text and small corner radius. The label follows the pointer within the image bounds, fades on hover, and appears centered for keyboard focus. Pointer exit resets its position; touch does not track a cursor and reduced motion disables fading. The existing alternate pack image and exact Shopify variant link remain. Browser verified visible label on image hover and keyboard focus, updated pointer coordinates and unchanged product destination. Syntax/build checks passed.


## Searchable stockist pop-up — completed October 15, 2026

The user replaced the deferred locator-page concept with a searchable modal on the homepage. No separate route or map is built. The Store locator button opens a native dialog with the site’s white/black surfaces, Chivo Mono labels, large sans-serif heading, fine rules, black search action, brand and availability selects, and a scrollable results list. Escape, close button and backdrop dismissal restore focus. On small/short screens the modal remains scrollable.

Data lives in `Main/src/stores.json`: 22 branches, including six Summerhill Market addresses with confirmed receipt; four other active stockists (Life Time, Eagles Nest, ROSES Social, Orangetheory); two reported deliveries still awaiting reconciliation (Pure Athletic and Pure Muscle + Fitness); and all ten Revitasize branches, whose individual receipts remain unverified. Public copy distinguishes confirmed stockists, delivery reported/availability to confirm, and rollout planned/branch availability unconfirmed. It does not claim live inventory. ROSES is one location. Full user-supplied unit/floor details are retained. Change data/statuses here as reconciliation progresses.

All 22 store coordinates were looked up once through Photon/OpenStreetMap at the supplied street numbers; geocoder address labels and address-level precision are retained alongside coordinates. Raw lookup evidence is in ignored `Main/reports/store-geocoding.json`. Store addresses come from the user; coordinates are approximate geocoder points, not surveyed entrances.

`Main/src/store-locator.js` filters locally and calculates Haversine/straight-line distance in the browser. Exact supplied store-address queries resolve locally. Other Canadian address/city/postal-code searches use Photon only after submitting; compact postal codes are normalized, exact postal matches checked, and ambiguous addresses offer a choice. The matched location and approximate (not driving) distances are displayed; the closest confirmed stockist is identified even when a nearer unconfirmed branch appears. No GPS prompt, database, API key, map, analytics, storage, or new backend was added. Search values stay out of the local page URL; external address lookups go to Photon as disclosed beside the form. Closing the dialog clears the search. OpenStreetMap attribution is present.

Provider documentation: https://github.com/komoot/photon and https://github.com/komoot/photon/blob/master/docs/api-v1.md. The public demo permits reasonable use but offers no availability guarantee and may throttle. Review a production geocoding service before a public/high-traffic launch; the endpoint is isolated in the locator module. If an address cannot be matched or the service fails/times out, visitors can still browse/filter the full list. Requests are cancellable, search is submit-only, and stale responses cannot replace newer results.

Verification: syntax checks, production build and four unit tests (`npm test`) passed. Tests cover independent reference distances, numeric ordering/missing coordinates, the real Annex/Barrie distance ordering and the 22-location/status/coordinate integrity. Browser verified all 22 results; live M5R 3G7 and lowercase/no-space m5r3g7 searches ranked Summerhill Annex first; an exact Rosedale address resolved locally; a Toronto City Hall address returned disambiguation choices; invalid text showed the no-match fallback. Revitasize filter returned ten branches and combining it with confirmed stockists showed an empty state. Reset, Escape/focus return, desktop and 390px mobile layout, plus 320px/short-height scroll behavior were checked without horizontal overflow. Browser error/warning logs were empty in checked live searches. Forced network outage, real mobile keyboard/touch hardware, screen reader and other browsers remain untested; failure/abort paths were reviewed in source. No deployment.

## Partnerships — completed October 15, 2026

Implemented `/partnerships` in `Main/` with the existing Coffee Party typography, white/black surfaces, fine rules, shared header/menu/footer and responsive spacing. Header and footer Partner links now resolve to the page across the homepage, Events and Partnerships. The preview server supports both `/partnerships` and `/partnerships/`.

- The introduction leads to a supplied-brand logo grid, four concise collaboration categories (brand partnerships, product sampling, spaces/venues, artists/performers), and Get in touch at `#inquiry`. Approved case-study stories remain deferred; no sponsorship tiers, dates, results or current-status claims were invented.
- Displays 22 distinct brands from `Assests/brand-logos/`. Duplicate variants of F1 Paddock Club, Toronto Raptors, Coffee Meets Bagel and Ultra Violette are omitted from display. Uses the black F1 variant for legibility on white; other artwork retains supplied colors/proportions. Build copies PNGs into `Main/dist/assets/brand-logos/`; originals are unchanged. Grid uses six columns on desktop, four on tablet and three on mobile.
- At the user's request, Cercle Festival's https://festival.cercle.io/partners informs only the minimal contact concept, not its layout or style. Get in touch has Full name, Company, Email and Request a callback. No message box, category selector, phone field or long questionnaire. This supersedes the earlier inquiry-type proposal.
- UI only: local required/email checks and explicit “This is a UI preview. Nothing has been submitted.” feedback. No API, backend, storage or real callback request. Fieldset stays disabled until the local submit-prevention handler attaches. Mobile stacks the heading and fields; inputs use visible labels, autocomplete and 16px text.
- Sources: `Main/src/partnerships.html`, `partnerships.css`, `partnerships.js`; build/preview scripts updated. Generated output is in `Main/dist/partnerships/` plus shared bundle and assets. Main README updated. No deployment.

Verification: `npm run check` and `npm run build` passed. Browser verified all 22 logos loaded, the inquiry anchor, required-field rejection, valid preview feedback and unchanged URL on attempted submission. Desktop and mobile layouts visually reviewed; no horizontal overflow at 320, 390, 768 and 1440px. Browser error/warning logs were empty during checked interactions. Source review confirms the callback handler makes no requests and stores no data. Screenshot: ignored `Main/reports/partnership-inquiry-desktop.png`. Other browsers, real touch hardware and screen readers remain untested. Current preview: http://127.0.0.1:3103/partnerships (restart an older server to pick up the new route).

Next: review Partnerships; supply approved collaboration stories/statuses before launch. Community, Our Story, Projects and supporting/legal pages remain future work. Event detail routes remain explicitly deferred.

## Partnerships expansion — completed October 16, 2026

The user rejected the short first version and requested a fuller page based on https://www.daybreaker.com/partnerships/. This supersedes the initial compact introduction/logo grid/four-category layout. The shared Coffee Party header/footer, black/white surfaces and mono labels remain, with sentence-case sans-serif body copy for comfortable long-form reading.

Implemented sequence:
1. Centered introduction explaining Coffee Party partnerships, Let's get started CTA and on-page opportunity links, followed by supplied event imagery.
2. Dance with us / Brand partnerships: original copy explaining event sponsorships, activations, product launches, creative fit and initial planning.
3. Fueling the fun: the supplied Coffee Party cold brew can and exact existing Shopify product destination, replacing the reference's current-tour-partner concept.
4. Recent brand collaborators: F1 Paddock Club, World Baseball Classic and Toronto Raptors. Logo-led cards with story-coming-soon text; subpages remain explicitly deferred. No fabricated campaign results or case studies.
5. Partner product sampling: detailed copy about product discovery, suitability, quantities, service and setup discussions, plus inquiry CTA.
6. Other brand collaborators: all remaining 19 distinct supplied logos in a horizontal carousel, with previous/next controls, keyboard arrows, Home/End, native swipe/scroll, end states and visible-range announcement. No autoplay; reduced motion uses instant movement.
7. Separate Venues and Artists sections, each with event imagery, three paragraphs and an inquiry CTA. Explains what to discuss with venue operators, artists and representatives without inventing a past roster.
8. Dance without waiting for the night: a contrasting black editorial panel about daytime connection.
9. In the press: verified Coffee Party coverage from TorontoToday, Streets of Toronto and Secret Toronto, using original short summaries and direct article links. No reference-site coverage is attributed to Coffee Party.
10. Five visible FAQs with matching FAQPage JSON-LD, a Let's get started three-step process and the existing simple three-field Get in touch preview.

SEO/AEO work: original explanatory copy, a descriptive page title and meta description, clear semantic headings, anchor navigation and concise question/answer content that can be read without client rendering. No keyword stuffing, fabricated performance numbers, guaranteed partnership outcomes or unsupported sponsor-status claims. Keep the static FAQ JSON-LD synchronized with visible answers. The local preview remains `noindex, nofollow`; indexing, canonical/domain configuration and search/AI discovery measurement remain launch work. No ranking or AI-citation improvement is claimed.

Reference visually inspected in the browser; copied only the organizational idea, not Daybreaker copy, imagery, partner lists, reach claims or visual theme. General Coffee Party stills are reused from supplied footage; they are not presented as photographs of the named collaborations. Higher-resolution, varied event photography remains desirable.

Verification: syntax/build checks and tracked whitespace checks passed. Desktop and 390px mobile visually reviewed; 320px text-clipping inspection found and fixed two long headings. No horizontal page overflow at 320, 390 or 768px. Carousel next advanced to brands 6–10 of 19; End reached 15–19 and disabled Next. FAQ expanded correctly. The callback preview still displayed “This is a UI preview. Nothing has been submitted.” and kept its URL unchanged; no backend was added. Five FAQ JSON-LD entries parsed. Checked browser warning/error logs were empty. Other browsers, screen readers, real touch hardware, production search indexing and AI retrieval remain untested.

Press source URLs:
- https://www.torontotoday.ca/local/community-events/coffee-lovers-loosen-up-at-daytime-party-series-in-liberty-village-10131668
- https://streetsoftoronto.com/toronto-culture/coffee-parties-toronto-2/
- https://secrettoronto.co/the-coffee-party-toronto/

All changes remain in Main; supplied originals and the coming-soon site are untouched. No deployment. Next: review the expanded Partnerships page; supply approved collaboration stories/images before building the three case-study subpages.

## Image-led partnership showcases — completed October 16, 2026

The latest user screenshots clarify the required presentation: recent brand collaborations, venue showcases, artist showcases and press should use horizontal image-led carousels with captions, a thin progress line and bottom-right arrows, following Daybreaker's structure. This supersedes the static three-card brand/press rows and adds the missing venue/artist showcases.

- Recent brand collabs: the three requested brands (F1 Paddock Club, World Baseball Classic, Toronto Raptors) now have landscape photograph spaces with supplied logo overlays, captions and story-coming-soon text. No subpages or fake reel actions.
- Venues: a landscape feature-image placeholder sits left of the venue introduction. A separate Recent venue partnerships carousel immediately follows, with four landscape image/name slots. Names/details are explicitly pending rather than borrowed from Daybreaker.
- Artists: a feature-image placeholder and introduction, followed by Recent artist partnerships with six portrait image/name slots. No unconfirmed artist names or stock photographs were invented.
- Press: People are talking uses landscape image spaces with outlet-name overlays, retaining the three verified coverage summaries and direct article links.
- Each showcase has independent previous/next controls, a position/visible-width progress bar, native horizontal swipe/scroll, Left/Right/Home/End navigation, disabled ends and a screen-reader status. No autoplay. Reduced motion uses instant scrolling. Mobile shows a partial next card.
- All image spaces are deliberate styled placeholders, not missing/broken image URLs. Each media frame includes an HTML comment describing replacement with an approved `img.showcase-photo`; provide descriptive alt text and remove the placeholder label/role when adding an actual image. Use `.showcase-brand-mark` for logos and retain appropriate contrast over the chosen photo. Replace the four venue and six artist captions when approved names/images are supplied.

Changes are confined to Main partnership HTML/CSS/JS and generated output. The cold brew section, other-brand logo carousel, long-form copy, FAQs and disconnected callback form remain. No deployment.

Verification for the showcase update: syntax and production build passed. Browser confirmed four independent carousels with 3 brand, 4 venue, 6 artist and 3 press cards. Venue Next advanced to cards 2–4; keyboard End reached the right boundary and disabled Next in all four; Home returned the brand carousel to its start. Desktop and 390px mobile visually reviewed. No horizontal page overflow at desktop, 390px or 320px, and no clipped showcase headings/captions at 320px. Checked warning/error logs were empty. Progress lines and responsive image frames were reviewed. Real touch hardware, screen readers and other browsers remain untested. Preview screenshot: Main/reports/partnership-showcases-desktop.png. Approved venue/artist names and all feature/card photography are still to be supplied.

## Shared carousel pagination — completed October 16, 2026

At the user's request, replaced the long progress bars and bottom-right standalone arrows in Recent brand collabs, Recent venue partnerships, Recent artist partnerships and People are talking with the homepage's centered `‹ Prev`, clickable vertical position markers and `Next ›` controls. Uses the existing `.carousel-controls`, `.carousel-bars` and `.text-link` styles rather than a separate partnership treatment.

Extracted the homepage carousel behavior into `Main/src/carousel.js`; both the homepage event carousel and the four partnership showcases now call the same `initCarousel` helper. Marker counts respond to the scrollable distance/card width; buttons and marker state update on native scroll, resize and keyboard navigation. Home/End, disabled ends and reduced-motion behavior are preserved. Removed the obsolete showcase progress/arrow CSS and markup. The separate 19-brand logo strip retains its own controls, outside the four sections named in this request.

Verification: syntax and production build passed. Desktop browser verified centered controls, Next advancing the venue carousel and its active marker, and direct marker selection. Marker count updated at 390px, with no page overflow at 390 or 320px. Homepage regression check confirmed Next advances to the last event position, updates the marker and disables Next. Browser warning/error logs were empty in that check. Screen readers, touch hardware and other browsers remain untested. No deployment.

## Brand collaborator logo wall — analysis only, October 16, 2026

The user requested analysis and an explanation before implementation. No site source, generated output or build behavior was changed during this stage. Implementation awaits the user's follow-up. This proposal supersedes the horizontal logo-strip design only when authorized.

Scope: replace only the Partnerships “Brand collaborators.” section (`.partner-brand-carousel`), currently the 19-brand strip between Product sampling and Venues. Preserve its existing brand set; “all brands” is understood as all logos currently in this strip. The three Recent brand collabs cards and the other showcase carousels, page sections, header and footer remain outside this change.

Reference: https://nickho-motorsports.nl/, specifically its sponsor logo wall. The user supplied a desktop screenshot. Live DOM/computed-layout inspection confirmed a seven-column grid at widths of at least 768px, with logos occupying columns 1, 2, 6 and 7, leaving columns 3–5 open for the central object. Outer logo columns are vertically offset. At widths up to 767px the reference switches to three filled logo columns with the middle column offset. The mobile three-column layout was checked at a 390px viewport; this was layout inspection, not a complete visual/motion audit.

Requested direction and proposed implementation:
- Replace the horizontal strip, its arrows and range announcement with a spacious, staggered logo wall, a light surface and subtle vertical rules inspired by the reference, adapted to Coffee Party's existing typography and supplied logo artwork.
- Use `Assests/cup.png` as the central image. The supplied image was inspected; preserve its existing angled appearance and original file. Prepare an optimized web derivative during implementation. No animated rotation, 3D model, Three.js, WebGL or helmet assets are needed.
- As the section enters view, reveal the cup with a restrained fade/vertical entrance. Let it follow the scroll down within the logo-wall section using a section-bounded sticky container and, if needed, a small scroll-linked vertical offset. Keep the cup in the central opening while the surrounding logos scroll naturally. Fade/translate it out at the section's end so it is gone when Venues arrives; reverse naturally when scrolling back. Exact travel and fade distances require preview tuning.
- Desktop/tablet: use the reference's four occupied side columns and broad central opening, scaling the cup, logo sizes and spacing with available width and viewport height. Balance the final partial row for 19 logos.
- Proposed phone adaptation for review: follow the reference's three-column staggered logo grid below 768px, with a smaller cup in its own centered area above the grid and shorter section-bounded vertical travel. This keeps the cup visible without overlaying the filled logo grid. This phone placement is a proposed adaptation, not a verified behavior of the reference or an approved user decision.
- Use native scrolling, lightweight CSS and minimal visibility/scroll logic if necessary. No autoplay, scroll interception or new animation library. Reduced-motion visitors should see a static cup and all logos without fades or parallax; content must remain usable without animation JavaScript.

Before delivery after implementation: visually check entry/middle/exit and reverse scrolling; ensure the cup never covers logos or the next section; check desktop, short-height tablet, 320/390px phones and both sides of the 768px breakpoint; verify all 19 logos, no horizontal page overflow, reduced-motion/static fallback and unchanged other carousels. Run the existing syntax/build checks. No deployment is requested.


## Brand collaborator logo wall - implemented October 16, 2026

The user authorized the proposal above. Replaced only the 19-brand collaborator strip between Product sampling and Venues; retained its logo set and the other four image-led carousels. Removed the strip's obsolete buttons, horizontal-scroll logic and range announcement.

- Desktop/tablet (768px and above): seven-column geometry, four occupied side columns, staggered outer columns, subtle vertical rules and a pale background. The supplied angled cup stays centered in the three-column opening without rotation.
- Phones (below 768px): a smaller cup above three staggered logo columns, following the discussed mobile adaptation. All logos are available through ordinary vertical scrolling.
- CSS sticky positioning bounds the cup to its section. IntersectionObserver and scroll-triggered animation frames apply a small vertical offset and entrance/exit opacity only while the wall is visible. The cup disappears as Venues takes over and reappears on reverse scrolling. No scroll interception, autoplay, animation library, Three.js or WebGL was added.
- Reduced motion disables sticky travel and uses a visible static cup; logos and the image remain available without animation JavaScript. Reduced-motion paths were reviewed in source; OS-level reduced motion and JavaScript-disabled browsing were not exercised in this browser session.
- The existing ffmpeg dependency generates a 900 x 900 transparent WebP at build time: `Main/dist/assets/partner-cup.webp`, 37,082 bytes versus the 944,663-byte original. `Assests/cup.png` remains intact. Changes are in partnership HTML/CSS/JS, build media preparation, generated output and project documentation.

Verification: syntax and production build passed. Desktop and 390px phone screenshots reviewed. All 19 logo images loaded. No horizontal page overflow at 320, 390, 767, 768, 1024 and 1440px; checked seven-to-three column switch and cup bounds, including a 1024 x 500 short viewport. Desktop scroll samples showed the cup staying near the viewport center while the wall moved, reverse scrolling restored it, and the exit check showed opacity 0 with Venues in view. Existing venue carousel keyboard End reached its boundary and disabled Next; all four showcase carousels remain initialized. Checked browser warning/error logs were empty. Screen readers, real touch hardware and other browsers remain untested. Screenshots: ignored `Main/reports/partner-logo-wall-desktop.png` and `partner-logo-wall-mobile.png`. Preview: http://127.0.0.1:3104/partnerships. No deployment.

## Complete press coverage — completed October 16, 2026

Expanded Partnerships → In the press / People are talking from three placeholders to all 15 user-supplied items: CBC Radio/The Current, CP24 Dark Horse, NOW Toronto, TorontoToday, two blogTO articles, Streets of Toronto, two Secret Toronto articles, two Toronto.com articles, Time Out Miami, Montréal Express, Outlander Magazine and The Ontario Post. Dates, media types, short original summaries and appropriate Read/Listen/Watch actions are included. The existing shared centered carousel pagination remains.

Data is maintained in `Main/src/press.json`; the build renders static cards into the press-track marker in `Main/src/partnerships.html`. Article images are optimized local WebPs in `Main/assets/press/`, copied by the build into `Main/dist/assets/press/`. All 15 cards now use real article/segment thumbnails rather than image placeholders or outlet overlays. Each includes a visible source credit; known photographer/submission credits are retained. `Main/assets/press/SOURCES.md` records each article, original thumbnail URL and credit. Normal builds do not fetch publishers. Optional preparation scripts are `Main/scripts/inspect-press.py` and `prepare-press-assets.py`; raw HTML, metadata and download results are in ignored `Main/reports/press-sources/`.

Verification evidence: publisher pages/metadata were inspected, with browser fallbacks for CP24 and NOW Toronto. CBC's body explicitly identifies Zohaib Aziz as co-founder and describes the Matt Galloway interview; its publication date is June 20, 2025. Outlander explicitly describes F1 Paddock Club × The Coffee Party at Acid Bakehouse. CP24 text confirms title, date, reporter and Dark Horse/Richmond location; its thumbnail shows two interviewees wearing Coffee Party-branded shirts. It does not identify those people by name. User confirmation of that attribution was requested; no individual identities were inferred from appearance. The Ontario Post exposes article metadata/thumbnail but not the full article body in the retrieved page; its card uses a short metadata-based summary. Other user-provided descriptions are supported by publisher content/metadata; no quotations, reach statistics or coverage endorsements were invented.

Checks: syntax and production build passed. Static inspection verified 15 unique cards and all 15 supplied destinations. All 15 local WebP URLs returned HTTP 200 with image/webp; combined thumbnail size is 1,006,108 bytes. A contact sheet was visually checked against their topics. Browser inspected the populated carousel, correct initial images, Next and keyboard End reaching position 14 of 14 with Next disabled, and mobile layout. No horizontal page overflow at desktop, 390px or 320px. Photos load lazily and article images do not make visitor requests to publisher image servers. Live radio/video playback, screen readers, other browsers and real touch hardware remain untested. No deployment. Existing logo-wall work and supplied assets were preserved.


## Collaborator wall refinement - October 16, 2026

User feedback supersedes the initial logo-wall surface and animation treatment. Removed the gray fill and all column rules: the wall is now white like the rest of the page. Reduced the desktop cup height cap from 440px/58svh to 360px/48svh (about 18% smaller at the cap), and the phone cup from 260px to 220px, with a narrower maximum width and shorter reserved area.

Reworked the animation to have an actual visible entrance: cup starts hidden at 72% scale with a downward offset, then eases to full size/opacity when the wall crosses 72% of viewport height. Entry is time-eased after that threshold, so stopping the scroll still completes the pop. Native sticky positioning follows the section while a small eased vertical offset softens movement. The exit fades and shrinks across the lower section boundary, with an upward offset; reverse scrolling reveals it again. Frame-rate-independent easing settles to rest, stops offscreen/in hidden tabs, and reduced motion keeps the static visible fallback. No rotation or 3D.

Verification: syntax/build passed; desktop and 390px phone views inspected and screenshots saved as `Main/reports/partner-logo-wall-refined-desktop.png` and `partner-logo-wall-refined-mobile.png`. Browser confirmed white background, no pseudo-element rules and no horizontal overflow at 320, 390, 767, 768 and 1024px, including a 500px-tall tablet. Entry observation confirmed opacity 0 and scale .72 before the trigger; visible entrance and smaller settled cup reviewed. Exit fade was observed approaching the next section. Browser warning/error logs were empty. OS reduced-motion, real touch hardware and other browsers remain untested. Existing unrelated press changes were preserved. No deployment.

## Community page — completed October 16, 2026

Implemented the local /community and /community/ page in Main, with the shared header/menu/footer and existing Coffee Party black/white typography, outlined actions and spacing. Community links now navigate to the built page from all four implemented pages; its current-page links are marked with aria-current. No deployment.

The page includes a large Good coffee / Better company introduction, a supplied-film image, community philosophy, three coffee/music/connection values, a dark local-connections section, an initiative introduction linking to Projects, a partnership inquiry cross-link, and an on-page Join the party anchor with SMS and city/email signup previews. Daybreaker's community page (https://www.daybreaker.com/community/) was consulted for section organization only. All copy is original temporary Coffee Party copy. No reference imagery, member statistics, city list, founder history or programs were imported.

Confirmed city/network data and specific initiative names are still pending, stated visibly on the page. Projects retains its honest preview dialog until that page is built. Photographs reuse three supplied-film stills and are not labeled as particular cities or programs. Better and more varied approved photography can replace these later.

Sources: Main/src/community.html and community.css; signup markup is in Main/src/components/community-signup.html. The build inserts the partial and copies page CSS; the local server handles both route variants. Moved initSignupPreviews out of homepage-only initialization into shared app setup so existing local validation serves both pages without duplicate handlers. Fieldsets stay disabled until handlers attach. No provider, storage or backend was added; valid forms explicitly say “Signup isn’t connected yet. Nothing has been submitted.” The footer's existing /#join destination is preserved.

Verification: syntax and production build passed. Browser reviewed desktop and 390px layouts; no horizontal overflow or clipped main headings/paragraphs at 320, 768 and 1440px. All three page images loaded after entering view. Both valid signup previews displayed the exact disconnected notice and preserved the URL. Join anchor reached the section with header clearance. Projects opened its pending-page notice, and the phone menu opened and dismissed with Escape. Checked browser warning/error logs were empty. Both route variants were loaded. No new page animation was added. Cross-browser, screen-reader and real-touch checks remain untested. Preview screenshots: Main/reports/community-desktop.png and community-hero.png (ignored). Next: review Community, supply confirmed locations and initiatives, then build Our Story and Projects individually.


## Layered sponsor-wall exit and CTA - October 16, 2026

The user clarified that the desired exit is the next content sliding over the cup, rather than a fade/shrink. This supersedes the earlier exit animation. Inspection of the reference confirmed an extended absolutely positioned wrapper around a sticky central object, plus a Become partner anchor to its contact section.

Extended the cup's sticky lane beyond the wall and placed the sponsor CTA and Venues on opaque white surfaces above it. During forward scrolling the cup stays at full opacity/scale while those surfaces physically cover it from the bottom upward; reverse scrolling uncovers it. The entrance pop and modest eased vertical offset remain. There is no exit fade or shrink. On phones, the three-column white logo grid slides over the smaller cup, maintaining the previously agreed separate cup/logo arrangement without overlapping legibility. Reduced motion retains a static image. No new library or 3D behavior.

Added a centered Become a sponsor button directly below the logo wall, using the existing outlined button style and native `href="#inquiry"` to the existing Get in touch form. No new form or submission service.

Verification: syntax/build and whitespace checks passed. Desktop exit screenshot shows the CTA's white surface covering the lower half of the cup while computed opacity remains 1; DOM hit testing identifies the covering CTA at that point. Phone visual check similarly showed the logo grid covering the cup at full opacity. CTA click changed the URL to `#inquiry`; desktop/390/320/768px layouts checked without horizontal overflow. Browser warning/error logs were empty. Screenshot: ignored `Main/reports/partner-logo-wall-overlay-exit.png`. OS reduced motion, other browsers and real touch hardware remain untested. No deployment.

## Partnership video hero — completed October 16, 2026

The user requested Daybreaker's top-of-page video/text composition and removal of the marked static panorama image. The opening is now a full-width video hero (90svh desktop, 80svh phone with minimum heights) with the existing original Coffee Party headline and eyebrow centered in white over a darkened video. The paragraph beginning “The Coffee Party brings brands and people together…”, supporting copy, Let's get started button and section links form a separate white introduction immediately below it. The old `.partner-panorama` image and styling were removed.

Reuses the supplied, existing title-free `hero.mp4` / `hero-mobile.mp4` Coffee Party loops and `hero-poster.webp`; no reference-site media or new external dependencies. Playback is muted, looping and inline, with an accessible Play/Pause control. Reduced-motion/data-saving visitors default to the still poster and can opt into playback. Hidden-tab/offscreen playback is suspended; rejected autoplay leaves the play control available. Pending play requests aborted by pause/visibility do not accidentally opt the visitor out. The shared header uses its white logo/navigation over the video and dark desktop navigation over subsequent content; logo anchoring/mobile Menu behavior remain as before. This change is scoped to Partnerships.

Verification: syntax checks and production build passed. Desktop visually checked against the reference's video-plus-centered-text layout; video played muted/looping, pause/play worked, scrolling beyond the hero paused it and changed desktop nav to dark text. DOM verified the white introduction immediately follows the hero, the CTA still targets #inquiry and no panorama remains. 390px mobile visually checked with the smaller video source. No horizontal overflow or headline clipping at 390/320px. OS reduced-motion/data saver, other browsers, real touch devices and forced media failures remain untested; those paths were reviewed in source. No deployment.


## Reference-matched cup trigger and integrated CTA - October 16, 2026

The user clarified that the cup must grow in place like Nick Ho's helmet, and the sponsor CTA must belong to that same surface. This supersedes the earlier 72%-viewport trigger, upward entrance translation and CTA masking panel.

Inspected the reference's actual public animation configuration and responsive styles (analysis files are ignored in Main/reports). Observed: section-top/viewport-center trigger; scale 0 to 1 over 0.8 seconds with back.out(1.4); reverse to 0 over 0.4 seconds with power2.in; an additional scroll-linked scale 1 to 1.1. The reference wrapper starts at -175vh, ends at the sponsor section bottom, and contains a 100vh sticky centered stage at top 0. Its logo wall changes at 767px; stage/spacing rules also change at 991px and 479px. Its CTA remains inside the logo-wall wrapper.

Implemented those trigger/timing/easing values independently using the existing image and native Web Animations, with no GSAP, 3D, animated rotation or copied reference media. The stage scales from its center with zero translation; the image has the reference's subtle 1-to-1.1 scroll growth. The sticky wrapper follows the measured viewport geometry and ends with the sponsor wall, allowing the cup and CTA to leave as one composition. Moved Become a sponsor inside `.partner-logo-wall`; its surrounding area is transparent with no covering panel. Only the following Venues section has the white foreground cover. Button still links to #inquiry.

Responsive sizing is adapted to the smaller square cup image, with rules at 991, 767 and 479px. Desktop/tablet retain two logo columns per side. Phones retain three filled logo columns; below 480px a larger open area before the CTA follows the reference phone composition. The former separate cup area before the phone grid was removed. The previous white surface/no-column-lines choices remain. Reduced motion disables the entrance/growth and uses an ordinary static stage; without animation JS the wrapper also stays within the wall.

Verification: syntax/build and whitespace checks passed. Browser confirmed scale 0 while wall top was below viewport center and scale 1 after crossing it; both observed transform matrices had zero x/y translation. Desktop and phone views showed an intact cup above the CTA with no masking from the CTA area (computed background transparent, shared wall parent). Breakpoint/overflow checks passed at 320, 390, 479, 480, 767, 768, 991, 992 and short-height 1024px. CTA #inquiry destination and the Venues foreground layer were retained. Checked warning/error logs empty. Screenshots: ignored `Main/reports/partner-cup-integrated-cta-desktop.png` and `partner-cup-integrated-cta-mobile.png`. No pixel identity claim: cup artwork, white surface, button styling and adjusted image sizes remain Coffee Party's. Other browsers, real touch and OS motion settings remain untested. No deployment.


## Sponsor-to-venue overlap and black venue chapter - October 16, 2026

The user clarified that Venues must visibly slide over the complete sponsor composition. Merely placing Venues on a higher layer was insufficient because the sponsor section and its cup were still scrolling away together. Added `.partner-sponsor-scene`: it measures the sponsor section on resize, holds its visible tail with CSS sticky positioning for a viewport of overlap, and lets the next venue panel rise across it. The scene has an explicit measured content height (section height plus viewport); Venues uses a matching negative margin to overlap that space without inserting an extra blank gap. Sponsor logos, cup and CTA stay together; the existing scale-only cup entrance is preserved. Scrolling remains native, with no wheel/touch interception. Reduced motion removes the pin/overlap and uses normal section flow.

Venues / Host us and Recent venue partnerships now form one full-width #101010 chapter with white headings, light body/caption copy, white outlined CTA, dark image placeholders and contrasting carousel markers. Artists returns to white. Desktop navigation changes to white while it crosses the black venue chapter, then returns to its existing content color afterward. No content or placeholder claims were changed.

Verification: syntax/build and whitespace checks passed. Browser measured sponsor bottom remaining at viewport bottom (884px desktop, 844px phone) while Venues moved upward through the screen; desktop hit testing confirmed Venues covering the stationary cup. Both black panels and white Artists were confirmed visually/computed styles. Venue keyboard End reached its boundary and disabled Next. Cup asset loaded at 900px. No horizontal overflow at 320, 390, 767, 768 and 1440px; full-width venue panels and resize measurements verified. Checked warning/error logs were empty. Screenshots: ignored `Main/reports/venues-black-overlay-desktop.png` and `venues-black-overlay-mobile.png`. Reduced-motion source path reviewed; OS preference, real touch devices and other browsers untested. Unrelated Community work preserved. No deployment.

## Community reference revision — completed October 16, 2026

The user's annotated Daybreaker community reference supersedes the initial static editorial Community layout. Rebuilt /community with a full-viewport Coffee Party video/text hero; a scroll-darkening about section with introductory copy and two alternating image/text rows; Communities built by Coffee Party with View all projects and three overlapping project panels; Community Ventures; the existing signup previews; and a closing Brand partnerships video/text callout linking to /partnerships.

Live reference inspection observed a sticky projects header and three sticky project wrappers, followed by a relative ventures wrapper. Implemented the overlap independently with CSS sticky panels and opaque white surfaces. The shared Coffee Party header/footer, typography and controls remain. Reference content structure and the user's annotations informed the change; Daybreaker media, project names, member/city counts and investment claims were not copied.

The about background progresses from white to black as it enters the viewport, reverses with scrolling, and uses black/white text selected for contrast through gray. Both alternating film images stay readable without entrance animations. Desktop project rows slide over previous rows under the sticky heading. Phones, viewports shorter than 650px and reduced-motion visitors get ordinary project flow so text and images remain accessible. Reduced motion uses a static dark about surface. No scroll interception or new library.

Both video panels reuse the supplied title-free Coffee Party hero.mp4 / hero-mobile.mp4 loops and existing posters. Each has independent play/pause, muted inline looping, offscreen/hidden-tab suspension, reduced-motion/data-saving poster defaults and error fallback. Only visible video panels load playback sources. The header keeps its white logo over the hero; desktop link color follows hero/about/white sections/closing video. The build now preserves the white header logo for Community as well as Partnerships.

The three project panels are explicitly concept previews: neighbourhood gatherings, local creativity and continuing connections. Approved initiative names/details are still pending. View all projects and project actions retain the Projects preview notice; no new Projects route was built. Community Ventures uses the existing shared carousel controls with one real cold brew product and two explicitly future/concept directions, with inquiry links. No investments, programs or collaborator affiliations are asserted. Confirmed city/network announcements remain pending. Existing disconnected signup forms are retained before the final video callout.

Implementation: Main/src/community.html, community.css and new community.js; shared app import/initialization, syntax-check command and build logo handling updated. Generated output rebuilt; existing partnership work preserved. No deployment.

Verification: syntax/build passed. Desktop and 390px phone visuals reviewed. No horizontal page overflow or clipped visible headings/paragraphs at 320, 390, 768 and 1440px; fixed a 320px hero word during QA. Browser sampled the about background at rgb(138,138,138) with black text, then rgb(8,8,8) with white text. Hero played muted from the desktop/mobile source and paused offscreen. Independent closing-video control exercised. Project overlap measured with first panel pinned at y=144 while the second covered it at y=316; project heading remained above them. View all projects opened the correct pending-page notice. Ventures keyboard End disabled Next; signup retained its exact no-submission notice. Checked warning/error logs were empty. Reduced-motion/data-saving and failure branches were source-reviewed; OS motion preferences, forced network failures, other browsers, screen readers and touch hardware were not exercised. Screenshots (ignored): Main/reports/community-video-hero.png, community-video-mobile.png, community-dark-about.png and community-project-overlap.png.

## Partnerships introduction gallery — completed October 16, 2026

Replaced the second-section centered paragraph layout with the user's selected No Art about-page gallery composition (https://www.noartmusic.com/about). Live desktop inspection measured its twelve-column grid: thumbnails in column 2, framed feature image in columns 5–8, compact uppercase monospaced copy in columns 10–11, followed by centered Prev / three position markers / Next controls. Recreated the broad white spacing, charcoal label with square and slide count, fine frame/corner details, faded inactive thumbnails and side registration marks using independent local HTML/CSS/JS.

Three slides, Coffee / Music / People, reuse daylight.webp, movement.webp and gathering.webp from the supplied Coffee Party film. Existing introduction copy is divided across those slides; no reference imagery or text was imported. The Let's get started button sits directly below the gallery controls, followed by outlined Brands, Product sampling, Venues, Artists and In the press anchor buttons. The first action still targets #inquiry. Existing unrelated partnership edits were preserved.

Thumbnail buttons, position markers and looping Prev/Next update the image, caption, copy, aria-current and polite status together. Arrow keys and Home/End work within the gallery. Horizontal touch-swipe handling is included without preventing vertical scrolling; real touch hardware remains untested. There is no autoplay or animated transition. Phones keep the thumbnails beside the main image, move copy below it and wrap the action links.

Verification: npm run check and npm run build passed. Browser reviewed desktop and 390px phone layouts; loaded gallery images confirmed. No horizontal overflow at 390px or 320px. Exercised thumbnails, pagination, next wraparound, previous, keyboard Home/End and the inquiry anchor. Checked browser warning/error logs were empty. Sources: Main/src/partnerships.html, partnerships.css and partnerships.js; generated output rebuilt. Screenshot: ignored Main/reports/partner-intro-gallery.png. No deployment. Exact pixel identity is not claimed across different artwork, text and viewports; other browsers, screen readers and physical touch devices remain untested.

## About page — completed October 16, 2026

Read the shared brief and README; inspected the live No Art About page. Recreated its opening twelve-column composition (small left label, right headline and compact monospaced paragraph), horizontal photo strip, and framed thumbnail gallery. Uses Coffee Party film stills and original temporary Coffee Party copy. No reference branding, imagery, founder history or achievements imported. Exact pixel identity is not claimed: artwork, content and the established Arial/Helvetica substitute differ.

Built the page at the existing /our-story route, retaining the plan's single About destination. Activated About links throughout generated navigation, footer and homepage. Order: About introduction; wide photo carousel; Coffee / Music / People gallery; shared footer. The reference's founders chapter is outside this request and remains deferred pending approved facts.

Moved the former Partnerships gallery HTML/CSS/JS to About. Partnerships retains a compact text introduction, Let's get started inquiry action and section links. Pre-existing venue/artist/collaboration edits were preserved. Gallery copy now describes Coffee Party's coffee, music and people rather than brand inquiry opportunities.

The photo strip moves continuously with pause/play, previous/next, keyboard arrows and native horizontal touch scrolling. Hover/focus, hidden tabs and offscreen visibility suspend motion; reduced motion/data saver start paused. Duplicate visual slides are hidden from accessibility APIs. The three-image gallery retains synchronized thumbnails, caption, text, position markers, looping Prev/Next, arrow/Home/End keys and touch-swipe handling. Shared mobile menu and pending-page dialog are included.

Implementation: Main/src/our-story.html, about.css and about.js; app initialization, build route/style copying, preview server route and syntax-check command updated. Generated output rebuilt. Preview currently runs at http://127.0.0.1:3101/our-story because port 3100 was already occupied by an older server; restart the usual server to load its new route handling.

Verification: syntax/build passed. Desktop and 390px phone layouts visually reviewed; 320px checked for horizontal overflow (none). Exercised gallery thumbnails, looping next and keyboard End, photo Next (paused automatic motion and advanced the track), mobile menu opening/closing, and Partners inquiry CTA. A missing shared preview dialog found during QA was added, restoring initialization; a fresh final About tab had no warning/error logs. Motion/data-saver source paths reviewed; OS preferences, screen readers, other browsers and real touch hardware remain untested. No deployment.
