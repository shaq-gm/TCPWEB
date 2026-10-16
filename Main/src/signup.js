export function initSignupPreviews() {
  document.querySelectorAll("[data-signup-preview]").forEach((form) => {
    const feedback = form.querySelector(".signup-feedback");
    const fields = [...form.querySelectorAll("input")];
    form.addEventListener("input", () => {
      feedback.textContent = "";
      fields.forEach((field) => field.setCustomValidity(""));
    });
    form.addEventListener("submit", (event) => {
      // UI preview only: never post a form, request a service or store details.
      event.preventDefault();
      feedback.textContent = "";
      fields.forEach((field) => field.setCustomValidity(""));
      if (form.dataset.signupPreview === "sms") {
        const phone = form.querySelector('[name="phone"]');
        const value = phone.value.trim();
        const digits = value.replace(/\D/g, "");
        if (
          phone.value &&
          (!/^\+[\d\s().-]+$/.test(value) ||
            digits.length < 7 ||
            digits.length > 15)
        ) {
          phone.setCustomValidity(
            "Include a country code and 7–15 digits, for example +1 416 555 0123.",
          );
        }
      } else {
        const city = form.querySelector('[name="city"]');
        if (city.value && !city.value.trim())
          city.setCustomValidity("Enter your city.");
      }
      if (!form.reportValidity()) return;
      feedback.textContent =
        "Signup isn’t connected yet. Nothing has been submitted.";
    });
    // Without JavaScript the preview remains disabled, so Enter cannot send a GET.
    form.querySelector("fieldset").disabled = false;
  });
}
