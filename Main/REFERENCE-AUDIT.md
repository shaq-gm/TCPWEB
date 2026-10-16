# Homepage reference audit and verification

Audit date: October 15, 2026 (America/Toronto).

Reference: https://www.noartmusic.com/ . This is a visual adaptation, not a claim of an exact pixel match.

## Observed reference

Desktop was inspected in a roughly 1265px-wide browser view; mobile at 390 × 844.

- Full-viewport, cover-cropped video. Centered brand mark with fine corner brackets; a small introduction at bottom left and an event teaser at bottom right. The teaser is omitted on mobile.
- Fixed header with a small logo at upper left, tiny uppercase links and square bullets on desktop. White header content blends against the page, becoming black over white sections. Mobile replaces navigation with a small Menu control.
- Mobile menu opens as a tall white panel inset about 20px from the viewport. Menu badge and close control sit above a fine rule; links stack below. A bottom rule separates ancillary content. The Coffee Party version uses the requested three items and a brand signature because social accounts are unconfirmed.
- Main surfaces are white (`rgb(255,255,255)`) with black text (`rgb(0,0,0)`). Reference font: Chivomono for labels/body and Neue Haas Grotesk Text Pro for headings. At the observed desktop width, labels measured about 10.54px, body 15.81px and section headings 42.17px. The implementation uses self-hosted Chivo Mono and a closely sized Arial/Helvetica heading substitute; the commercial reference typeface is not copied.
- The introduction has a left heading and right justified copy, with about 10.7% outer insets. Desktop headings are about 3.33vw. Mobile stacks these with a large gap before body copy and headings around 30px.
- Events are a horizontally moving image track: approximately three cards across desktop, one plus a partial next card on mobile. Small indexed captions sit below each image. Previous/next and vertical pagination marks sit centered beneath the track.
- A pale gray country globe sits centrally, with gray outlines and graticules, red square location markers, and fine corner marks. Desktop heading/filter controls sit top left, local time top right, coordinates bottom left and copy bottom right. Mobile stacks heading, filters, globe and copy and omits local time. Markers expose location information on hover. All/Upcoming changes the set.
- Desktop footer is a thin outlined rectangle with a brand/copyright block occupying about one quarter and grouped links to the right. Mobile puts accordion link groups above a brand/copyright block. Reference shop, agency attribution, email addresses and social accounts are excluded.

## Implementation checks

- `npm run check` and `npm run build` passed.
- Homepage returned HTTP 200; all nine distinct stylesheet, script, font and image paths referenced by the built HTML returned HTTP 200. Video byte-range request returned HTTP 206.
- Desktop and mobile were visually inspected in the Codex browser. Additional viewport checks at 320px, 768px and 1440px found no page horizontal overflow; 390px also passed.
- Video play/pause changes actual playback, and offscreen scrolling pauses the video. Clean video frames replace the opening/ending titles in the original film.
- Desktop carousel Next reaches the final position and disables at the end; mobile pagination reaches the fourth card and disables Next. Controls and pagination recalculate across viewport changes.
- Mobile menu opens; Tickets opens its preview notice; Escape closes the notice, returns focus to Menu, resets `aria-expanded` and releases page scroll. Native modal dialogs keep the background inert.
- Globe renders local country geometry. Pointer dragging, rotation buttons and keyboard arrows work; manual rotation switches to a paused state. Upcoming removes sample markers and displays an explicit no-confirmed-destinations message.
- Mobile footer accordion opens and reveals Join the party. Its notice explicitly says signup is inactive and no address is collected or saved.
- Browser error/warning logs were empty during the checked interactions.

## Limits and review items

Real event content, confirmed event cities, social/contact destinations, legal content and signup provider connections remain to be supplied. All non-home routes remain unbuilt. Copy is original temporary wording and awaits editorial review.

