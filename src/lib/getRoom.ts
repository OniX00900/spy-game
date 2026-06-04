import { supabase } from "./supabase";

export async function getRoom(
  roomCode: string
) {
  const { data } =
    await supabase
      .from("rooms")
      .select("*")
      .eq("code", roomCode)
      .single();

  return data;
}