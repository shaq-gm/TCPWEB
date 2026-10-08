(() => {
  const form = document.querySelector('.signup');
  const email = form.elements.email;
  const button = form.querySelector('button');
  const message = document.querySelector('#signup-message');
  const messages = {
    accepted: 'Thanks—you’re on the list. We’ll be in touch.',
    confirmation_required: 'Check your inbox to confirm your email address.',
    already_subscribed: 'Thanks—you’re on the list. We’ll be in touch.',
    validating: 'Thanks—your signup is being checked. Please watch your inbox for any next steps.',
    invalid_email: 'Please enter a valid email address.',
    rate_limited: 'Too many attempts. Please wait a moment and try again.',
    unavailable: 'Signup is not available yet. Please try again soon.',
    error: 'We couldn’t sign you up. Please try again.'
  };
  let pending = false;
  function feedback(text, state) {
    message.textContent = text;
    message.dataset.state = state;
  }
  email.addEventListener('input', () => {
    email.removeAttribute('aria-invalid');
    if (!pending) feedback('', 'idle');
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pending) return;
    email.value = email.value.trim();
    if (!email.validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.setAttribute('aria-invalid', 'true');
      feedback(messages.invalid_email, 'error');
      email.focus();
      return;
    }
    pending = true;
    button.disabled = true;
    email.readOnly = true;
    form.setAttribute('aria-busy', 'true');
    feedback('Signing you up…', 'loading');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, website: form.elements.website.value }),
        signal: controller.signal
      });
      const data = await response.json();
      const success = response.ok && ['accepted', 'already_subscribed', 'confirmation_required', 'validating'].includes(data.status);
      if (data.test === true) {
        feedback(`Local test only—no subscription was created. ${messages[data.status] || messages.error}`, 'test');
      } else {
        feedback(messages[data.status] || messages.error, success ? 'success' : 'error');
      }
      if (data.status === 'invalid_email') email.setAttribute('aria-invalid', 'true');
    } catch {
      feedback(messages.error, 'error');
    } finally {
      clearTimeout(timer);
      pending = false;
      button.disabled = false;
      email.readOnly = false;
      form.removeAttribute('aria-busy');
    }
  });
})();