The portrait source necessarily crops heavily on desktop. Review the hero crop, poster, typography substitution, globe placement and temporary event cards before building the next page. The globe uses a public low-resolution map rather than the reference's exact rendering implementation. No claim of matching animation timing or every hover effect is made.

Reduced-motion and unavailable-rendering paths are implemented and reviewed in source, but an OS-level reduced-motion session, a forced canvas/network failure, touch hardware, Safari and Firefox were not exercised. No production deployment, subscription delivery, full Lighthouse audit or screen-reader session was performed.

Local review screenshots, when present, are in ignored `reports/`.

## Follow-up: loading, menu animation and header colors

Implemented after the user's homepage review on October 15, 2026.

Rechecked the live reference and the local reference research. Its intro animates a center video square to a preview window (45vw × 25vw on desktop, 65vw square on mobile), holds briefly, then fills the viewport. A percentage/bar runs for about 2.1 seconds. Branding grows into place and the header/bottom copy enter afterward, completing the sequence at about 4.45 seconds. The reference records completion for the tab session. These behaviors were independently implemented in `src/intro.js`; its percentage is sequence progress, not a network progress claim.

The reference menu's origin was measured at the top-right corner. It uses a 100ms wrapper fade and a 200ms scale animation beginning about 50ms into the opening; closing scales down over 200ms and fades the backdrop over the final 100ms, overlapping by 50ms. The local version uses corresponding timings with CSS/WAAPI easing approximations and retains native dialog focus/inert behavior. The backdrop no longer blurs the video.

The reference Menu button was measured as `rgb(51,51,51)` with white content. The implementation now uses those opaque colors. Per the user's explicit preference, the Coffee Party header logo stays solid white. Header blend mode is `normal`; a small solid dark backing makes the white mark readable over white sections. Desktop navigation changes color by section instead of blending.

Follow-up verification:

- Fresh-tab intro observed active with sequence progress, then full-size video, 100% completion and no remaining inert regions. Reload in the same tab skipped the intro.
- Mobile panel opening/closing, Escape, outside-click dismissal and delayed transition into the Tickets preview notice were exercised. Escape completion restored focus to Menu, reset `aria-expanded` and released scroll locking.
- Resizing an open mobile menu to 1440px closed the dialog immediately, released scroll locking and left no horizontal page overflow.
- Computed header blend mode was `normal`; Menu background was `rgb(51,51,51)` and its text was `rgb(255,255,255)`. White-content scrolling activated the dark backing behind the white logo without page overflow.
- Syntax checks and bundling passed. Error/warning logs were empty during checked interactions.
- Reduced-motion and failure-release paths were reviewed in source; OS-level preference switching and an injected script/network failure were not exercised. Exact GSAP easing curves are approximated without adding GSAP or copying reference application code.

## Follow-up: header positioning, six links and menu social row

Updated after the next user review on October 15, 2026. This supersedes the dark logo backing and three-item header described above.

- Removed the logo backing entirely. The logo is positioned at the document top and leaves the viewport when the page scrolls; the mobile Menu button stays fixed. The logo retains its solid white artwork. Desktop navigation remains fixed.
- Replaced the three widely spaced desktop links with two compact rows: Event / Partner / About, then Community / Projects / Tickets. Mobile uses the same six labels and destinations in vertical order. Existing preview notices remain; no extra pages were implemented.
- Removed the menu's bottom logo/tagline and added only Instagram, YouTube and SoundCloud with external-link marks. Their editable `href="#"` placeholders prevent default navigation while unset. No Facebook link or invented profile URL is included.
- Measured the reference at a 390 × 844 viewport with a 375px layout area. Its menu starts at x/y 19.21875px, uses 19.2308px link text and places the first link at y=109.75px with 42.296875px item spacing. The final local menu starts at x/y 19.21875px, uses the same 19.2308px font size, starts its first link at y=109.765625px and uses the same item spacing. The different brand artwork and link labels are intentional adaptations.
- Header/menu units follow the reference's fluid desktop/mobile sizing. Reserved scrollbar space prevents modal opening from changing alignment. The header mobile breakpoint is 767px.

