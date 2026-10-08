# Coming-soon website: coding-agent brief

Updated October 8, 2026. This is the self-contained handoff brief for the AI coding agent. The selected signup approach is a custom transparent form connected to Beehiiv. Mobile is the primary design target because most visitors will use phones. This handoff contains requirements only; no website code or image edits have been created.

## Task for the coding agent

Build one fast, mobile-first coming-soon page using the requirements below when implementation is requested. Use the Pedal Mafia reference for composition and restrained styling, the user's coffee image for the visual, and a dedicated logo slot. Include a working custom signup form with loading, success, confirmation-required, and error states. Keep implementation small and maintainable. No video, music, audio controls, navigation menu, countdown, product sections, or added marketing content.

The earlier iframe-based recommendation is superseded by the custom form specified in this document. Do not silently replace it with a Beehiiv embed. Website creation and publication are separate steps; this current request is only to update the plan.

## Asset placeholders and supplied files

| Placeholder | Supplied file | Instruction |
| --- | --- | --- |
| [COFFEE_IMAGE] | C:/Users/sheha/Downloads/Sunlit Coffee Cup Shadow (1).png | Use as the main still image; preserve the source and optimize delivery during implementation. |
| [BRAND_LOGO_SVG] | C:/Users/sheha/Downloads/CP/logos/CP_Logo_SVG_Black.svg | Reserve a logo slot and replace its placeholder with this supplied SVG when the asset is available to the coding agent. |
| [BRAND_NAME] | User-provided brand name | Used for the document title and logo alternative text; do not infer the name from the filename. |
| [BEEHIIV_PUBLICATION_ID] | To be configured | Beehiiv publication ID, not the UUID in the old embed URL. |
| [BEEHIIV_API_KEY] | Server environment variable | Never place in browser code or a committed file. |

The user will attach the image/logo to the coding agent. Treat local paths as source references, not browser asset URLs. Copy supplied assets into the project's asset directory during implementation and use project-relative URLs. If an attachment is unavailable in the target environment, leave its documented slot ready for replacement and report the missing asset; do not invent a replacement logo or photograph.

The SVG has a viewBox of 0 0 859.09 102.5, approximately 8.38:1. Preserve this wide aspect ratio, use it as a crisp SVG image, and retain its supplied black appearance. Reserve its dimensions to avoid a layout jump. A mobile width around 220–280px is a starting point; constrain it to the available space and tune visually. Keep [BRAND_LOGO_SVG] as the explicit placeholder in this handoff; the eventual page should render the supplied logo rather than placeholder text when available.

## Purpose and visitor

Create a simple, atmospheric introduction to the brand before the full website launches. A visitor arriving from social media, word of mouth, or a shared link should see the coffee-cup image, understand that the brand is coming soon, and have one clear action: enter an email address for launch updates through Beehiiv.

The likely visitor is curious about the brand and needs very little information to decide whether to subscribe. This is a planning assumption, not an established audience profile. The coffee image sets the mood; it does not establish what the brand sells. Most visitors will be on mobile, so prioritize their crop, readability, tap targets, keyboard behavior, and load time. Use the default copy below until the user supplies different wording.

## Findings from the reference

