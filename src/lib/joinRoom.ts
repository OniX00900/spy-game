import { supabase } from "./supabase"; // Предполагаем, что supabase настроен

export async function joinRoom(roomCode: string, nickname: string, mode: "player" | "spectator") {
  // Сначала проверяем, существует ли комната
  const { data: roomData, error: roomError } = await supabase
    .from("rooms")
    .select("id")
    .eq("code", roomCode)
    .single();

  if (roomError || !roomData) {
    throw new Error("Комната с таким кодом не найдена.");
  }

  const roomId = roomData.id;

  // Затем вставляем игрока в таблицу 'players'
  const { data: playerData, error: playerError } = await supabase
    .from("players")
    .insert({
      room_id: roomId,
      nickname: nickname,
      mode: mode,
      is_host: false, // Присоединяемся как зритель, поэтому не хост
    })
    .select()
    .single();

  if (playerError || !playerData) {
    throw new Error("Не удалось присоединиться к комнате.");
  }

  return { player: playerData };
}