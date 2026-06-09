type AnalyzeStickerRequest = {
  image?: string;
};

type AnalyzeStickerResponse = {
  success: boolean;
  stickerCode: string | null;
  confidence?: number;
  rawText?: string;
  error?: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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
  if (request.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
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
    );
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      console.error("analyze-sticker: GEMINI_API_KEY is not configured.");

      return jsonResponse({
        success: false,
        stickerCode: null,
        error: "GEMINI_API_KEY is not configured.",
      });
    }

    const body = (await request.json()) as AnalyzeStickerRequest;
    const image = parseImage(body.image);

    if (!image) {
      console.error("analyze-sticker: request body is missing image.");

      return jsonResponse({
        success: false,
        stickerCode: null,
        error: "Image is required.",
      });
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
        status: response.status,
        body: errorText,
      });

      return jsonResponse({
        success: false,
        stickerCode: null,
        error: `Gemini request failed: ${response.status}`,
        rawText: errorText,
      });
    }

    const geminiResponse = await response.json();
    const rawText = extractText(geminiResponse);
    const parsed = parseGeminiText(rawText);
    const stickerCode = normalizeStickerCode(parsed.stickerCode);

    return jsonResponse({
      success: Boolean(stickerCode),
      stickerCode,
      confidence: parsed.confidence,
      rawText,
    });
  } catch (error) {
    console.error("analyze-sticker: unexpected error.", error);

    return jsonResponse({
      success: false,
      stickerCode: null,
      error: error instanceof Error ? error.message : "Unexpected error.",
    });
  }
});

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
    return {
      mimeType: dataUrlMatch[1],
      base64: dataUrlMatch[2],
    };
  }

  return {
    mimeType: "image/jpeg",
    base64: trimmed,
  };
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

function jsonResponse(body: AnalyzeStickerResponse, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export {};
