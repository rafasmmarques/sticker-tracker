import { supabase } from "../lib/supabase";

export type AnalyzeStickerResponse = {
  success: boolean;
  stickerCode: string | null;
  confidence?: number;
  rawText?: string;
  error?: string;
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
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("A análise não retornou dados.");
  }

  return data;
}
