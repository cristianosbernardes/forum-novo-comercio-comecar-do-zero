/**
 * Helpers de rastreamento client-side para a Conversions API (CAPI).
 * O navegador dispara o Pixel com um eventID e envia o MESMO eventId para
 * /api/capi, que reenvia server-side. A Meta deduplica por (evento + eventId).
 */

export function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"));
  return match ? decodeURIComponent(match[2]) : undefined;
}

/** _fbp é setado pelo Pixel. Repassamos como veio. */
export function getFbp(): string | undefined {
  return getCookie("_fbp");
}

/**
 * _fbc é setado pelo Pixel quando há fbclid na URL de entrada. Se o cookie não
 * existir mas houver fbclid na URL atual, montamos o fbc no formato esperado.
 */
export function getFbc(): string | undefined {
  const existing = getCookie("_fbc");
  if (existing) return existing;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined;
}

/** UUID com fallback para ambientes sem crypto.randomUUID. */
export function genEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
}

export interface CapiPayload {
  eventId: string;
  email?: string;
  phone?: string;
  name?: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl?: string;
  eventNames?: string[];
}

/** Envia o evento para o endpoint server-side. Nunca lança — é best-effort. */
export function sendCapi(payload: CapiPayload): void {
  try {
    void fetch("/api/capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* noop */
  }
}
