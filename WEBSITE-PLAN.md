# Coffee Party website: shared project brief

Updated: October 15, 2026
Status: homepage and shared header/menu/footer implemented in `Main/` as a local design preview. A two-column SMS/newsletter signup UI now sits below Upcoming Events. Forms are preview-only; SMS/email integrations and other pages remain unbuilt.

## Start here in a new chat

Read this file and README.md before starting work. Inspect current files and Git status. This file captures decisions and proposals across chats; it is not a claim that future chats automatically inherit the conversation. Update the status and handoff notes after each completed stage.

The existing `site/` is a coming-soon page with a Beehiiv subscription integration described in README.md. It is preserved. The replacement homepage is isolated in the user-requested `Main/` folder. Do not silently replace the signup provider or deploy the replacement.

## Scope and sequence

Build the public Coffee Party website first. Work page by page, reviewing the homepage before developing the remaining pages. The quick-link subdomain, dedicated waitlist pages, internal dashboard, Supabase integration, and Twilio messaging are later work. The replacement uses static HTML/CSS and JavaScript, built with esbuild; no frontend framework is required for this stage.

1. Establish sitemap, section outlines, navigation, and visitor journeys (this brief).
2. Inspect No Art visually on desktop and mobile; record design values and actual interactions. Build shared header/menu/footer and the homepage with supplied Coffee Party assets and original placeholder copy. Review and finalize this stage.
3. Build Events and its detail template using No Art's events reference. Decide real event content at this stage.
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

The user's requested direction is a close one-for-one recreation of No Art's homepage and events presentation: colors, typography, layout, header/menu behavior, footer composition, globe, and responsive behavior, adapted to Coffee Party branding. Do not substitute a generic event-site design. Omit the homepage shop section.

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
6. Shared footer, matching reference composition with Coffee Party labels and destinations.

No shop section. The user's approved two-column signup section supersedes the original footer-only signup proposal. The footer's Join the party link points to `/#join`. Final signup channels/providers are deferred; the existing Beehiiv integration remains untouched. Valid preview submissions must say “Signup isn’t connected yet. Nothing has been submitted.” No details are sent, stored or claimed as subscribed.

### Events `/events`

- Upcoming events listing.
- Event detail route `/events/[slug]` when event content is ready.
- Event details connect to external tickets or a clearly labeled pre-sale/waitlist destination.
- Desktop and mobile presentation/interaction should follow the No Art events reference.
- Do not populate with real-looking invented events in the homepage phase.

### Partnerships `/partnerships`

- Brand partnerships / introduction.
- Current partners (use "tour partners" only if accurate).
- Recent brand collaborations / proof of past work.
- Product sampling.
- Venue collaborations.
- Artists / performers.
- Inquiry section `/partnerships#inquiry`, with inquiry type covering the relevant collaboration categories.
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

### Our Story `/our-story`

- Founders' vision.
- Coffee Party values and philosophy.
- What to expect at an event.
- History / milestones, with factual dates deferred until supplied.
- Links to Community and Events.

"About" in navigation points here; do not create a competing About page.

### Press `/press` — proposed supporting page

- Media coverage.
- Press releases.
- Press kit and media inquiry entry point when available.

The user provided this reference and screenshot sections; treat Press as a supporting page rather than a fourth initial header item. Do not invent media endorsements.

### Contact `/contact` — proposed supporting page

- General inquiry entry point.
- Direct partnership inquiries to `/partnerships#inquiry`.
- Press inquiry destination as appropriate.

Privacy and Terms should be footer destinations before launch, with supplied/approved content. No shop route is included in the initial build.

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

- Requested order preserved, with no shop section.
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
- Original temporary introduction, four clearly labeled event design previews in a responsive carousel, and an interactive country globe. No shop section.
- Shared six-link header: Event / Partner / About above Community / Projects / Tickets on desktop; the same labels vertically on mobile. An inset mobile menu uses a native modal dialog with Escape support and focus return, plus Instagram/YouTube/SoundCloud placeholders at its bottom.
- Follow-up review fixes: staged first-visit video reveal with percentage/bar and delayed header/copy entrance; top-right scale animation on menu open and close; opaque dark Menu button with white text/square; solid white top-left logo anchored to the page top. Header blending and the dark logo backing are removed; the logo scrolls out of view while Menu stays pinned.
- Shared outlined footer with desktop link groups and mobile accordions. Join the party links to the new homepage signup UI. No signup success is implied, and Beehiiv remains untouched.
- Two independent signup preview forms below Upcoming Events: phone number for SMS, free-text city and email for newsletter. Visible labels, 16px inputs, keyboard focus, native required/email validation, a country-code/phone-format check and inline status messages are implemented. Forms are disabled until their local submit handler is attached so a missing script cannot accidentally submit details in a URL. No backend, storage, analytics or provider connection was added.
- Local globe geography, drag/keyboard rotation, motion control, sample-marker information and All/Upcoming filters. Toronto, Barcelona and London are visibly labeled sample coordinates, not confirmed Coffee Party destinations. Upcoming correctly shows no announced locations.
- Intended future URLs retained in links. Ordinary clicks open clear preview notices; no Events, Our Story, Partnerships, Projects, Community, Press, Contact or legal pages are implemented yet.
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

Next: review and finalize the homepage and shared elements, including crop, typography substitution, spacing, placeholder artwork and globe. Confirm real event/city/contact/social content when available. Build Events and its detail template only after homepage review; preserve the reviewed shared components. No remaining page is complete merely because a footer link or preview notice exists.

Suggested next-chat prompt:

"Read WEBSITE-PLAN.md, README.md, Main/README.md and Main/REFERENCE-AUDIT.md. Continue from the homepage preview in Main. Review/finalize the homepage and shared header/footer first, and preserve the coming-soon site. Do not develop other pages, replace the signup provider or deploy until that scope is requested. Update WEBSITE-PLAN.md after the next completed stage."
