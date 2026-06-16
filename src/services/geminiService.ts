import { supabase } from "../lib/supabase";

export type AnalyzeStickerResponse = {
  success: boolean;
  stickerCode: string | null;
  confidence?: number;
  error?: string;
  retryAfterSeconds?: number | null;
};

export async function analyzeStickerImage(
  image: string,
): Promise<AnalyzeStickerResponse> {
  const { data, error } = await supabase.functions.invoke<AnalyzeStickerResponse>(
    "analyze-sticker",
    {
      body: {
        image,
      },
    },
  );

  if (error) {
    const parsedError = await parseFunctionError(error);

    if (parsedError) {
      return parsedError;
    }

    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("A análise não retornou dados.");
  }

  return data;
}

async function parseFunctionError(
  error: unknown,
): Promise<AnalyzeStickerResponse | null> {
  if (
    typeof error !== "object" ||
    error === null ||
    !("context" in error)
  ) {
    return null;
  }

  const context = (error as { context?: unknown }).context;

  if (!(context instanceof Response)) {
    return null;
  }

  try {
    const parsed = await context.json();

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "success" in parsed &&
      "stickerCode" in parsed
    ) {
      return parsed as AnalyzeStickerResponse;
    }
  } catch {
    return null;
  }

  return null;
}
