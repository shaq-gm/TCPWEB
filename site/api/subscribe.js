import { handleSubscribe } from '../server/subscribe.mjs';

export default {
  async fetch(request) {
    // Test adapter and local rate limiter can never be enabled on Vercel.
    return handleSubscribe(request, { ...process.env, LOCAL_PREVIEW: 'false' });
  }
};
