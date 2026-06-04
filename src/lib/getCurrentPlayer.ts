import { supabase } from "./supabase";

export async function getCurrentPlayer(
  playerId: string
) {
  const { data } =
    await supabase
      .from("players")
      .select("*")
      .eq("id", playerId)
      .single();

  return data;
}