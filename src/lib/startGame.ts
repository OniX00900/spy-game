import { supabase } from "./supabase";

export async function startGame(
  roomCode: string
) {
  const currentPlayerId =
    localStorage.getItem(
      "spy-player-id"
    );

  const { data: room } =
    await supabase
      .from("rooms")
      .select("*")
      .eq("code", roomCode)
      .single();

  if (!room) {
    alert("Комната не найдена");
    return;
  }

  const { data: players } =
    await supabase
      .from("players")
      .select("*")
      .eq("room_id", room.id);

  if (
    !players ||
    players.length < 3
  ) {
    alert(
      "Для начала игры нужно минимум 3 игрока"
    );

    return;
  }

  const currentPlayer =
    players.find(
      (player) =>
        player.id ===
        currentPlayerId
    );

  if (
    !currentPlayer?.is_host
  ) {
    alert(
      "Только хост может начать игру"
    );

    return;
  }

  const spyIndex =
    Math.floor(
      Math.random() *
      players.length
    );

  for (
    let i = 0;
    i < players.length;
    i++
  ) {
    await supabase
      .from("players")
      .update({
        role:
          i === spyIndex
            ? "spy"
            : "civilian",
      })
      .eq("id", players[i].id);
  }

  const words = [
    "КОФЕ",
    "ТАНК",
    "КОШКА",
    "САМОЛЁТ",
    "ПИЦЦА",
  ];

  const secretWord =
    words[
      Math.floor(
        Math.random() *
        words.length
      )
    ];

  const { error } =
    await supabase
      .from("rooms")
      .update({
        state: "roleReveal",
        secret_word:
          secretWord,
      })
      .eq("id", room.id);

  if (error) {
    console.error(error);

    alert(
      "Не удалось начать игру"
    );
  }
}