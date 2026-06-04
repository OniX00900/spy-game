import { supabase } from "./supabase";

export async function endGame(
  roomId: string
) {
  await supabase
    .from("players")
    .update({
      role: null,
      player_number: null,
    })
    .eq("room_id", roomId);

  await supabase
    .from("rooms")
    .update({
      state: "lobby",
      round: 1,
      secret_word: null,
    })
    .eq("id", roomId);
}