export const createElement = (tagName, options = {}) => {
  const element = document.createElement(tagName);

  if (options.className) {
    element.className = options.className;
  }

  if (options.text !== undefined) {
    element.textContent = options.text;
  }

  if (options.attributes) {
    Object.entries(options.attributes).forEach(([name, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        element.setAttribute(name, String(value));
      }
    });
  }

  if (options.children) {
    element.append(...options.children.filter(Boolean));
  }

  return element;
};

export const createSection = ({ id, className = "", children = [] }) =>
  createElement("section", {
    className: `px-5 py-16 sm:px-8 ${className}`.trim(),
    attributes: { id },
    children,
  });

export const createSectionHeading = ({ eyebrow, title, description }) => {
  const wrapper = createElement("div", {
    className: "mx-auto mb-10 max-w-xl text-center",
  });

  if (eyebrow) {
    wrapper.append(
      createElement("p", {
        className:
          "font-button text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-leaf",
        text: eyebrow,
      }),
    );
  }

  wrapper.append(
    createElement("h2", {
      className: "mt-3 font-title text-5xl leading-none text-serenity sm:text-6xl",
      text: title,
    }),
  );

  if (description) {
    wrapper.append(
      createElement("p", {
        className: "mt-4 text-[1.425rem] leading-8 text-slate-700",
        text: description,
      }),
    );
  }

  return wrapper;
};

export const createLinkButton = ({ href, label, variant = "outline", icon }) => {
  const safeHref = getSafeUrl(href);
  const isExternal = safeHref.startsWith("http");
  const element = createElement(safeHref ? "a" : "span", {
    className:
      variant === "filled"
        ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-serenity px-6 py-3 font-button text-sm font-semibold text-white transition duration-300 hover:bg-leaf focus:outline-none focus:ring-2 focus:ring-serenity focus:ring-offset-2 focus:ring-offset-off-white"
        : "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-serenity px-6 py-3 font-button text-sm font-semibold text-serenity transition duration-300 hover:bg-serenity hover:text-white focus:outline-none focus:ring-2 focus:ring-serenity focus:ring-offset-2 focus:ring-offset-off-white",
    attributes: safeHref
      ? {
          href: safeHref,
          target: isExternal ? "_blank" : undefined,
          rel: isExternal ? "noopener noreferrer" : undefined,
        }
      : { "aria-disabled": "true" },
  });

  if (icon) {
    element.append(createElement("span", { className: "text-base", text: icon }));
  }

  element.append(createElement("span", { text: label }));
  return element;
};

export const getSafeUrl = (value) => {
  if (!value || typeof value !== "string") {
    return "";
  }

  if (value.startsWith("#") || value.startsWith("/")) {
    return value;
  }

  try {
    const url = new URL(value, window.location.origin);
    const allowedProtocols = ["http:", "https:"];

    if (!allowedProtocols.includes(url.protocol)) {
      return "";
    }

    return url.href;
  } catch {
    return "";
  }
};
