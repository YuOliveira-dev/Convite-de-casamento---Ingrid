import { createElement, createSection, createSectionHeading } from "../../utils/dom.js";

export const renderMessage = ({ content }) =>
  createSection({
    id: "mensagem",
    className: "bg-white",
    children: [
      createSectionHeading({
        eyebrow: content.message.eyebrow,
        title: content.message.title,
      }),
      createElement("p", {
        className:
          "mx-auto max-w-2xl text-center text-2xl leading-10 text-slate-700",
        text: content.message.body,
      }),
    ],
  });