Verified the mobile menu visually, its six labels and three social placeholders, placeholder clicks without navigation, animated Escape closing and focus return. After scrolling 844px, the logo's viewport top was -824.78125px while Menu stayed at 19.21875px; the logo pseudo-element was absent and the page had no horizontal overflow. At 1440px, the desktop links formed the requested rows (top y≈19.78px, second row y≈38.78px) with no horizontal overflow. Browser error/warning logs were empty; syntax checks and bundling passed. The existing OS/browser/hardware verification limits above still apply.

## Follow-up: header breakpoint and desktop link span

Updated after the next user review on October 15, 2026. The desktop links now occupy columns 7–12 of the reference's 12-column grid, spread so the last column ends on the right padding. The Menu button replaces those links at 991px. Header sizing follows the reference steps at 1921px, 991px, 767px, and 479px.

At a 1171px layout width, the link group measured left 593.66px, top 16.25px, width 544.83px. Tickets ended on that right edge. The reference box at the same width was left 594px, top 16px, width 545px. The local group is 26px tall with the existing 1.1 line height; the reference box was 36px tall. The six labels are unchanged.

Menu behavior checked: desktop Tickets opened its preview; at 900px the menu listed all six links and Community opened its preview after the menu closed; resizing that open menu to 1200px closed it and restored the desktop links. At a 390px viewport the settled menu still starts at 19.21875px, the first link is at 109.765625px, and item spacing is 42.296875px. Escape returned focus to Menu. No horizontal overflow or browser error/warning logs appeared in these checks.

## Follow-up: SMS and city newsletter UI

Added October 15, 2026, after the user approved the two-column concept. This supersedes the earlier footer-only signup entry. Daybreaker's supplied section was used for its two signup purposes; the implementation retains Coffee Party's white surfaces, black typography, mono labels, fine rules and outlined controls.

The new `#join` section is immediately after Upcoming Events and before the globe. It contains independent SMS and newsletter forms: phone with country code on the left; free-text city followed by email on the right. Desktop headers and input rows share a grid so descriptions of different lengths do not misalign the fields. Mobile stacks the panels with a horizontal divider. Inputs have visible labels, autocomplete hints, 16px text and keyboard focus styles.

`src/signup.js` prevents default submission, checks required fields and email validity, rejects whitespace-only cities and performs a basic phone country-code/format check. A valid entry produces only “Signup isn’t connected yet. Nothing has been submitted.” The message is announced through each form's own status region and clears on editing that form. The handler contains no service request, storage or logging API. Fieldsets are disabled until their handlers are attached, preventing an uninitialized form from submitting details in a query string. No SMS/email backend or real subscription was created; the existing `site/` integration is unchanged.

The footer Join the party link now opens `/#join`. Anchor entry points skip the hero intro so the signup section is usable immediately on a first visit.

Verified in the browser:

- Correct section order: hero → about → upcoming → join → world.
- At 1440px, equal desktop columns and matching phone/city input top positions; the complete section was visually inspected.
- At 390px and 320px, stacked forms and no horizontal overflow; inputs retain 16px text. At 320px, all three input boxes fit the 265px content width.
- Empty phone and missing country code were rejected; valid phone submission by Enter displayed the SMS-only preview notice.
- Whitespace-only city and malformed email were rejected; a valid city/email pair displayed the newsletter preview notice independently of SMS feedback.
- The URL remained `/#join` after valid submissions. Source review confirmed that entered data is not sent, stored or logged by the signup handler.
- The footer anchor navigated back to the section, landing around 75px below the mobile viewport top.
- Syntax checks and bundling passed; browser error/warning logs were empty during checked interactions.

Screenshots are in ignored `reports/community-signup-desktop.jpg` and `reports/community-signup-mobile.jpg`. Provider connections, real delivery, OS-level assistive technology and touch hardware remain untested/deferred.

