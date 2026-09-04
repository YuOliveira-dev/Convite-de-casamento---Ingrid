import { createElement, createSection, createSectionHeading } from "../../utils/dom.js";

export const renderSchedule = ({ content }) =>
  createSection({
    id: "cronograma",
    className: "bg-white",
    children: [
      createSectionHeading({
        eyebrow: content.schedule.eyebrow,
        title: content.schedule.title,
      }),
      createElement("div", {
        className: "mx-auto max-w-xl border-l border-serenity/40 pl-6",
        children: content.schedule.items.map((item) =>
          createElement("article", {
            className: "relative pb-8 last:pb-0",
            children: [
              createElement("span", {
                className:
                  "absolute -left-[1.85rem] top-1 h-3 w-3 rounded-full bg-serenity ring-4 ring-white",
                attributes: { "aria-hidden": "true" },
              }),
              createElement("p", {
                className: "font-button text-sm font-semibold text-leaf",
                text: item.time,
              }),
              createElement("h3", {
                className: "mt-1 text-2xl font-semibold text-slate-800",
                text: item.title,
              }),
              createElement("p", {
                className: "mt-2 text-[1.425rem] leading-7 text-slate-700",
                text: item.description,
              }),
            ],
          }),
        ),
      }),
    ],
  });
