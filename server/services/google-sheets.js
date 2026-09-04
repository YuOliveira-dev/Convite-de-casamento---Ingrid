const configuredWebhookUrl =
  "https://script.google.com/macros/s/AKfycbzVZprstCmhAN0U6uyQ3Yqb5puXtGSWxga76d1ewD7JkaAGYB75W8VxprwJj222vbfQ/exec";
const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || configuredWebhookUrl;

export const isGoogleSheetsConfigured = () => Boolean(webhookUrl);

export const saveRsvp = async (rsvp) => {
  if (!webhookUrl) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const requestUrl = new URL(webhookUrl);
    requestUrl.searchParams.set("action", "Create");
    requestUrl.searchParams.set("nome", rsvp.name);
    requestUrl.searchParams.set("telefone", rsvp.phone);
    requestUrl.searchParams.set("mensagem", rsvp.message);

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return { ok: false, reason: "upstream-error" };
    }

    return { ok: true };
  } catch {
    return { ok: false, reason: "upstream-error" };
  }
};
