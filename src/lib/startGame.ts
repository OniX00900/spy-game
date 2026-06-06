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

  // Перемешивание по алгоритму Фишера-Йейтса для максимальной честности
  const shuffledPlayers = [...gamePlayers];
  for (let i = shuffledPlayers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
  }

  // Финальная проверка баланса: минимум 2 мирных игрока.
  const maxSpies = Math.max(1, shuffledPlayers.length - 2);
  const spyCount = Math.min(
    room.spy_count ?? 1,
    maxSpies
  );

  // Назначаем роли. Первые N игроков в перемешанном массиве — шпионы.
  // Статус хоста здесь не учитывается, важен только mode === "player"
  const updatePromises = shuffledPlayers.map((player, index) => {
    const isSpy = index < spyCount;
    return supabase
      .from("players")
      .update({
        role: isSpy ? "spy" : "civilian",
        player_number: index + 1,
      })
      .eq("id", player.id);
  });

  await Promise.all(updatePromises);

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