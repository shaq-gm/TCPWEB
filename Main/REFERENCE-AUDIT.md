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
