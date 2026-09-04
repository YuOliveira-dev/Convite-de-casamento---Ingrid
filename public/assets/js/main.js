import { renderActions } from "./components/actions/actions.js";
import { renderCountdown } from "./components/countdown/countdown.js";
import { renderDressCode } from "./components/dress-code/dress-code.js";
import { renderFooter } from "./components/footer/footer.js";
import { renderHero } from "./components/hero/hero.js";
import { renderLocation } from "./components/location/location.js";
import { renderMessage } from "./components/message/message.js";
import { renderRsvp } from "./components/rsvp/rsvp.js";
import { renderSchedule } from "./components/schedule/schedule.js";

const app = document.querySelector("#app");

const renderApp = (config) => {
  app.replaceChildren(
    renderHero(config),
    renderCountdown(config),
    renderMessage(config),
    renderDressCode(config),
    renderSchedule(config),
    renderLocation(config),
    renderRsvp(config),
    renderActions(config),
    renderFooter(config),
  );
};

const renderError = () => {
  const section = document.createElement("section");
  section.className =
    "flex min-h-screen items-center justify-center px-6 text-center";

  const message = document.createElement("p");
  message.className = "font-body text-xl text-slate-700";
  message.textContent = "Não foi possível carregar o convite agora.";

  section.append(message);
  app.replaceChildren(section);
};

const init = async () => {
  try {
    const response = await fetch("/api/wedding", {
      headers: { Accept: "application/json" },
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error("Unable to load wedding configuration.");
    }

    renderApp(result.data);
  } catch (error) {
    renderError();
    console.error(error);
  }
};

init();
