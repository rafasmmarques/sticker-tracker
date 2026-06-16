type AnalyzeStickerRequest = {
  image?: string;
};

type AnalyzeStickerResponse = {
  success: boolean;
  stickerCode: string | null;
  confidence?: number;
  error?: string;
  retryAfterSeconds?: number | null;
};

type AuthUser = {
  id: string;
};

type RateLimitResult = {
  allowed: boolean;
  reason?: string;
  retryAfterSeconds?: number | null;
};

const MAX_REQUEST_BODY_BYTES = 3_000_000;
const MAX_IMAGE_BASE64_BYTES = 2_800_000;
const SCANNER_RATE_LIMIT_MAX_REQUESTS = 30;
const SCANNER_RATE_LIMIT_WINDOW_SECONDS = 60 * 60;
const DEFAULT_ALLOWED_ORIGINS = [
  "https://minhacolecao.app.br",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const ANALYZE_STICKER_PROMPT = `You are reading the back of a FIFA World Cup 2026 Panini sticker.
Look first at the top-right corner of the sticker, where the sticker code is usually printed.
Ignore player names, team names, logos, flags, barcodes, and all other text.
Identify only the sticker code.
The code format is three uppercase letters followed by a number from 1 to 20, like COL 18, BRA 7, GER 5, or FWC 3.
Return only valid JSON:
{ "stickerCode": "COL 18", "confidence": 0.95 }
If you cannot identify it, return:
{ "stickerCode": null, "confidence": 0 }`;

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");

  if (!isAllowedOrigin(origin)) {
    return jsonResponse(
      {
        success: false,
        stickerCode: null,
        error: "Origin not allowed.",
      },
      403,
      origin,
    );
  }

  if (request.method === "OPTIONS") {
    return new Response("ok", {
      headers: getCorsHeaders(origin),
    });
  }

  if (request.method !== "POST") {
    return jsonResponse(
      {
        success: false,
        stickerCode: null,
        error: "Method not allowed.",
      },
      405,
      origin,
    );
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      console.error("analyze-sticker: GEMINI_API_KEY is not configured.");

      return jsonResponse({
        success: false,
        stickerCode: null,
        error: "Service unavailable.",
      }, 503, origin);
    }

    const token = getBearerToken(request);
    const user = await getAuthenticatedUser(token);

    if (!user) {
      return jsonResponse(
        {
          success: false,
          stickerCode: null,
          error: "Authentication required.",
        },
        401,
        origin,
      );
    }

    const rateLimit = await consumeRateLimit(token);

    if (!rateLimit.allowed) {
      return jsonResponse(
        {
          success: false,
          stickerCode: null,
          error: "Rate limit exceeded.",
          retryAfterSeconds: rateLimit.retryAfterSeconds ?? null,
        },
        429,
        origin,
      );
    }

    const contentLength = Number(request.headers.get("content-length") ?? 0);

    if (contentLength > MAX_REQUEST_BODY_BYTES) {
      return jsonResponse(
        {
          success: false,
          stickerCode: null,
          error: "Image is too large.",
        },
        413,
        origin,
      );
    }

    const requestText = await request.text();

    if (requestText.length > MAX_REQUEST_BODY_BYTES) {
      return jsonResponse(
        {
          success: false,
          stickerCode: null,
          error: "Image is too large.",
        },
        413,
        origin,
      );
    }

    const body = parseRequestBody(requestText);

    if (!body) {
      return jsonResponse(
        {
          success: false,
          stickerCode: null,
          error: "Invalid request body.",
        },
        400,
        origin,
      );
    }

    const image = parseImage(body.image);

    if (!image) {
      console.error("analyze-sticker: request body is missing image.");

      return jsonResponse({
        success: false,
        stickerCode: null,
        error: "Valid JPEG or PNG image is required.",
      }, 400, origin);
    }

    const model = Deno.env.get("GEMINI_MODEL") ?? "gemini-3.5-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: ANALYZE_STICKER_PROMPT,
                },
                {
                  inline_data: {
                    mime_type: image.mimeType,
                    data: image.base64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("analyze-sticker: Gemini request failed.", {
        userId: user.id,
        status: response.status,
        bodyLength: errorText.length,
      });

      return jsonResponse({
        success: false,
        stickerCode: null,
        error: "Image analysis failed.",
      }, 502, origin);
    }

    const geminiResponse = await response.json();
    const rawText = extractText(geminiResponse);
    const parsed = parseGeminiText(rawText);
    const stickerCode = normalizeStickerCode(parsed.stickerCode);

    return jsonResponse({
      success: Boolean(stickerCode),
      stickerCode,
      confidence: parsed.confidence,
    }, 200, origin);
  } catch (error) {
    console.error("analyze-sticker: unexpected error.", error);

    return jsonResponse({
      success: false,
      stickerCode: null,
      error: "Unexpected error.",
    }, 500, origin);
  }
});

function getCorsHeaders(origin: string | null): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin ?? DEFAULT_ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function parseRequestBody(requestText: string): AnalyzeStickerRequest | null {
  try {
    const body = JSON.parse(requestText);

    return isRecord(body) ? body : null;
  } catch {
    return null;
  }
}

