import { supabase } from "./supabase";

export async function getRoomPlayers(
  roomCode: string
) {
  const { data: room } =
    await supabase
      .from("rooms")
      .select("id")
      .eq("code", roomCode)
      .single();

  if (!room) {
    return [];
  }

  const { data: players } =
    await supabase
      .from("players")
      .select("*")
      .eq("room_id", room.id);

  return players ?? [];
}