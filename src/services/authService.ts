import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export async function signInWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(getReadableAuthError(error.message));
  }
}

export async function signUpWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) {
    throw new Error(getReadableAuthError(error.message));
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(getReadableAuthError(error.message));
  }
}

export async function ensureUserProfile(user: User) {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      display_name: getDefaultDisplayName(user),
      is_public: false,
    },
    {
      onConflict: "id",
    }
  );

  if (error) {
    throw error;
  }
}

function getDefaultDisplayName(user: User): string {
  if (!user.email) {
    return "Colecionador";
  }

  return user.email.split("@")[0];
}

function getReadableAuthError(message: string): string {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("email not confirmed")) {
    return "Você precisa confirmar seu e-mail antes de entrar. Confira também a caixa de spam.";
  }

  if (normalizedMessage.includes("invalid login credentials")) {
    return "E-mail ou senha inválidos. Se você acabou de criar a conta, confirme o e-mail antes de entrar.";
  }

  if (normalizedMessage.includes("user already registered")) {
    return "Essa conta já existe. Tente entrar ou recupere sua senha.";
  }

  return "Não foi possível concluir a autenticação agora.";
}