I inspected the live [Pedal Mafia site](https://www.pedalmafiaeuro.com/), its delivered HTML and page JavaScript, and its desktop and mobile presentation.

- It is a single viewport composition built with Next.js/React and utility-based styling.
- A looping video fills the background. The code switches between separate desktop and phone videos at 767px and below.
- Most visible branding and event text is a separate image overlay, also with desktop and mobile versions. It appears when video playback reaches approximately two seconds. This is a timed appearance rather than a live-text animation.
- Desktop spreads information around the central subject; mobile places it in a vertical composition.
- The email form is live HTML and submits to the site's own subscription endpoint. It is positioned in relation to the graphic overlay.
- The visible reference looked predominantly grey during inspection. I did not identify a separate green tint layer in the page component. Your requested green treatment will be an intentional addition to our design.

The useful inspiration is the full-screen image-led composition, delayed reveal, restrained typography, and small signup form. Our page can achieve those effects with substantially less machinery.

## Proposed visual direction

Use the supplied original coffee-cup shadow image as the main visual. It is 941 × 1671 pixels, approximately 1.53 MB, with a warm cream background and open space above the cup.

Use a cream base coordinated with the photograph, plus a light sage/olive tint over the image and surrounding base. Start with a sage tone such as #71836B at roughly 10–15% opacity, then tune it visually. This is a starting specification, not a verified final color. Apply the tint below the text and form so it does not wash out their colors.

Use deep forest-green text for legibility against the light image. Start with one simple sans-serif family, modest brand lettering, a clear headline, and ample space. Avoid adding menus, product cards, countdowns, or extra sections to this initial scope.

| Element | Proposed content |
| --- | --- |
| Brand | [BRAND_LOGO_SVG] in the reserved logo slot |
| Headline | Coming soon. |
| Supporting line | Be the first to know when we launch. |
| Signup | Custom email field plus a separate icon submit button |

The logo slot is a placeholder for the attached asset. Headline and supporting line are the implementation defaults unless the user changes them. Do not invent product claims or a launch date.

## Desktop and mobile composition

**Desktop:** Keep the cup toward the left/centre and put the small text-and-signup group in open space to the right. Preserve the portrait image's proportions, using a coordinated cream background and a subtle edge blend to carry the composition across a wide screen. Do not stretch the photograph. Full-screen cover cropping alone would remove too much of the cup on wide monitors; the edge blend will need visual checking against the image's subtle texture.

**Mobile — design this first:** Let the portrait photograph fill the page with an adjusted crop that retains the cup. Place the logo, headline, supporting line, and form together in the lighter space above it. Start with about 20–24px side padding and compact vertical spacing. If the content overlaps the cup at a particular size, adjust the image position or size rather than shrinking the text or controls. The composition should feel like one page, not a card floating in a box. On very short screens, allow natural scrolling instead of clipping content.

Make the email field flex to the available width; the separate icon button should stay at least 48 × 48px, with an 8px gap. Target a 52px form height, at least 16px email text, an email keyboard, and email autocomplete. Keep controls usable on a 320px-wide screen with no horizontal overflow. Account for phone safe-area insets and changing browser chrome. Do not lock scrolling or position the entire form permanently against the bottom edge: it must remain reachable when the on-screen keyboard is open. Let supporting copy wrap naturally.

**Tablet and landscape phones:** Switch layouts according to available width and height, not merely a device label. Prioritize an intact cup, readable copy, and a reachable form. Use a viewport-aware minimum height and permit scrolling when the keyboard opens.

## Reveal behavior

1. Show the image and green tint immediately.
2. After a short pause of roughly 0.3–0.5 seconds, fade in the logo and headline over approximately 0.5 seconds.
3. Reveal the supporting line and signup with a small stagger, completing the sequence within approximately 1.2 seconds so mobile visitors are not made to wait.
4. Keep everything visible afterward; no repeated animation or moving background.

Use CSS opacity/transform transitions only, optionally with a few pixels of movement. Respect reduced-motion preferences by showing content immediately. Keep actual text selectable and readable by assistive technology; do not bake it into the photograph. Ensure content is visible if animation scripting fails. Never wait for Beehiiv or a network response to reveal the page; do not hide a focused control during the reveal.

## Custom transparent signup form

Match the highlighted reference's subtle translucent email field, fine border, small corner radius, and separate square icon button. Use a faint cream/white fill and, if it performs well, a modest blur confined to the controls. Provide a transparent-looking fallback when backdrop blur is unavailable. Keep dark forest-green text, borders, focus indicators, and icon sufficiently visible on our light coffee image; do not copy low-contrast white text indiscriminately.

Use a bell outline like the reference, or an arrow if the user later prefers it. Use a tiny inline SVG rather than downloading an icon library. Give the icon button the accessible name Notify me, and give the email field a real accessible label such as Email address. Use the placeholder Enter your email. The form should fit its mobile container and have a desktop maximum width around 440–500px.

| State | Required behavior/message |
| --- | --- |
| Idle | Email input and separate icon button ready to use. |
| Invalid email | Show Please enter a valid email address. near the field. |
| Submitting | Show Signing you up… and prevent duplicate submissions. |
| Accepted signup | Show Thanks—you’re on the list. We’ll be in touch. only after Beehiiv accepts the request. |
| Confirmation required | Show Check your inbox to confirm your email address. when the configured signup flow requires confirmation. |
| Network/service failure | Show We couldn’t sign you up. Please try again. Keep the entered address and allow retry. |
| Rate limited | Show Too many attempts. Please wait a moment and try again. |

Reserve space for the message so state changes do not move the cup or main layout. Announce feedback through an accessible live region and keep errors associated with the input. Support Enter-key submission, keyboard focus, and touch. A successful API call can still leave a subscriber pending validation/confirmation; do not claim confirmed membership when confirmation is outstanding.

## Beehiiv connection and backend

The original [supplied embed](https://embeds.beehiiv.com/216e7a87-2915-4b2f-87ee-f763942874e7?slim=true) is context only. Do not load its iframe or scripts in the chosen implementation. The custom form should add subscribers to the same intended Beehiiv publication.

Use the official [Create subscription API](https://developers.beehiiv.com/api-reference/subscriptions/create/): POST https://api.beehiiv.com/v2/publications/{publicationId}/subscriptions with server-side Bearer authentication. Read the current documentation at implementation time. Do not assume the embed UUID is a publication ID.

Flow: browser submits the email to a same-origin endpoint such as POST /api/subscribe; that endpoint validates the input and requests the subscription from Beehiiv; it returns a small sanitized response; the browser displays the corresponding state. Keep [BEEHIIV_API_KEY] and [BEEHIIV_PUBLICATION_ID] in server environment variables. Do not call the authenticated Beehiiv API directly from the browser.

Use a small serverless function or existing project backend, whichever suits the chosen hosting environment. Include basic request limits, a hidden honeypot, a sensible upstream timeout, and rate limiting suitable for that environment. Keep private credentials and upstream diagnostic details out of browser responses. Limit collection to the email address and avoid logging addresses unnecessarily.

Preserve the publication's intended double-opt-in settings; do not override them to skip confirmation. Keep reactivate_existing false unless the user explicitly requests resubscription behavior. Explicitly configure welcome-email behavior rather than assuming the API sends one by default. Define handling for already-subscribed addresses based on the real API response and avoid duplicate subscriber creation. Do not enroll people into extra automations or lists without an instruction to do so.

If Beehiiv API access or credentials are unavailable, complete the UI and a clearly identified local test adapter, then document the required configuration. A test adapter must never show a simulated successful signup as a real production subscription. Do not embed secrets in this brief or request that the user paste them into chat. Supply a placeholder-only environment example during implementation.

## Architecture and mobile performance

Prefer static HTML/CSS and minimal JavaScript for form submission, plus one backend endpoint. A frontend framework is unnecessary unless the existing project/hosting requires it. The page must render without waiting for the signup service. Host static assets locally with caching; keep the original assets and create optimized delivery copies during implementation.

- Generate visually checked WebP/AVIF image variants with an appropriate fallback. Start with a mobile hero-image transfer target of 250–350 KB or less; adjust only if visible quality requires it. Do not upscale the source unnecessarily.
- Use responsive image selection so a phone does not download a needlessly large desktop asset. Prioritize the hero image; do not lazy-load the only above-the-fold image or preload every variant.
- Aim for a total initial mobile transfer below 500 KB, including the hero image, and compressed page JavaScript below 20 KB. These are project budgets, not universal guarantees.
- Use a system sans-serif stack initially; if a brand font is later provided, use a single local subsetted WOFF2 with a fallback. Keep the logo as SVG.
- No video/audio requests, animation libraries, large icon packages, unnecessary third-party scripts, or Beehiiv embed downloads. No continuous animation. Restrict any backdrop blur to the small controls and check it on mobile.
- Reserve image/logo/form/message dimensions. Avoid layout shifts, delayed font swapping that moves the form, and reveal delays that materially slow perceived loading.
- Target mobile Lighthouse Performance of at least 95 under recorded test conditions, LCP at or below 2.5 seconds, CLS at or below 0.1, and responsive interaction targeting INP at or below 200 ms. These Core Web Vitals thresholds follow [Google's guidance](https://web.dev/articles/vitals). Lighthouse is a lab check and does not establish real-user INP; distinguish measured results from targets.

Include basic page title, description, favicon, and a social-sharing preview once brand details are available. Do not invent the brand name or promotional claims for metadata.

## Acceptance checks and handoff

Verify 320px, 390px, and 430px phone widths, a short mobile viewport, landscape phone, tablet, typical laptop, and wide desktop. Validate the actual logo's proportions, intact cup, green tint, text contrast, no horizontal scrolling, message space, and a reachable form with the mobile keyboard open. Check touch targets, browser zoom, keyboard navigation, reduced motion, and a usable non-blurred fallback.

Test validation, accepted signup, confirmation-required state, already-subscribed behavior, upstream rejection, timeout, rate limit, and repeated-click prevention. Use a mocked upstream for automated failure/state tests; verify the real integration with an authorized test address. Confirm the subscriber reaches the correct Beehiiv publication and the intended confirmation/welcome behavior occurs. Do not report a live integration as verified if only mocked tests ran.

Check iOS Safari and Android Chrome where available and distinguish viewport emulation from real-device checks. Run one meaningful mobile performance audit and report the image transfer size, total initial transfer, LCP/CLS, and Lighthouse conditions. Resolve failures before delivery and note any unavailable device checks.

Deliver the implementation, optimized assets, setup/run instructions, placeholder-only environment example, and a concise verification report. Explain how to replace [BRAND_LOGO_SVG] and update copy or tint. Identify any missing configuration explicitly. Select a hosting provider when implementation begins; this plan does not assume one or authorize publication.

## Remaining configuration

The coding agent can use the stated copy and design defaults. Final brand name, hosting choice, Beehiiv publication ID/API credentials, and intended welcome-email behavior remain configuration inputs. The supplied logo is available through the asset reference above; the dedicated logo slot remains part of the brief.