## Events listing — October 15, 2026

Reference: https://www.noartmusic.com/events, visually inspected live on desktop and at 390 × 844. Its Events page has no footer: it is a 100dvh vertical gallery, with a centered image column and small title/date lists. At a 1200px reference width, the column is x=416.66, width=366.67; the image frame is 4:3, centered at y=442, with a 20px gap to adjacent slides. Inactive cards and metadata are at 20% opacity. Desktop loops; mobile does not loop. Mobile hides both side lists and places an index, title and date below each image. At 390px with a 375px layout area, the reference column is x=19.22, width=336.56; the first card starts around y=276.62 and its image is 252.42px high. Typography is Chivo Mono at .75 of the responsive body unit, about 11.54px on this mobile view. Active artwork has small corner marks. The reference's black entry panel lifts after 500ms over 800ms.

Implementation: `src/events.html`, `src/events.js` and the Events block in `src/styles.css`; built to `dist/events/index.html`. Original implementation uses CSS transforms and WAAPI, with approximate easing rather than reference application code. The same self-hosted Chivo Mono is already available. Branding, supplied Coffee Party film stills, four generic design-preview titles, unannounced dates and entry-panel copy are intentional adaptations. No reference commercial font, event art, dates, country flags or event details are imported. Cursor copy is “Details soon” because tickets/details are not built. The shared header uses black artwork and black desktop links on this white page; the homepage retains its reviewed white logo. No footer is added to the Events page, following the reference.

Behavior: wheel and pointer dragging/swiping change the active card, with 300ms slide motion and 200ms opacity changes. Title/date buttons synchronize selection, with a live status announcement. The gallery supports Up/Down, Page Up/Down, Home and End; desktop loops and mobile clamps at either end. Reduced motion skips the cover/slide easing. Artwork opens an honest preview dialog; no event slug page was created. Events/Tickets links now navigate normally from the homepage, footer and animated mobile menu. Other planned routes retain their preview notices. Build insertion activates these two destinations; shared partials stay reusable.

Verification:
- `npm run check` (including events.js) and `npm run build` passed.
- Browser layouts checked at 320, 390, 768 and 1440px; no horizontal page overflow found. The 390px gallery measured x≈19.23, width≈336.53; the active card starts at y≈276.58, closely matching the reference geometry.
- Desktop title selection synchronized name/date state; End then ArrowDown looped to the first card.
- Mobile wheel and pointer drag advanced cards. End then ArrowDown stayed at the last card. This uses browser pointer emulation, not real touch hardware.
- Artwork preview dialog content, closing by Escape and focus return to its artwork button checked. Mobile menu Tickets closed the menu and landed on `/events#upcoming`.
- Homepage return and homepage Event link checked after sharing app.js initialization. Existing source edits in the homepage and styles were preserved.
- Browser warning/error logs were empty during checked interactions.
- Both `/events` and `/events/` are served by the updated preview server. Verification used port 3101 because 3100 had an existing server. Restart an older server to pick up the new route handler; PORT optionally selects another port.

Limits: no real events/tickets, detail routes, deployment, screen-reader session, real touch hardware, OS reduced-motion session or cross-browser checks. Artwork/content differences are intentional; motion easing is approximate and exact pixel identity is not claimed.


## Homepage shop and stockists — October 15, 2026

The user’s No Art shop screenshot and live reference supplied the small square section marker, product-image/caption presentation, whitespace and footer placement. Coffee Party adapts the multi-product carousel into a single product at left and a stockist panel at right; no carousel pagination. Existing site type, black/white palette, outline controls and fine rules are reused. Supplied can1 is primary; can2 is a hover/keyboard-focus alternate of the same product. Nine Bloom logos are explicitly marked placeholders. The locator route/page is deferred and uses the existing honest preview dialog.

