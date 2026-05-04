import { supabase } from "../lib/supabase";
import type { Profile, PublicProfile } from "../types/sticker";

type ProfileRow = {
  id: string;
  username: string | null;
  display_name: string | null;
  link_ativo: boolean;
  created_at: string;
};

type PublicProfileRow = {
  id: string;
  username: string;
  link_ativo: boolean;
};

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, link_ativo, created_at")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  const row = data as ProfileRow;
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    linkAtivo: row.link_ativo,
    createdAt: row.created_at,
  };
}

export async function getPublicProfileByUsername(
  username: string
): Promise<PublicProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, link_ativo")
    .eq("username", username.toLowerCase())
    .eq("link_ativo", true)
    .single();

  if (error || !data) {
    return null;
  }

  const row = data as PublicProfileRow;
  return {
    id: row.id,
    username: row.username,
    linkAtivo: row.link_ativo,
  };
}

export async function checkUsernameAvailability(
  username: string,
  currentUserId?: string
): Promise<boolean> {
  const query = supabase
    .from("profiles")
    .select("id")
    .eq("username", username.toLowerCase());

  if (currentUserId) {
    query.neq("id", currentUserId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).length === 0;
}

export async function updateTradeLink(
  userId: string,
  username: string | null,
  linkAtivo: boolean
): Promise<void> {
  if (username) {
    const isAvailable = await checkUsernameAvailability(username, userId);
    if (!isAvailable) {
      throw new Error("Este nome de usuário já está em uso.");
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username: username?.toLowerCase() ?? null,
      link_ativo: linkAtivo,
    })
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

export async function getPublicCollection(
  userId: string
): Promise<Record<number, number>> {
  const { data, error } = await supabase
    .from("user_stickers")
    .select("sticker_id, quantity")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  const collection: Record<number, number> = {};
  (data ?? []).forEach((row: { sticker_id: number; quantity: number }) => {
    collection[row.sticker_id] = row.quantity;
  });

  return collection;
}