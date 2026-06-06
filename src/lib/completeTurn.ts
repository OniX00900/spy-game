import { supabase } from "./supabase";

export async function completeTurn(roomCode: string, playerId: string) {
  // 1. Получаем текущие данные комнаты
  const { data: room } = await supabase
    .from("rooms")
    .select("id, current_turn_number, round")
    .eq("code", roomCode)
    .single();

  if (!room) return;

  // 2. Получаем данные всех игроков для проверки и поиска следующего
  const { data: players } = await supabase
    .from("players")
    .select("id, player_number")
    .eq("room_id", room.id)
    .eq("mode", "player")
    .order("player_number", { ascending: true });

  if (!players || players.length === 0) return;

  // 3. Проверяем, что ход завершает именно текущий игрок
  const currentPlayer = players.find(p => p.id === playerId);
  if (!currentPlayer || currentPlayer.player_number !== room.current_turn_number) {
    console.warn("Попытка завершить ход не в свою очередь");
    return;
  }

  if (!players || players.length === 0) return;

  const currentTurn = room.current_turn_number || 1;
  const currentIndex = players.findIndex((p) => p.player_number === currentTurn);

  let nextTurnNumber: number;
  let nextRound = room.round || 1;

  if (currentIndex === -1 || currentIndex === players.length - 1) {
    // Если игрок последний или не найден — следующий раунд и первый игрок в списке
    nextTurnNumber = players[0].player_number;
    nextRound += 1;
  } else {
    // Иначе просто следующий игрок по списку
    nextTurnNumber = players[currentIndex + 1].player_number;
  }

  // 4. Обновляем состояние комнаты по ID
  await supabase
    .from("rooms")
    .update({
      current_turn_number: nextTurnNumber,
      round: nextRound,
    })
    .eq("id", room.id);
}