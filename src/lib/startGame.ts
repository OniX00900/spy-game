import { supabase } from "./supabase";
import { defaultWords } from "./wordpacks/default";
import { dotaHeroes } from "./wordpacks/dota2";
import { spyfallLocations } from "./wordpacks/spyfallLocations";

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

  const gamePlayers = players?.filter(
    (player) => player.mode === "player"
  ) || [];

  if (
    gamePlayers.length < 3
  ) {
    alert(
      "Для начала игры нужно минимум 3 игрока"
    );
    return;
  }

  const currentPlayer =
    players?.find(
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
    [...gamePlayers].sort(
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

  let words = defaultWords;

  if (
    room.word_pack ===
    "dota2"
  ) {
    words = dotaHeroes;
  }

  if (
    room.word_pack === "spyfall_locations"
  ) {
    words = spyfallLocations;
  }

  if (room.word_pack === "custom" && room.custom_words) {
    words = room.custom_words
      .split("\n")
      .map((w: string) => w.trim())
      .filter((w: string) => w.length > 0);
  }

  if (words.length === 0) {
    alert("Список слов пуст! Добавьте слова или выберите другой набор.");
    return;
  }

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
        state: "playing",
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