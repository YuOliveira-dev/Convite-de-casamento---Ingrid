import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import weddingRoutes from "./routes/api/wedding.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const app = express();
const port = process.env.PORT || 3000;

app.disable("x-powered-by");

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data:",
      "media-src 'self' data:",
      "frame-src https://www.google.com https://maps.google.com",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; "),
  );
  next();
});

app.use(express.json({ limit: "16kb", strict: true }));
app.use(express.static(path.join(rootDir, "public")));

app.use("/api/wedding", weddingRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use((err, _req, res, _next) => {
  const isJsonSyntaxError = err instanceof SyntaxError && "body" in err;

  res.status(isJsonSyntaxError ? 400 : 500).json({
    success: false,
    error: {
      code: isJsonSyntaxError ? "INVALID_JSON" : "INTERNAL_ERROR",
      message: isJsonSyntaxError
        ? "JSON inválido."
        : "Não foi possível processar a solicitação.",
    },
  });
});

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  app.listen(port, () => {
    console.log(`Wedding invitation running at http://localhost:${port}`);
  });
}

export default app;
