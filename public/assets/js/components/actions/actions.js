import { createElement, createLinkButton, createSection } from "../../utils/dom.js";

export const renderActions = ({ content, links }) =>
  createSection({
    id: "links",
    className: "bg-off-white py-12",
    children: [
      createElement("div", {
        className: "mx-auto flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-center",
        children: [
          createLinkButton({
            href: links.gifts,
            label: content.actions.giftsLabel,
            icon: "↗",
          }),
        ],
      }),
    ],
  });