Syntax/build passed. Desktop screenshot reviewed at the browser’s default viewport; mobile product/stockist screenshots reviewed at 390 × 844. No horizontal overflow at desktop, 390px or 320px; mobile columns measured 335px and 265px respectively. Both can images and all nine logos loaded. The exact Shopify variant link was inspected in the rendered DOM. Locator click opened the expected notice; Escape restored focus to Store locator. Browser warning/error logs were empty. Reduced-motion CSS reviewed but OS preference switching, real touch, cross-browser behavior, real stockist locations and checkout remain untested.


### Store logo replacement — October 15, 2026

Replaced nine Bloom placeholders with all eight PNG logos supplied in `Assests/STORE-logos/`. Four desktop columns/two mobile columns, equal-height image boxes with contain fitting preserve each artwork’s proportions and original colors. Removed placeholder text from the section and locator notice; locator page remains deferred. Syntax/build passed. Desktop and 390px mobile screenshots visually inspected; all eight images loaded, no horizontal overflow or console warnings/errors. Locator click, Escape and focus return checked.


### Product hover label

Live No Art inspection confirmed a product data-cursor-text of shop now and a #ff2b29 bubble with white Chivo Mono text and about 2px corner radius. Added an independent local pointer-following label with image-bound clamping and keyboard-focus fallback. Verified in browser: hover selector active, label opacity 1, pointer position variables updated, keyboard focus reveals label, and exact Shopify URL preserved. Syntax/build passed.


## Searchable locator modal — October 15, 2026

Added a dedicated native dialog using existing typography, white/black surfaces, fine borders, square label marker and outlined/solid controls. All 22 user-supplied addresses are in src/stores.json, with explicit pending delivery/rollout states. Store coordinates are Photon/OpenStreetMap address-level matches; there is no map. Public geocoder API documentation and demo usage terms were checked. Browser search of M5R 3G7 and m5r3g7 ranked Summerhill Annex closest; local exact Rosedale address resolved at zero distance; ambiguous City Hall query offered choices. Invalid input showed a no-match message without removing browsing. Brand/availability intersection, empty state, reset and Escape focus restoration checked. Desktop and 390px mobile layouts visually reviewed, 320px short-height modal checked for overflow/scrolling. Syntax/build and four meaningful distance/ranking/data tests passed; checked browser warning/error logs were empty. Forced outages, real touch/keyboard hardware, screen reader and other browsers remain untested. Photon public demo availability is not guaranteed; review provider before public launch.

## Partnerships — October 15, 2026

The supplied Cercle Festival partners page and user's screenshot informed the three-field callback request concept only. The Coffee Party page retains its shared typography/surfaces/buttons and uses no reference photographs or claims. New route includes 22 distinct supplied logos and no invented collaboration case studies. Duplicated artwork variants are displayed once.

Syntax/build checks passed. Browser inspected desktop and 390px mobile, plus 320/768/1440px overflow checks. All 22 logos loaded. Inquiry anchor, required-field rejection and valid UI-only feedback were exercised; the URL stayed unchanged on submit and warning/error logs were empty. Handler source has no service/storage calls. Other browsers, screen readers and touch hardware remain untested. Preview screenshot saved under ignored reports/partnership-inquiry-desktop.png.

## Expanded Partnerships — October 16, 2026

Daybreaker partnership reference inspected for content sequence and alternating editorial rows. The revised page includes brand, sampling, can, collaborations, venue, artist, press, FAQ, process and inquiry sections using original Coffee Party copy. Shared site style is preserved, with sentence-case long-form body text. Three requested collaboration cards use supplied logos; case-study pages are deferred. Other 19 logos use an accessible native-scroll carousel with buttons and keyboard support. No reference claims or media were copied.

Press coverage verified at TorontoToday, Streets of Toronto and Secret Toronto; direct sources are linked on-page and in WEBSITE-PLAN.md. FAQPage structured data matches five visible answers. Preview noindex stays enabled; this is content preparation, not evidence of search visibility or AI citations.

