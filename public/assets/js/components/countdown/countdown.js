import { createElement, createSection, createSectionHeading } from "../../utils/dom.js";

const timeParts = [
  ["days", "Dias"],
  ["hours", "Horas"],
  ["minutes", "Minutos"],
  ["seconds", "Segundos"],
];

export const renderCountdown = ({ content, event }) => {
  const counters = new Map();
  const grid = createElement("div", {
    className: "mx-auto grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4",
  });

  timeParts.forEach(([key, label]) => {
    const value = createElement("strong", {
      className: "block font-button text-3xl font-semibold text-serenity",
      text: "00",
    });
    counters.set(key, value);

    grid.append(
      createElement("div", {
        className:
          "rounded-lg border border-light-gray bg-white/70 px-3 py-5 text-center shadow-sm",
        children: [
          value,
          createElement("span", {
            className:
              "mt-2 block font-button text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500",
            text: label,
          }),
        ],
      }),
    );
  });

  const update = () => {
    const distance = Math.max(new Date(event.dateTime).getTime() - Date.now(), 0);
    const seconds = Math.floor(distance / 1000);
    const values = {
      days: Math.floor(seconds / 86400),
      hours: Math.floor((seconds % 86400) / 3600),
      minutes: Math.floor((seconds % 3600) / 60),
      seconds: seconds % 60,
    };

    Object.entries(values).forEach(([key, value]) => {
      counters.get(key).textContent = String(value).padStart(2, "0");
    });
  };

  update();
  window.setInterval(update, 1000);

  return createSection({
    id: "contagem",
    className: "bg-off-white",
    children: [
      createSectionHeading({
        eyebrow: content.countdown.eyebrow,
        title: content.countdown.title,
        description: content.countdown.description,
      }),
      grid,
    ],
  });
};
