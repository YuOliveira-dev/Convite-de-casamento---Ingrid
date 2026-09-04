import { Router } from "express";
import { weddingConfig } from "../../../src/config/wedding.config.js";
import { saveRsvp } from "../../services/google-sheets.js";

const router = Router();

const sanitizeText = (value, maxLength) =>
  String(value ?? "")
    .normalize("NFKC")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

router.get("/", (_req, res) => {
  res.json({
    success: true,
    data: weddingConfig,
  });
});

router.post("/rsvp", async (req, res) => {
  const payload = {
    name: sanitizeText(req.body?.name, 80),
    phone: sanitizeText(req.body?.phone, 20),
    message: sanitizeText(req.body?.message, 300),
  };

  const isValidPhone = /^[0-9]{10,11}$/.test(payload.phone);

  if (payload.name.length < 3 || !isValidPhone) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_RSVP",
        message: "Dados de confirmação inválidos.",
      },
    });
  }

  const result = await saveRsvp(payload);

  if (!result.ok) {
    const isNotConfigured = result.reason === "not-configured";

    return res.status(isNotConfigured ? 503 : 502).json({
      success: false,
      error: {
        code: isNotConfigured ? "RSVP_NOT_CONFIGURED" : "RSVP_UPSTREAM_ERROR",
        message: isNotConfigured
          ? "A confirmação online ainda não está configurada."
          : "Não foi possível salvar a confirmação agora.",
      },
    });
  }

  return res.status(201).json({
    success: true,
    data: { message: "Confirmação registrada." },
  });
});

export default router;