Build/syntax passed. Desktop/mobile visual checks, 320px clipping correction, 320/390/768px overflow checks, carousel next/end and FAQ expansion were verified. The callback UI still submits nothing. Browser warning/error logs were empty. Cross-browser, screen-reader, real touch and search retrieval checks remain untested.

## Image-led showcases — October 16, 2026

Latest marked screenshots requested dedicated image-led brand/venue/artist/press carousels. Added all four with styled image spaces, captions, native scroll/snap, progress lines, arrow buttons, keyboard navigation and end-state disabling. Brand and press slots retain known identity/links; four venue and six artist slots explicitly await names and imagery. Venue/artist feature-image spaces use a landscape layout to the left of the copy. No reference images, partner names or fake reel links were imported.

Build/syntax passed. Desktop/mobile visual checks and 320/390px overflow checks passed. Venue Next and all four keyboard End states verified; Home returned the brand row to the start. Browser error/warning logs were empty. Real touch, screen-reader and cross-browser behavior remain untested.

## Uniform carousel pagination — October 16, 2026

Extracted homepage pagination into src/carousel.js and reused it in all four partnership showcases with the original homepage CSS classes. Removed showcase-specific progress-line/right-arrow markup/styles. Desktop checked venue Next/active marker/direct marker selection; 390px marker recount and 320/390px overflow checks passed. Homepage Next still reaches the final position and disables itself, with the active marker updated. Syntax/build passed and checked homepage browser warning/error logs were empty. Other browsers, touch hardware and screen readers remain untested.


## Collaborator logo wall - October 16, 2026

Nick Ho's sponsor wall uses seven columns at 768px and above, with logos on columns 1, 2, 6 and 7; outer columns are offset. Below 768px it uses three filled columns with the middle column offset. Inspected in the live reference DOM/computed layout during planning.

Implemented the agreed adaptation with the existing 19 strip logos and supplied cup PNG: four side columns and a central sticky cup on desktop; a separate cup area above a three-column logo grid on phones. Light surface and vertical rules follow the reference idea; logos retain supplied colors. Cup motion is a modest vertical offset with entry/exit fades, bounded to the wall; no rotation/3D. Reduced motion has a static CSS fallback and source-reviewed JS reset. Build creates a 37 KB transparent WebP through the existing ffmpeg dependency.

Build/syntax passed. Desktop/390px visual checks, 320/390/767/768/1024/1440px overflow and cup-bound checks, including a 500px-tall tablet viewport, passed. All 19 logo images loaded. Scroll/reverse/exit checked; cup opacity reached 0 at the Venues transition. Existing venue keyboard End reached its end and disabled Next. Checked browser error/warning logs were empty. OS reduced-motion, JavaScript-disabled browsing, screen readers, real touch hardware and other browsers remain untested. Local screenshots are in reports/partner-logo-wall-desktop.png and partner-logo-wall-mobile.png.

## Populated press carousel — October 16, 2026

Added all 15 supplied press destinations with locally optimized publisher article/segment thumbnails, visible credits, dates, types and original summaries. Source data is src/press.json; source/image provenance is assets/press/SOURCES.md. Build produces static cards and copies local WebPs. Checked the image contact sheet, source metadata/body where accessible, CP24/NOW browser pages, and all local image HTTP responses. CBC names Zohaib Aziz; CP24 thumbnail shows Coffee Party shirts but text does not name interviewees; Ontario Post exposes metadata rather than body.

Syntax/build passed, 15 unique cards/all supplied URLs verified, all 15 images returned 200 image/webp (1,006,108 bytes combined). Browser checked populated desktop/mobile carousel and End/disabled Next; no overflow at 320/390px. Playback, other browsers, real touch and screen readers remain untested.

## Community — October 16, 2026

