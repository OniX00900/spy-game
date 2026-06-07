"use client";

import { supabase } from "@/lib/supabase";
import { useRoomPlayers } from "@/hooks/useRoomPlayers";

interface Props {
  roomCode: string;
}

export function ResultsScreen({ roomCode }: Props) {
  const players = useRoomPlayers(roomCode);
  
  // Получаем ID текущего игрока и определяем, является ли он хостом
  const currentPlayerId = typeof window !== "undefined" ? localStorage.getItem("spy-player-id") : null;
  const me = players.find(p => p.id === currentPlayerId);
  const isHost = me?.is_host === true;

  const gamePlayers = players.filter(p => p.mode === "player");

  // Создаем карту для быстрого поиска ника по ID
  const nicknameMap = new Map(players.map(p => [p.id, p.nickname]));

  // Подсчет голосов для сводки
  const voteCounts = gamePlayers.reduce((acc, player) => {
    if (player.voted_for) {
      acc[player.voted_for] = (acc[player.voted_for] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Сортируем игроков по количеству голосов (от большего к меньшему)
  const sortedSummary = [...gamePlayers].sort((a, b) => {
    return (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0);
  });

  return (
    <div className="max-w-md mx-auto space-y-6 py-10">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-8 shadow-sm">
        <section className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Результаты голосования
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Все игроки сделали свой выбор</p>
        </section>

        {/* Детализация голосов */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Кто за кого:</h2>
          <div className="space-y-2">
            {gamePlayers.map(player => (
              <div key={player.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-300">{player.nickname}</span>
                <span className="text-slate-400">→</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {nicknameMap.get(player.voted_for) || "Не голосовал"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Сводная таблица */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Итого голосов:</h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-b border-slate-100 dark:border-slate-800">
            {sortedSummary.map(player => {
              const count = voteCounts[player.id] || 0;
              return (
                <div key={player.id} className="flex justify-between py-3 px-1">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    {player.nickname}
                  </span>
                  <span className={`font-black ${count > 0 ? 'text-red-500' : 'text-slate-300'}`}>
                    {count} {count === 1 ? 'голос' : (count > 1 && count < 5) ? 'голоса' : 'голосов'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {isHost ? (
          <button
            onClick={async () => {
              // Дополнительная защита: проверяем статус хоста прямо в обработчике
              if (!me?.is_host) return;

              // Сбрасываем голоса всех игроков в этой комнате
              const roomId = gamePlayers[0]?.room_id;
              if (roomId) {
                await supabase
                  .from("players")
                  .update({ voted_for: null })
                  .eq("room_id", roomId);
              }

              await supabase
                .from("rooms")
                .update({ state: "lobby" })
                .eq("code", roomCode);
            }}
            className="w-full bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 py-3 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm"
          >
            Вернуться в лобби
          </button>
        ) : (
          <div className="w-full text-center py-4 text-slate-500 dark:text-slate-400 italic text-sm border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
            Ожидание действий хоста...
          </div>
        )}
      </div>
    </div>
  );
}