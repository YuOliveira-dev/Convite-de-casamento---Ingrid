import { createElement } from "../../utils/dom.js";

export const renderIntroAnimation = ({ couple, event, content, onOpen }) => {
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

  // Wedding Monogram Emblem Logo
  const monogram = createElement("div", {
    className:
      "relative mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-serenity/30 bg-gradient-to-b from-white to-off-white/90 p-2 shadow-md shadow-serenity/10",
  });

  monogram.innerHTML = `
    <svg class="h-20 w-20 text-serenity" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Logo Ingrid e Tiago">
      <!-- Decorative rings and borders -->
      <circle cx="50" cy="50" r="46" stroke="#8faeca" stroke-width="1.2" stroke-dasharray="3 2" opacity="0.6"/>
      <circle cx="50" cy="50" r="43" stroke="#8faeca" stroke-width="0.8" opacity="0.4"/>

      <!-- Botanical laurel branches -->
      <path d="M 22 64 C 17 52 20 38 31 27 C 27 35 27 48 32 56" stroke="#5d705c" stroke-width="1.1" stroke-linecap="round" fill="none" opacity="0.75"/>
      <path d="M 78 64 C 83 52 80 38 69 27 C 73 35 73 48 68 56" stroke="#5d705c" stroke-width="1.1" stroke-linecap="round" fill="none" opacity="0.75"/>

      <!-- Delicate leaf details -->
      <path d="M 23 46 C 18 44 17 49 23 49" fill="#5d705c" opacity="0.6"/>
      <path d="M 77 46 C 82 44 83 49 77 49" fill="#5d705c" opacity="0.6"/>
      <path d="M 28 34 C 23 31 27 28 30 32" fill="#5d705c" opacity="0.6"/>
      <path d="M 72 34 C 77 31 73 28 70 32" fill="#5d705c" opacity="0.6"/>

      <!-- Intertwined Wedding Rings -->
      <circle cx="46" cy="74" r="5" stroke="#8faeca" stroke-width="1.2" fill="none" opacity="0.85"/>
      <circle cx="54" cy="74" r="5" stroke="#5d705c" stroke-width="1.2" fill="none" opacity="0.85"/>

      <!-- Initials I & T with classic serif styling -->
      <text x="37" y="53" font-family="'Cormorant Garamond', 'Playfair Display', Georgia, serif" font-size="34" font-weight="600" font-style="italic" fill="#8faeca" text-anchor="middle">I</text>
      <text x="49" y="47" font-family="'Great Vibes', cursive" font-size="19" fill="#5d705c" text-anchor="middle">&amp;</text>
      <text x="63" y="54" font-family="'Cormorant Garamond', 'Playfair Display', Georgia, serif" font-size="34" font-weight="500" fill="#8faeca" text-anchor="middle">T</text>
    </svg>
  `;

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
