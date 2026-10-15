import { createElement, createSection, createSectionHeading } from "../../utils/dom.js";

const DEFAULT_RSVP_URL =
  "http://app.buffetmais.com/RSVP/gUoyAoivJPMfqHpCXPOJNYPfulwChn";

export const renderRsvp = ({ content, links }) => {
  const rsvpUrl = links?.rsvp || content?.rsvp?.redirectUrl || DEFAULT_RSVP_URL;

  const card = createElement("div", {
    className:
      "mx-auto max-w-xl rounded-3xl border border-serenity/20 bg-white/95 p-6 sm:p-10 text-center shadow-lg shadow-serenity/5 transition duration-300",
  });

  const cardIntro = createElement("p", {
    className: "mb-6 text-lg sm:text-xl leading-relaxed text-slate-700",
    text:
      content.rsvp?.note ||
      "Para sua comodidade e segurança, a confirmação de presença é feita diretamente na plataforma oficial do Buffet Mais.",
  });

  const button = createElement("button", {
    className:
      "group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-serenity px-8 py-4 font-button text-base font-semibold text-white shadow-md transition duration-300 hover:bg-leaf hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-serenity focus:ring-offset-2 focus:ring-offset-white active:scale-98 cursor-pointer",
    attributes: {
      type: "button",
      id: "btn-confirmar-presenca",
      "aria-label": "Confirmar presença",
    },
    children: [
      createElement("span", {
        className: "text-lg",
        text: "💌",
      }),
      createElement("span", {
        text: content.rsvp?.actionLabel || "Confirmar presença",
      }),
      createElement("span", {
        className: "text-base transition-transform duration-300 group-hover:translate-x-1",
        text: "↗",
      }),
    ],
  });

  const statusContainer = createElement("div", {
    className: "mt-6 hidden transition-all duration-300",
    attributes: {
      role: "status",
      "aria-live": "polite",
    },
  });

  let hasClicked = false;

  const handleConfirmClick = () => {
    // Open confirmation in a new tab
    window.open(rsvpUrl, "_blank", "noopener,noreferrer");

    if (!hasClicked) {
      hasClicked = true;

      // Inactivate the button
      button.disabled = true;
      button.setAttribute("aria-disabled", "true");
      button.className =
        "inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-slate-200 px-8 py-4 font-button text-base font-semibold text-slate-500 cursor-not-allowed shadow-none transition duration-300";

      button.replaceChildren(
        createElement("span", {
          className: "text-base font-bold text-leaf",
          text: "✓",
        }),
        createElement("span", {
          text: content.rsvp?.buttonClickedLabel || "✓ Confirmação Aberta",
        }),
      );

      // Render friendly feedback
      statusContainer.classList.remove("hidden");
      statusContainer.replaceChildren(
        createElement("div", {
          className:
            "rounded-2xl border border-leaf/30 bg-leaf/10 p-5 text-center text-leaf shadow-sm",
          children: [
            createElement("p", {
              className: "font-button text-base font-semibold",
              text: "Página de confirmação aberta em nova aba!",
            }),
            createElement("p", {
              className: "mt-1.5 text-sm text-slate-700",
              text:
                content.rsvp?.successNotice ||
                "Por favor, finalize seu preenchimento no Buffet Mais para garantir sua vaga no nosso grande dia.",
            }),
            createElement("div", {
              className: "mt-4 pt-3 border-t border-leaf/20",
              children: [
                createElement("span", {
                  className: "text-xs text-slate-500 mr-2",
                  text: "A página não abriu?",
                }),
                createElement("a", {
                  className:
                    "text-xs font-semibold text-leaf underline hover:text-serenity cursor-pointer transition-colors",
                  text: "Clique aqui para tentar reabrir",
                  attributes: {
                    href: rsvpUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  },
                }),
              ],
            }),
          ],
        }),
      );
    }
  };

  button.addEventListener("click", handleConfirmClick);

  card.append(cardIntro, button, statusContainer);

  return createSection({
    id: "confirmacao",
    className: "bg-off-white/80 py-16",
    children: [
      createSectionHeading({
        eyebrow: content.rsvp?.eyebrow || "Confirmação de Presença",
        title: content.rsvp?.title || "Sua presença é especial",
        description: content.rsvp?.description,
      }),
      card,
    ],
  });
};
