import { createElement, createSection, createSectionHeading } from "../../utils/dom.js";

const inputClass =
  "mt-2 min-h-12 w-full rounded-lg border border-light-gray bg-white px-4 py-3 font-button text-base text-slate-800 outline-none transition duration-300 placeholder:text-slate-400 focus:border-serenity focus:ring-2 focus:ring-serenity/25";

const sanitizeInput = (value, maxLength) =>
  value
    .normalize("NFKC")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  const areaCode = digits.slice(0, 2);
  const subscriber = digits.slice(2);

  if (digits.length <= 2) {
    return areaCode ? `(${areaCode}` : "";
  }

  if (subscriber.length <= 4) {
    return `(${areaCode}) ${subscriber}`;
  }

  const subscriberLength = digits.length === 11 ? 5 : 4;
  return `(${areaCode}) ${subscriber.slice(0, subscriberLength)}-${subscriber.slice(subscriberLength)}`;
};

const createField = ({ id, label, type = "text", attributes = {} }) =>
  createElement("label", {
    className: "block text-left font-button text-sm font-semibold text-slate-700",
    attributes: { for: id },
    children: [
      createElement("span", { text: label }),
      createElement("input", {
        className: inputClass,
        attributes: { id, name: id, type, ...attributes },
      }),
    ],
  });

export const renderRsvp = ({ content }) => {
  const feedback = createElement("p", {
    className: "min-h-6 text-center font-button text-sm text-slate-600",
    attributes: { role: "status", "aria-live": "polite" },
  });

  const form = createElement("form", {
    className: "mx-auto max-w-xl space-y-5",
    attributes: { novalidate: "true" },
    children: [
      createField({
        id: "name",
        label: content.rsvp.fields.name,
        attributes: {
          autocomplete: "name",
          maxlength: "80",
          minlength: "3",
          required: "true",
        },
      }),
      createField({
        id: "phone",
        label: content.rsvp.fields.phone,
        attributes: {
          autocomplete: "tel",
          inputmode: "tel",
          maxlength: "15",
          pattern: "\(?[0-9]{2}\)?\s?[0-9]{4,5}-?[0-9]{4}",
          placeholder: "(11) 99999-9999",
          required: "true",
        },
      }),
      createElement("label", {
        className:
          "block text-left font-button text-sm font-semibold text-slate-700",
        attributes: { for: "message" },
        children: [
          createElement("span", { text: content.rsvp.fields.message }),
          createElement("textarea", {
            className: `${inputClass} min-h-28 resize-none`,
            attributes: {
              id: "message",
              name: "message",
              maxlength: "300",
              rows: "4",
            },
          }),
        ],
      }),
      createElement("button", {
        className:
          "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-serenity px-6 py-3 font-button text-sm font-semibold text-white transition duration-300 hover:bg-leaf focus:outline-none focus:ring-2 focus:ring-serenity focus:ring-offset-2 focus:ring-offset-off-white disabled:cursor-not-allowed disabled:opacity-70",
        text: content.rsvp.actionLabel,
        attributes: { type: "submit" },
      }),
      feedback,
    ],
  });

  const phoneInput = form.querySelector("#phone");
  phoneInput.addEventListener("input", () => {
    phoneInput.value = formatPhone(phoneInput.value);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    feedback.className = "min-h-6 text-center font-button text-sm text-slate-600";

    const formData = new FormData(form);
    const payload = {
      name: sanitizeInput(formData.get("name") || "", 80),
      phone: sanitizeInput(formData.get("phone") || "", 15).replace(/\D/g, ""),
      message: sanitizeInput(formData.get("message") || "", 300),
    };

    const phoneIsValid = /^[0-9]{10,11}$/.test(payload.phone);

    if (payload.name.length < 3 || !phoneIsValid) {
      feedback.className = "min-h-6 text-center font-button text-sm text-red-700";
      feedback.textContent = content.rsvp.validationMessage;
      return;
    }

    const button = form.querySelector("button");
    button.disabled = true;
    feedback.textContent = content.rsvp.loadingMessage;

    try {
      const response = await fetch("/api/wedding/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || "RSVP unavailable.");
      }

      feedback.className = "min-h-6 text-center font-button text-sm text-leaf";
      feedback.textContent = content.rsvp.successMessage;
      form.reset();
    } catch {
      feedback.className = "min-h-6 text-center font-button text-sm text-red-700";
      feedback.textContent = content.rsvp.errorMessage;
    } finally {
      button.disabled = false;
    }
  });

  return createSection({
    id: "confirmacao",
    className: "bg-white",
    children: [
      createSectionHeading({
        eyebrow: content.rsvp.eyebrow,
        title: content.rsvp.title,
        description: content.rsvp.description,
      }),
      form,
    ],
  });
};
