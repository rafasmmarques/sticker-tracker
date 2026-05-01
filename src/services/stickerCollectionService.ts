import { supabase } from "../lib/supabase";
import type { StickerCollection } from "../types/sticker";

type UserStickerRow = {
  sticker_id: number;
  quantity: number;
};

export async function fetchUserStickerCollection(
  userId: string
): Promise<StickerCollection> {
  const { data, error } = await supabase
    .from("user_stickers")
    .select("sticker_id, quantity")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return (data ?? []).reduce<StickerCollection>(
    (collection, row: UserStickerRow) => {
      collection[row.sticker_id] = row.quantity;

      return collection;
    },
    {}
  );
}

export async function syncUserStickerCollection(
  userId: string,
  collection: StickerCollection
): Promise<void> {
  const rows = Object.entries(collection)
    .map(([stickerId, quantity]) => ({
      user_id: userId,
      sticker_id: Number(stickerId),
      quantity,
    }))
    .filter((row) => row.quantity > 0);

  const { data: currentRows, error: fetchError } = await supabase
    .from("user_stickers")
    .select("sticker_id")
    .eq("user_id", userId);

  if (fetchError) {
    throw fetchError;
  }

  if (rows.length > 0) {
    const { error: upsertError } = await supabase
      .from("user_stickers")
      .upsert(rows, {
        onConflict: "user_id,sticker_id",
      });

    if (upsertError) {
      throw upsertError;
    }
  }

  const activeStickerIds = new Set(rows.map((row) => row.sticker_id));

  const obsoleteStickerIds = (currentRows ?? [])
    .map((row) => row.sticker_id)
    .filter((stickerId) => !activeStickerIds.has(stickerId));

  if (obsoleteStickerIds.length === 0) {
    return;
  }

  const { error: deleteError } = await supabase
    .from("user_stickers")
    .delete()
    .eq("user_id", userId)
    .in("sticker_id", obsoleteStickerIds);

  if (deleteError) {
    throw deleteError;
  }
}
