# Verification — October 8, 2026

## Measured local mobile audit

Lighthouse 12.8.2, installed Chrome 153 on Windows, localhost, cold navigation, 390 × 844 CSS pixels, device scale factor 3. Mobile simulated throttling: 150ms RTT, approximately 1.6Mbps throughput, 4× CPU slowdown. Results are lab measurements, not a guarantee of production or real-device behavior.

| Metric | Result |
| --- | --- |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| Largest Contentful Paint | 1.057 seconds |
| Cumulative Layout Shift | 0 |
| Total initial transfer, including response overhead | 26,187 bytes (25.6 KiB) |
| Selected hero AVIF body | 7,089 bytes |
| Hero transfer including overhead | 7,284 bytes |
| Transparent overlay WebP body | 7,980 bytes |
| Frontend JavaScript, gzip | 1,129 bytes |

The 640px AVIF is 4,212 bytes. A high-density phone selected the 941px version. WebP and JPEG fallback variants are supplied; no source is upscaled. All browser assets are local and there are no third-party embeds, fonts, videos, or tracking requests. The supplied image attachment differs from the earlier plan's file size: this actual source PNG is 434,984 bytes and is preserved unchanged.

Detailed reports are in the ignored `reports/lighthouse.html`, `reports/lighthouse.json`, and `reports/performance.json` files. Lighthouse cannot establish real-user INP; that remains a production measurement.

## Responsive and interaction checks

The in-app Chromium browser was checked at 320 × 568, 390 × 844, 430 × 932, 390 × 480, 844 × 390, 768 × 1024, 1366 × 768, and 1920 × 1080. Each had no horizontal overflow, a 52px-tall form and submit button, 16px email text, and 63px reserved feedback space. Short and landscape screens allow scrolling. The standalone SVG logo and visible HTML headline/supporting line are removed. The supplied 1128 × 2000 transparent PNG supplies all visible branding and text; background and overlay share identical layout bounds and matching object-fit/object-position rules.

At 390 × 844, the form begins at 472.625px (56% of the screen), rather than the reference's roughly 656px. A short-screen guard moves it below the overlay's headline when necessary. On short landscape views, the form sits alongside the artwork and remains scrollable. The desktop uses the supplied portrait overlay as a fallback on the portrait photo, with the form to the right; no desktop-specific artwork has been supplied.

The overlay waits 2 seconds, then switches from opacity 0 to opacity 1 instantly, with a zero-duration animation and no fade. The form remains available immediately. The transparent source is preserved unchanged; the lossless WebP retains its dimensions and alpha channel. Before/after screenshots are in `reports/mobile-before-reveal.jpg` and `reports/mobile-overlay-preview.jpg`.

The live Pedal Mafia form was inspected. Its fill (white at 5%), placeholder (white at 70%), radius (6px), and backdrop blur (12px) are retained. The input and button borders have been strengthened to 2px white at 65%, with a subtle 1px dark outer edge to improve visibility over the cream photograph. The automated accessibility score does not establish placeholder or border contrast.

The live local browser verified empty-email validation, input focus/error association, Enter-key submission, loading feedback, credential-unavailable feedback, address retention, and a usable focused input. An emulated short viewport verifies scrollable controls but does not reproduce a physical phone keyboard.

CSS inspection verified the reduced-motion immediate reveal, safe-area padding, an accessible screen-reader heading describing the overlay, live signup feedback, and a translucent-control fallback when backdrop blur is unsupported. Reduced-motion OS settings, a physical keyboard overlay, browser 200% zoom, iOS Safari, and physical Android Chrome were not available for complete device checks. The responsive checks are viewport emulation, not real-device certification. Lighthouse's automated accessibility score does not replace a full assistive-technology audit.

## Signup tests

29 automated tests pass. They cover the browser feedback contract and mocked upstream handling for: confirmed active signup, pending confirmation, email validation in progress, existing active subscribers, invalid addresses, inactive/paused/approval-required subscribers, invalid email input, honeypot, method/origin/content-type/body-size restrictions, missing configuration, local mock labeling, production rejection of mock mode, loading and repeated-click prevention, retained address/retry, network rejection, malformed responses, timeout, upstream rate limiting, local rate limiting, and atomic shared Redis rate limiting with fail-closed behavior.

Production signup has **not** been verified with Beehiiv or Redis credentials. No real subscription was created. The same-origin backend and Vercel function are implemented against the current official API documentation. Vercel's cloud build, routing, runtime headers, and public-domain signup should be smoke-tested after repository import. The source is prepared for the private `Shaqatk/TCPWEB` GitHub repository; no Vercel project is linked and no website has been deployed.

## Remaining launch configuration

1. Push/import the repository into Vercel with root directory `site`.
2. Add the four private server variables listed in the root README and redeploy.
3. Configure your final domain and an absolute social-image URL in page metadata.
4. Use an authorized test address to confirm the subscriber reaches the correct publication, confirmation behavior is correct, and welcome email is disabled.
5. Check the final deployed page on physical iOS/Android devices, including the keyboard and text zoom.
