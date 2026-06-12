import crypto from "node:crypto";

/**
 * Meta Conversions API (CAPI) — server-side.
 *
 * Recebe o evento do navegador (com o MESMO event_id que o Pixel disparou) e
 * reenvia para a Graph API server-side. A Meta deduplica Pixel + CAPI por
 * (event_name + event_id), então o evento conta UMA vez — mas com Event Match
 * Quality muito melhor (IP real, user agent, fbp/fbc, e-mail/telefone hasheados).
 *
 * Requer a env var META_CAPI_TOKEN (token da API de Conversões do Pixel FNC).
 * Sem o token, a função não quebra a página — apenas não envia (o Pixel continua).
 */

const PIXEL_ID = "1301225395407749"; // Pixel FNC
const API_VERSION = "v21.0";

const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

// Hash de e-mail: trim + lowercase
const hashEmail = (email) => (email ? [sha256(String(email).trim().toLowerCase())] : undefined);

// Hash de telefone: só dígitos, com DDI do Brasil quando ausente
const hashPhone = (phone) => {
  if (!phone) return undefined;
  let digits = String(phone).replace(/\D/g, "");
  if (!digits) return undefined;
  if (digits.length <= 11 && !digits.startsWith("55")) digits = "55" + digits;
  return [sha256(digits)];
};

// Hash de nome: primeiro e último, lowercase
const hashName = (name) => {
  if (!name) return { fn: undefined, ln: undefined };
  const parts = String(name).trim().toLowerCase().split(/\s+/).filter(Boolean);
  return {
    fn: parts[0] ? [sha256(parts[0])] : undefined,
    ln: parts.length > 1 ? [sha256(parts[parts.length - 1])] : undefined,
  };
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    // Sem token configurado: não envia, mas não falha (Pixel do navegador segue valendo).
    res.status(200).json({ skipped: "missing_token" });
    return;
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const { eventId, email, phone, name, fbp, fbc, eventSourceUrl, eventNames } = body;

  const forwarded = (req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const ip = forwarded || req.socket?.remoteAddress || undefined;
  const ua = req.headers["user-agent"] || undefined;

  const { fn, ln } = hashName(name);
  const userData = {
    ...(hashEmail(email) && { em: hashEmail(email) }),
    ...(hashPhone(phone) && { ph: hashPhone(phone) }),
    ...(fn && { fn }),
    ...(ln && { ln }),
    ...(ip && { client_ip_address: ip }),
    ...(ua && { client_user_agent: ua }),
    ...(fbp && { fbp }),
    ...(fbc && { fbc }),
  };

  const names = Array.isArray(eventNames) && eventNames.length ? eventNames : ["Lead", "CompleteRegistration"];
  const eventTime = Math.floor(Date.now() / 1000);

  const data = names.map((eventName) => ({
    event_name: eventName,
    event_time: eventTime,
    action_source: "website",
    event_id: eventId, // mesma chave do Pixel → deduplicação
    ...(eventSourceUrl && { event_source_url: eventSourceUrl }),
    user_data: userData,
    custom_data: {
      content_name: "Fórum Novo Comércio 2026",
      content_category: "Evento",
      currency: "BRL",
      value: 0,
    },
  }));

  const payload = { data };
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;

  try {
    const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await r.json();
    res.status(r.ok ? 200 : 502).json(json);
  } catch (err) {
    // Nunca propaga erro para o cliente — o Pixel já cobre o evento no navegador.
    res.status(200).json({ error: String(err) });
  }
}
