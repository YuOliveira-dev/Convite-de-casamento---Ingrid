import { createElement, createLinkButton, createSection } from "../../utils/dom.js";

export const renderHero = ({ couple, content, event, assets }) => {
  const hero = createSection({
    id: "inicio",
    className:
      "relative flex min-h-[92svh] items-center overflow-hidden bg-white py-12 text-center",
  });

  const image = createElement("img", {
    className: "absolute inset-0 h-full w-full object-cover",
    attributes: {
      src: assets.heroImage,
      alt: assets.heroImageAlt,
      fetchpriority: "high",
      width: "1024",
      height: "1536",
    },
  });

  const overlay = createElement("div", {
    className: "absolute inset-0 bg-white/44",
  });

  const contentWrapper = createElement("div", {
    className:
      "relative z-10 mx-auto flex max-w-md flex-col items-center px-2 pt-10",
    children: [
      createElement("p", {
        className:
          "font-button text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-leaf",
        text: content.heroKicker,
      }),
      createElement("h1", {
        className:
          "mt-5 font-title text-6xl leading-none text-serenity sm:text-7xl",
        text: couple.names,
      }),
      createElement("p", {
        className: "mt-5 text-xl leading-8 text-slate-700",
        text: content.heroMessage,
      }),
      createElement("p", {
        className: "mt-6 font-button text-sm font-semibold uppercase tracking-[0.18em] text-slate-700",
        text: `${event.displayDate} | ${event.receptionTime}`,
      }),
      createLinkButton({
        href: "#confirmacao",
        label: content.primaryActionLabel,
        variant: "filled",
        icon: "↓",
      }),
    ],
  });

  contentWrapper.lastElementChild.classList.add("mt-8");
  hero.append(image, overlay, contentWrapper);
  return hero;
};
