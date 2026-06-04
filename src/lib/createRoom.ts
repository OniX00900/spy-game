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
        spy_count: 1,
        spies_know_each_other: false,
        reveal_role_on_death: false,
        reveal_votes: false,
        beta_spy_guess: false,
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