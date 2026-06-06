"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Props {
  className?: string;
  roomCode: string;
}

export function LeaveRoomButton({ className, roomCode }: Props) {
  const router = useRouter();

  async function handleLeave() {
    if (!confirm("Вы уверены, что хотите покинуть комнату?")) {
      return;
    }

    try {
      const playerId = localStorage.getItem("spy-player-id");

      if (playerId) {
        // 1. Получаем актуальные данные игрока перед выходом
        const { data: player } = await supabase
          .from("players")
          .select("id, room_id, is_host")
          .eq("id", playerId)
          .maybeSingle();

        if (player) {
          const roomId = player.room_id;

          // 2. Если уходит хост, нужно передать права другому
          if (player.is_host) {
            const { data: others } = await supabase
              .from("players")
              .select("id, mode")
              .eq("room_id", roomId)
              .neq("id", playerId);

            if (others && others.length > 0) {
              // Ищем преемника: сначала среди игроков, потом среди зрителей
              const nextHost = others.find((p) => p.mode === "player") || others[0];

              // Назначаем нового хоста
              await supabase
                .from("players")
                .update({ is_host: true })
                .eq("id", nextHost.id);
            }
          }

          // 3. Удаляем игрока из комнаты
          await supabase.from("players").delete().eq("id", playerId);

          // 4. Проверяем, не осталась ли комната пустой
          const { count } = await supabase
            .from("players")
            .select("*", { count: "exact", head: true })
            .eq("room_id", roomId);

          if (count === 0) {
            // Если в комнате никого нет, удаляем саму комнату
            await supabase.from("rooms").delete().eq("id", roomId);
          }
        }
      }
    } catch (error) {
      console.error("Ошибка при выходе из комнаты:", error);
    } finally {
      // 5. Очищаем локальные данные и возвращаемся на главную
      localStorage.removeItem("spy-player");
      localStorage.removeItem("spy-player-id");
      router.push("/");
    }
  }

  return (
    <button onClick={handleLeave} className={className}>
      Покинуть комнату
    </button>
  );
}
