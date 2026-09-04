import { createElement, createSection, createSectionHeading } from "../../utils/dom.js";

export const renderDressCode = ({ content }) =>
  createSection({
    id: "dress-code",
    className: "bg-off-white",
    children: [
      createSectionHeading({
        eyebrow: content.dressCode.eyebrow,
        title: content.dressCode.title,
        description: content.dressCode.description,
      }),
      createElement("div", {
        className: "mx-auto grid max-w-3xl gap-3 sm:grid-cols-3",
        children: content.dressCode.items.map((item) =>
          createElement("article", {
            className:
              "rounded-lg border border-light-gray bg-white/75 p-5 text-center shadow-sm",
            children: [
              createElement("h3", {
                className: "font-button text-sm font-semibold text-leaf",
                text: item.title,
              }),
              createElement("p", {
                className: "mt-3 text-[1.425rem] leading-7 text-slate-700",
                text: item.description,
              }),
            ],
          }),
        ),
      }),
    ],
  });
