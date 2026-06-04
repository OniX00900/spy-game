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

  const shuffledPlayers =
    [...players].sort(
      () => Math.random() - 0.5
    );

  const spyCount =
    Math.max(
      0,
      Math.min(
        room.spy_count ?? 1,
        shuffledPlayers.length
      )
    );

  const spyIndexes =
    new Set<number>();

  while (
    spyIndexes.size <
    spyCount
  ) {
    spyIndexes.add(
      Math.floor(
        Math.random() *
          shuffledPlayers.length
      )
    );
  }

  for (
    let i = 0;
    i < shuffledPlayers.length;
    i++
  ) {
    await supabase
      .from("players")
      .update({
        role:
          spyIndexes.has(i)
            ? "spy"
            : "civilian",
        player_number:
          i + 1,
      })
      .eq(
        "id",
        shuffledPlayers[i].id
      );
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
        round: 1,
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