Consulted https://www.daybreaker.com/community/ for philosophy, local communities, projects and join section organization. Adapted with original temporary copy, existing Coffee Party typography/header/footer, supplied-film stills and static editorial layouts. No reference statistics, cities, initiative names, imagery or visual theme copied. City/network and initiative announcements remain pending.

Syntax/build passed. Desktop/390px visually reviewed; 320/768/1440px DOM layout checks found no horizontal page overflow or clipped main text. All three photos loaded after entering view. Both signup previews showed the required no-submission message with URL unchanged, join anchor cleared the header, Projects notice worked, and mobile menu opened/Escape dismissed it. Warning/error logs were empty. Both route variants loaded. Shared signup setup moved out of homepage-only initialization. No page motion added. Other browsers, screen readers and real touch remain untested.


## Layered cup exit and sponsor CTA - October 16, 2026

User clarified that subsequent sections should slide over the cup. Reference DOM inspection confirmed an extended absolute wrapper around a sticky helmet, and a Become partner link targeting #contact. Extended the local sticky lane beyond the wall; the sponsor CTA and Venues have opaque white foreground surfaces covering the full-opacity cup as they scroll upward. Removed the exit opacity/scale reduction; kept entrance pop. Phone logo grid provides the equivalent white cover over the smaller cup. Added Become a sponsor linking to #inquiry.

Syntax/build and whitespace checks passed. Desktop screenshot and element hit testing confirmed the CTA covering the cup at opacity 1; mobile screenshot confirmed the grid covering the cup. CTA link reached #inquiry. No horizontal overflow at desktop/390/320/768px, and no checked browser warning/error logs. Reduced motion source path preserved; OS motion preference, real touch and other browsers untested. Screenshot: reports/partner-logo-wall-overlay-exit.png.

## Partnership video hero — October 16, 2026

Reference top visually inspected: wide video with centered white statement and the introductory content underneath. Implemented with supplied Coffee Party loops, original headline and a dark contrast layer; old panorama removed. Existing intro paragraph/CTA/links are directly below on white. Uses white shared branding over video and dark nav over content. Playback control, muted/loop state, offscreen pause, section order and 320/390px clipping/overflow checked. Syntax/build passed. Reduced-motion/data-saving and failure code reviewed but OS/browser settings were not exercised; other browsers and real touch hardware remain untested.


## Centered scale entrance and integrated sponsor CTA - October 16, 2026

Inspected actual Nick Ho public animation configuration: top-center trigger, scale 0 to 1 in 0.8s with back.out(1.4), reverse 0.4s power2.in, plus scrubbed scale 1 to 1.1. CSS uses a -175vh absolute wrapper ending at the section bottom, 100vh sticky stage centered at top 0, and 991/767/479px responsive changes. Used those values in an independent native Web Animations implementation; no reference library/media bundled. Removed all entrance translation and the CTA cover panel. CTA now shares the logo-wall parent and transparent surface; Venues remains above the entire sponsor section. Phone CTA spacing adapts the reference's open bottom area for the smaller supplied cup.

Syntax/build and whitespace checks passed. Browser confirmed hidden/grown scale across the center trigger, matrices with zero translation, transparent CTA area and shared parent. Desktop/390px phone screenshots reviewed. No overflow at 320/390/479/480/767/768/991/992/1024px, including a 500px-tall viewport. CTA destination remains #inquiry. Checked browser logs empty. Reduced-motion and no-JS paths reviewed in source; OS preference, real touch and other browsers untested. Screenshots: reports/partner-cup-integrated-cta-desktop.png and partner-cup-integrated-cta-mobile.png.


## Whole sponsor scene overlap and black venue chapter - October 16, 2026

User review clarified that the sponsor composition must stay in place while Venues covers it. Added a measured sticky scene around the complete sponsor section, with one viewport of overlap and a matching negative margin on Venues. This supplies actual foreground coverage of a stationary sponsor composition, unlike the earlier higher-z-index section that still scrolled in parallel. Reduced motion removes the overlap. Venues and its partnership showcase are full-width black with light copy, controls and placeholders; Artists returns to white. Desktop nav switches color over the black chapter.

