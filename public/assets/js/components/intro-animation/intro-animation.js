import { createElement } from "../../utils/dom.js";

export const renderIntroAnimation = ({ couple, event, content, assets, onOpen }) => {
  const overlay = createElement("div", {
    className:
      "fixed inset-0 z-50 flex items-center justify-center bg-[#faf8f5]/97 backdrop-blur-md p-4 sm:p-6 transition-all duration-700 select-none",
    attributes: {
      id: "intro-animation-overlay",
      "aria-modal": "true",
      role: "dialog",
    },
  });

  const card = createElement("div", {
    className:
      "animate-intro-in relative flex w-full max-w-lg flex-col items-center justify-center rounded-3xl border border-serenity/30 bg-white/95 p-8 sm:p-12 text-center shadow-2xl shadow-serenity/10",
  });

  const logoSrc = assets?.monogramLogo || "/assets/img/monogram-logo.jpg";

  // Wedding Monogram Emblem Logo
  const monogram = createElement("div", {
    className:
      "relative mb-5 flex h-32 w-32 sm:h-36 sm:w-36 items-center justify-center rounded-full bg-white p-1 shadow-md shadow-serenity/10 ring-1 ring-serenity/25 overflow-hidden",
    children: [
      createElement("img", {
        className: "h-full w-full object-cover rounded-full",
        attributes: {
          src: logoSrc,
          alt: "Brasão Ingrid & Tiago",
          width: "144",
          height: "144",
          loading: "eager",
        },
      }),
    ],
  });

  // Kicker
  const kicker = createElement("p", {
    className:
      "font-button text-xs font-semibold uppercase tracking-[0.28em] text-leaf",
    text: content?.heroKicker || "Convite de Casamento",
  });

  // Couple names
  const names = createElement("h1", {
    className:
      "mt-3 font-title text-5xl leading-tight text-serenity sm:text-6xl md:text-7xl",
    text: couple?.names || "Ingrid & Tiago",
  });

  // Date and location
  const dateInfo = createElement("p", {
    className:
      "mt-4 font-button text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 sm:text-sm",
    text: `${event?.displayDate || "20.02.2027"} • GUARULHOS, SP`,
  });

  // Welcoming message
  const welcomeText = createElement("p", {
    className:
      "mt-4 font-body text-xl italic text-slate-700 max-w-xs leading-relaxed",
    text: "Preparamos este momento com todo amor para viver com você.",
  });

  // Action button
  const openButton = createElement("button", {
    className:
      "animate-gentle-pulse mt-8 inline-flex items-center justify-center gap-2.5 rounded-full bg-serenity px-8 py-3.5 font-button text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-lg shadow-serenity/30 transition duration-300 hover:bg-leaf hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-serenity focus:ring-offset-2 cursor-pointer active:scale-95",
    attributes: {
      type: "button",
      id: "btn-abrir-convite",
    },
    children: [
      createElement("span", {
        className: "text-base",
        text: "♪",
      }),
      createElement("span", {
        text: "Abrir Convite",
      }),
    ],
  });

  const tip = createElement("p", {
    className: "mt-3 text-[11px] text-slate-600 font-button tracking-wider",
    text: "Toque para abrir o convite",
  });

  let isDismissed = false;

  const dismissIntro = () => {
    if (isDismissed) return;
    isDismissed = true;

    // Trigger audio
    if (typeof onOpen === "function") {
      try {
        onOpen();
      } catch (e) {
        console.error("Error starting audio on open:", e);
      }
    }

    // Trigger smooth fade out transition
    overlay.classList.add("intro-dismissing");

    setTimeout(() => {
      overlay.remove();
    }, 850);
  };

  openButton.addEventListener("click", (e) => {
    e.stopPropagation();
    dismissIntro();
  });

  // Also allow clicking anywhere on overlay for ease of use
  overlay.addEventListener("click", () => {
    dismissIntro();
  });

  card.addEventListener("click", (e) => {
    // Prevent clicking other parts of card from accidentally triggering twice, but still allow openButton
    if (e.target !== openButton && !openButton.contains(e.target)) {
      dismissIntro();
    }
  });

  card.append(monogram, kicker, names, dateInfo, welcomeText, openButton, tip);
  overlay.append(card);

  return {
    element: overlay,
    dismiss: dismissIntro,
  };
};
