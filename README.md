# The Coffee Party

A mobile-first coming-soon page using the supplied coffee shadow photograph and transparent artwork overlay. The website is in `site/`. The original planning document is preserved at the repository root.

## Preview locally

Requires Node.js 20.19 or later.

```powershell
cd site
npm ci
npm run dev
```

Open http://localhost:3000. No credentials are required to preview the design. Without Beehiiv configuration, submitting the form displays an unavailable message and creates no subscription.

## Connect the repository to Vercel

Push this folder to a GitHub repository, then import that repository into Vercel. Use these project settings:

| Setting | Value |
| --- | --- |
| Root Directory | `site` |
| Framework Preset | Other |
| Build Command | `npm run check` (provided by `vercel.json`) |
| Output Directory | `dist` (provided by `vercel.json`) |
| Node.js | 22.x or a supported newer version |

The files in `dist/` are the authored production website, not disposable generated output. Commit them, the optimized assets, `api/`, `server/`, `package.json`, `package-lock.json`, and `vercel.json`. Original assets can be retained in the repo; only `dist/` is served publicly.

Vercel deploys `api/subscribe.js` as a Node.js function at `/api/subscribe`. Frontend credentials are never needed. Source: [Vercel Node.js functions](https://vercel.com/docs/functions/runtimes/node-js).

## Activate real signups

Set these **server environment variables** in Vercel Project Settings → Environment Variables for the environments that should accept signups, then redeploy:

| Variable | Where to obtain it |
| --- | --- |
| `BEEHIIV_API_KEY` | A Beehiiv API key with subscription write access, and read access for an existing-subscriber conflict lookup |
| `BEEHIIV_PUBLICATION_ID` | Your actual publication ID, starting with `pub_`; the old embed UUID is not this ID |
| `UPSTASH_REDIS_REST_URL` | REST URL for a persistent Upstash Redis database |
| `UPSTASH_REDIS_REST_TOKEN` | The database's write-capable REST token |

Add Upstash Redis through Vercel Marketplace or connect an existing database. If the integration creates differently named variables, add aliases with the exact names above. This is the shared rate limiter: at most five attempts per client in a 60-second window. Its Redis keys contain a salted hash of the client IP, expire after 60 seconds, and contain no email addresses. Production signup fails closed if the limiter is missing or unavailable. Local previews use a simple in-memory limiter.

For a real local test, copy `site/.env.example` to `site/.env` and replace its placeholders privately. `.env` and `.dev.vars` are ignored by Git. Never paste keys into chat or put them in HTML, JavaScript served to browsers, screenshots, or a commit. Never set a `TEST_SIGNUP_STATUS` variable on Vercel; the production handler ignores the local adapter regardless.

The request preserves your publication's double-opt-in settings with `double_opt_override: "not_set"`. It explicitly sets `send_welcome_email: false`, `reactivate_existing: false`, and `skip_newsletter_list_auto_subscribe: true`. It does not add subscribers to extra lists or automations. Only `active` responses receive the confirmed-list message. `pending` receives an inbox confirmation prompt; `validating` receives a separate message that does not claim confirmed membership. Existing inactive/paused addresses are not reactivated. An explicit HTTP 409 triggers a read-only lookup; an existing active address returned from POST is handled normally, without a second create request. See [Beehiiv create subscription](https://developers.beehiiv.com/api-reference/subscriptions/create/).

After deployment, submit an email address you own and verify the subscriber appears in the intended publication. Check the publication's confirmation email behavior and verify no welcome email is sent. No real subscription has been verified during this build.

## Offline test adapter and checks

Set `TEST_SIGNUP_STATUS=confirmation_required` in `site/.env` and restart `npm run dev` to exercise local form feedback without calling Beehiiv. Supported values: `accepted`, `confirmation_required`, `already_subscribed`, `validating`, `error`, and `rate_limited`. Every mock response is marked `test: true`, and the form states **Local test only—no subscription was created.** Delete/comment this setting to use the real connection.

```powershell
cd site
npm run check
npm test
npm run audit
```

Run the audit with the local server running. Lighthouse uses installed Chrome or Edge on Windows; other systems can set `CHROME_PATH`. Audit reports are saved in `site/reports/` and excluded from Git. See [VERIFICATION.md](site/VERIFICATION.md) for measured results and limits.

## Update the page

- **Overlay:** replace `site/assets/originals/mobile-overlay.png` and run `npm run assets`. The supplied 1128 × 2000 transparent artwork contains the branding and headline; the separate logo and visible HTML copy have been removed. Background and overlay share the same crop and alignment. The same portrait artwork is used on larger screens as a fallback until a desktop-specific overlay is supplied. The original SVG remains preserved but is not displayed.
- **Photograph:** replace `site/assets/originals/coffee.png` and run `npm run assets`. The supplied original is preserved. This generates 640px and 941px AVIF, WebP, and JPEG files without upscaling.
- **Copy and metadata:** visual branding/headline are in the supplied overlay; metadata and a screen-reader-only heading are in `site/dist/index.html`. Signup feedback is in `site/dist/signup.js`.
- **Reveal and position:** `--overlay-delay` is `2s`, followed by an instant reveal with no fade. Reduced-motion visitors see the overlay immediately. `--form-position` is `56svh`, placing the form just below the viewport midpoint; short landscape views use a scrollable side layout.
- **Form appearance:** the controls retain the reference's white fill at 5% opacity, placeholder at 70%, 12px backdrop blur, and 6px corner radius. The borders are strengthened to 2px white at 65% opacity, with a subtle outer edge for visibility on the cream photograph. Controls are 52px tall with 16px input text for touch/keyboard usability.
- **Tint:** adjust `--sage` and `--tint-opacity` at the top of `site/dist/styles.css`.
- **Sharing:** the page has brand title/description and a favicon. After choosing the final domain, set an absolute `og:image` URL to the supplied photo (`https://YOUR_DOMAIN/assets/coffee-941.jpg`) or a supplied brand sharing image. A domain-specific sharing image URL has deliberately not been invented.

No navigation, extra marketing sections, video, audio, countdown, external fonts, Beehiiv embed, or analytics scripts are included.
