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

  console.log(
    "ROOM",
    room
  );

  if (!room) {
    return [];
  }

  const { data: players } =
    await supabase
      .from("players")
      .select("*")
      .eq("room_id", room.id);

  console.log(
    "PLAYERS",
    players
  );

  return players ?? [];
}