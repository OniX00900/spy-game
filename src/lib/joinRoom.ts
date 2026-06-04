import { supabase } from "./supabase";

export async function joinRoom(
  roomCode: string,
  nickname: string,
  mode: "player" | "spectator"
) {
  const { data: room } =
    await supabase
      .from("rooms")
      .select("id")
      .eq("code", roomCode)
      .single();

  if (!room) {
    throw new Error("Комната не найдена");
  }

  const { data: player, error } =
    await supabase
      .from("players")
      .insert({
        room_id: room.id,
        nickname,
        mode,
      })
      .select()
      .single();

  if (error) {
    throw error;
  }
  console.log(
    "JOINED PLAYER",
    player
  );
  return player;
}