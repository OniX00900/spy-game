import { supabase } from "./supabase";

export async function createRoom(
  nickname: string,
  mode: "player" | "spectator",
  wordPack: string = "default"
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
        word_pack: wordPack,
        beta_spy_guess: false,
        custom_words: null,
      })
      .select()
      .single();

  if (error || !room) {
    console.error("Supabase room creation error:", error);
    throw new Error(error?.message || "Не удалось создать запись комнаты");
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
    console.error("Supabase player creation error:", playerError);
    throw new Error(playerError?.message || "Не удалось создать запись хоста");
  }

  return {
    room,
    player,
  };
}