function getAllowedOrigins(): string[] {
  const configuredOrigins = Deno.env.get("APP_ALLOWED_ORIGINS");

  if (!configuredOrigins) {
    return DEFAULT_ALLOWED_ORIGINS;
  }

  return configuredOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) {
    return false;
  }

  return getAllowedOrigins().includes(origin);
}

function getBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  const match = authorization?.match(/^Bearer\s+(.+)$/i);

  return match?.[1] ?? null;
}

async function getAuthenticatedUser(token: string | null): Promise<AuthUser | null> {
  if (!token) {
    return null;
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      "apikey": supabaseAnonKey,
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const user = await response.json();

  if (!isRecord(user) || typeof user.id !== "string") {
    return null;
  }

  return {
    id: user.id,
  };
}

async function consumeRateLimit(token: string | null): Promise<RateLimitResult> {
  if (!token) {
    return {
      allowed: false,
      reason: "unauthenticated",
      retryAfterSeconds: null,
    };
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/rpc/consume_scanner_rate_limit`,
    {
      method: "POST",
      headers: {
        "apikey": supabaseAnonKey,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        max_requests: SCANNER_RATE_LIMIT_MAX_REQUESTS,
        window_seconds: SCANNER_RATE_LIMIT_WINDOW_SECONDS,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Rate limit check failed.");
  }

  const result = await response.json();

  return isRateLimitResult(result)
    ? result
    : {
        allowed: false,
        reason: "invalid_rate_limit_response",
        retryAfterSeconds: null,
      };
}

function parseImage(image: string | undefined):
  | {
      base64: string;
      mimeType: string;
    }
  | null {
  if (!image) {
    return null;
  }

  const trimmed = image.trim();
  const dataUrlMatch = trimmed.match(/^data:([^;]+);base64,(.+)$/);

  if (dataUrlMatch) {
    const mimeType = dataUrlMatch[1].toLowerCase();
    const base64 = dataUrlMatch[2];

    if (!isSupportedImageMimeType(mimeType) || !isValidBase64Payload(base64)) {
      return null;
    }

    return {
      mimeType,
      base64,
    };
  }

  if (!isValidBase64Payload(trimmed)) {
    return null;
  }

  return {
    mimeType: "image/jpeg",
    base64: trimmed,
  };
}

function isSupportedImageMimeType(mimeType: string): boolean {
  return mimeType === "image/jpeg" || mimeType === "image/png";
}

function isValidBase64Payload(base64: string): boolean {
  if (!base64 || base64.length > MAX_IMAGE_BASE64_BYTES) {
    return false;
  }

  return /^[A-Za-z0-9+/]+={0,2}$/.test(base64);
}

function extractText(response: unknown): string {
  if (!isRecord(response)) {
    return "";
  }

  const candidates = response.candidates;

  if (!Array.isArray(candidates)) {
    return "";
  }

  return candidates
    .flatMap((candidate) => {
      if (!isRecord(candidate) || !isRecord(candidate.content)) {
        return [];
      }

      const parts = candidate.content.parts;

      if (!Array.isArray(parts)) {
        return [];
      }

      return parts
        .map((part) =>
          isRecord(part) && typeof part.text === "string" ? part.text : "",
        )
        .filter(Boolean);
    })
    .join("\n")
    .trim();
}

function parseGeminiText(text: string): {
  stickerCode: string | null;
  confidence: number;
} {
  try {
    const parsed = JSON.parse(stripCodeFence(text));

    if (isRecord(parsed)) {
      return {
        stickerCode:
          typeof parsed.stickerCode === "string" ? parsed.stickerCode : null,
        confidence:
          typeof parsed.confidence === "number" ? parsed.confidence : 0,
      };
    }
  } catch {
    const match = text.match(/\b([A-Z]{3})\s*-?\s*(\d{1,2})\b/i);

    if (match) {
      return {
        stickerCode: `${match[1]} ${match[2]}`,
        confidence: 0,
      };
    }
  }

  return {
    stickerCode: null,
    confidence: 0,
  };
}

function normalizeStickerCode(code: string | null): string | null {
  if (!code) {
    return null;
  }

  const normalized = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const match = normalized.match(/^([A-Z]{3})(\d{1,2})$/);

  if (!match) {
    return null;
  }

  const number = Number(match[2]);

  if (number < 1 || number > 20) {
    return null;
  }

  return `${match[1]} ${number}`;
}

function stripCodeFence(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
}

function jsonResponse(
  body: AnalyzeStickerResponse,
  status = 200,
  origin: string | null = null,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...getCorsHeaders(origin),
      "Content-Type": "application/json",
    },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isRateLimitResult(value: unknown): value is RateLimitResult {
  return (
    isRecord(value) &&
    typeof value.allowed === "boolean" &&
    (
      value.retryAfterSeconds === undefined ||
      value.retryAfterSeconds === null ||
      typeof value.retryAfterSeconds === "number"
    )
  );
}

export {};