Build/syntax/whitespace checks passed. Desktop and phone measurements showed sponsor bottom staying at viewport bottom as the black panel rose; hit testing identified Venues over a point inside the stationary cup. Desktop/mobile screenshots reviewed; venue carousel End reached its end and disabled Next. No overflow at 320/390/767/768/1440px. Both venue surfaces computed #101010 and Artists computed white; navigation computed white over the black chapter. Checked browser logs empty. Reduced-motion source path reviewed, but OS preference, real touch and other browsers remain untested. Screenshots: reports/venues-black-overlay-desktop.png and venues-black-overlay-mobile.png.

## Community video and overlap reference revision — October 16, 2026

The user's annotated Daybreaker community reference supersedes the initial static editorial Community layout. Rebuilt /community with a full-viewport Coffee Party video/text hero; a scroll-darkening about section with introductory copy and two alternating image/text rows; Communities built by Coffee Party with View all projects and three overlapping project panels; Community Ventures; the existing signup previews; and a closing Brand partnerships video/text callout linking to /partnerships.

Live reference inspection observed a sticky projects header and three sticky project wrappers, followed by a relative ventures wrapper. Implemented the overlap independently with CSS sticky panels and opaque white surfaces. The shared Coffee Party header/footer, typography and controls remain. Reference content structure and the user's annotations informed the change; Daybreaker media, project names, member/city counts and investment claims were not copied.

The about background progresses from white to black as it enters the viewport, reverses with scrolling, and uses black/white text selected for contrast through gray. Both alternating film images stay readable without entrance animations. Desktop project rows slide over previous rows under the sticky heading. Phones, viewports shorter than 650px and reduced-motion visitors get ordinary project flow so text and images remain accessible. Reduced motion uses a static dark about surface. No scroll interception or new library.

Both video panels reuse the supplied title-free Coffee Party hero.mp4 / hero-mobile.mp4 loops and existing posters. Each has independent play/pause, muted inline looping, offscreen/hidden-tab suspension, reduced-motion/data-saving poster defaults and error fallback. Only visible video panels load playback sources. The header keeps its white logo over the hero; desktop link color follows hero/about/white sections/closing video. The build now preserves the white header logo for Community as well as Partnerships.

The three project panels are explicitly concept previews: neighbourhood gatherings, local creativity and continuing connections. Approved initiative names/details are still pending. View all projects and project actions retain the Projects preview notice; no new Projects route was built. Community Ventures uses the existing shared carousel controls with one real cold brew product and two explicitly future/concept directions, with inquiry links. No investments, programs or collaborator affiliations are asserted. Confirmed city/network announcements remain pending. Existing disconnected signup forms are retained before the final video callout.

Implementation: Main/src/community.html, community.css and new community.js; shared app import/initialization, syntax-check command and build logo handling updated. Generated output rebuilt; existing partnership work preserved. No deployment.

Verification: syntax/build passed. Desktop and 390px phone visuals reviewed. No horizontal page overflow or clipped visible headings/paragraphs at 320, 390, 768 and 1440px; fixed a 320px hero word during QA. Browser sampled the about background at rgb(138,138,138) with black text, then rgb(8,8,8) with white text. Hero played muted from the desktop/mobile source and paused offscreen. Independent closing-video control exercised. Project overlap measured with first panel pinned at y=144 while the second covered it at y=316; project heading remained above them. View all projects opened the correct pending-page notice. Ventures keyboard End disabled Next; signup retained its exact no-submission notice. Checked warning/error logs were empty. Reduced-motion/data-saving and failure branches were source-reviewed; OS motion preferences, forced network failures, other browsers, screen readers and touch hardware were not exercised. Screenshots (ignored): Main/reports/community-video-hero.png, community-video-mobile.png, community-dark-about.png and community-project-overlap.png.
