import {
  createElement,
  createLinkButton,
  createSection,
  createSectionHeading,
  getSafeUrl,
} from "../../utils/dom.js";

export const renderLocation = ({ content, event, links }) => {
  const mapUrl = getSafeUrl(links.mapEmbed);

  return createSection({
    id: "localizacao",
    className: "bg-off-white",
    children: [
      createSectionHeading({
        eyebrow: content.location.eyebrow,
        title: content.location.title,
        description: content.location.description,
      }),
      createElement("div", {
        className: "mx-auto max-w-3xl overflow-hidden rounded-lg border border-light-gray bg-white shadow-sm",
        children: [
          mapUrl
            ? createElement("iframe", {
                className: "h-72 w-full",
                attributes: {
                  src: mapUrl,
                  title: content.location.mapTitle,
                  loading: "lazy",
                  referrerpolicy: "no-referrer-when-downgrade",
                },
              })
            : createElement("div", {
                className:
                  "flex h-72 items-center justify-center bg-light-gray px-8 text-center text-lg text-slate-600",
                text: content.location.emptyMapMessage,
              }),
          createElement("div", {
            className: "space-y-4 p-6 text-center",
            children: [
              createElement("h3", {
                className: "text-2xl font-semibold text-slate-800",
                text: event.venueName,
              }),
              createElement("p", {
                className: "text-[1.425rem] leading-7 text-slate-700",
                text: event.venueAddress,
              }),
              createElement("div", {
                className: "flex flex-wrap justify-center gap-3",
                children: [
                  createLinkButton({
                    href: links.maps,
                    label: content.location.actionLabel,
                    icon: "↗",
                  }),
                  createLinkButton({
                    href: links.waze,
                    label: content.location.wazeActionLabel,
                    icon: "↗",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
