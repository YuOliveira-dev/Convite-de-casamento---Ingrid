import { createElement } from "../../utils/dom.js";

const renderFooter = ({ content, couple }) =>
  createElement("footer", {
    className: "relative bg-white px-5 py-10 text-center",
    children: [
      createElement("p", {
        className: "font-title text-4xl text-serenity",
        text: couple.names,
      }),
      createElement("p", {
        className: "mt-3 text-[1.425rem] text-slate-700",
        text: content.footer.message,
      }),
      createElement("button", {
        className:
          "fixed bottom-5 right-5 z-10 inline-flex h-12 w-12 translate-y-4 items-center justify-center rounded-full bg-serenity text-xl text-white opacity-0 shadow-lg transition duration-300 pointer-events-none hover:bg-leaf focus:outline-none focus:ring-2 focus:ring-serenity focus:ring-offset-2 focus:ring-offset-off-white",
        text: "↑",
        attributes: {
          type: "button",
          "aria-label": "Voltar ao topo",
          title: "Voltar ao topo",
          "aria-hidden": "true",
          tabindex: "-1",
        },
      }),
    ],
  });

const setupBackToTop = (footer) => {
  const button = footer.querySelector("button");
  const updateVisibility = () => {
    const isVisible = window.scrollY > 320;
    button.classList.toggle("translate-y-4", !isVisible);
    button.classList.toggle("opacity-0", !isVisible);
    button.classList.toggle("pointer-events-none", !isVisible);
    button.classList.toggle("translate-y-0", isVisible);
    button.classList.toggle("opacity-100", isVisible);
    button.setAttribute("aria-hidden", String(!isVisible));
    button.setAttribute("tabindex", isVisible ? "0" : "-1");
  };

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();
  return footer;
};

const createFooter = ({ content, couple }) =>
  setupBackToTop(renderFooter({ content, couple }));

export { createFooter as renderFooter };
