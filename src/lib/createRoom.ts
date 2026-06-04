import { supabase } from "./supabase";

export async function createRoom(
  nickname: string,
  mode: "player" | "spectator"
) {
  const code = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  const { data: room, error } =
    await supabase
      .from("rooms")
      .insert({
        code,
        state: "lobby",
      })
      .select()
      .single();

  if (error || !room) {
    console.error(error);
    return null;
  }

  const {
    data: player,
    error: playerError,
  } = await supabase
    .from("players")
    .insert({
      room_id: room.id,
      nickname,
      mode,
      is_host: true,
    })
    .select()
    .single();

  if (playerError || !player) {
    console.error(playerError);
    return null;
  }

  return {
    room,
    player,
  };
}