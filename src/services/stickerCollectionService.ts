import { supabase } from "../lib/supabase";
import type { StickerCollection } from "../types/sticker";

type UserStickerRow = {
  sticker_id: number;
  quantity: number;
};

type CollectionProfileRow = {
  collection_updated_at: string | null;
};

export type SyncedStickerCollection = {
  collection: StickerCollection;
  updatedAt: string | null;
};

export async function fetchUserStickerCollection(
  userId: string
): Promise<SyncedStickerCollection> {
  const { data, error } = await supabase
    .from("user_stickers")
    .select("sticker_id, quantity")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("collection_updated_at")
    .eq("id", userId)
    .single();

  if (profileError) {
    throw profileError;
  }

  const collection = (data ?? []).reduce<StickerCollection>(
    (collection, row: UserStickerRow) => {
      collection[row.sticker_id] = row.quantity;

      return collection;
    },
    {}
  );

  return {
    collection,
    updatedAt:
      (profileData as CollectionProfileRow | null)?.collection_updated_at ??
      null,
  };
}

export async function syncUserStickerCollection(
  userId: string,
  collection: StickerCollection
): Promise<string> {
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

  if (obsoleteStickerIds.length > 0) {
    const { error: deleteError } = await supabase
      .from("user_stickers")
      .delete()
      .eq("user_id", userId)
      .in("sticker_id", obsoleteStickerIds);

    if (deleteError) {
      throw deleteError;
    }
  }

  return updateCollectionTimestamp(userId);
}

async function updateCollectionTimestamp(userId: string): Promise<string> {
  const updatedAt = new Date().toISOString();

  const { error } = await supabase
    .from("profiles")
    .update({
      collection_updated_at: updatedAt,
    })
    .eq("id", userId);

  if (error) {
    throw error;
  }

  return updatedAt;
}
