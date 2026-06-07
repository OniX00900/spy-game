"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRoomPlayers } from "@/hooks/useRoomPlayers";

interface Props {
  roomCode: string;
}

export function VotingScreen({ roomCode }: Props) {
  const players = useRoomPlayers(roomCode);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Универсальная функция для смены состояния комнаты
  async function setRoomState(state: string) {
    await supabase
      .from("rooms")
      .update({ state })
      .eq("code", roomCode);
  }

  // Получаем ID текущего игрока из локального хранилища
  const currentPlayerId = typeof window !== "undefined" ? localStorage.getItem("spy-player-id") : null;

  // Формируем список кандидатов: только игроки, исключая самого себя
  const gamePlayers = players
    .filter((p) => p.mode === "player")
    .sort((a, b) => (a.player_number ?? 0) - (b.player_number ?? 0));

  const candidates = gamePlayers.filter((p) => p.id !== currentPlayerId);

  // Проверяем, голосовал ли уже этот игрок (чтобы заблокировать кнопку)
  useEffect(() => {
    const me = players.find(p => p.id === currentPlayerId);
    if (me?.voted_for) {
      setHasVoted(true);
      setSelectedPlayerId(me.voted_for);
    }
  }, [players, currentPlayerId]);

  async function handleConfirmVote() {
    // Защита от голосования за себя и повторных отправок
    if (!selectedPlayerId || !currentPlayerId || isSubmitting || hasVoted || selectedPlayerId === currentPlayerId) return;
    
    setIsSubmitting(true);
    
    // 1. Сохраняем голос в таблицу игроков
    const { error: updateError } = await supabase
      .from("players")
      .update({ voted_for: selectedPlayerId })
      .eq("id", currentPlayerId);

    if (updateError) {
      console.error("Error saving vote:", updateError.message || updateError);
      setIsSubmitting(false);
      return;
    }

    // 2. Проверяем завершение голосования именно в этой комнате
    const roomId = players.find(p => p.id === currentPlayerId)?.room_id;
    if (!roomId) {
      setIsSubmitting(false);
      return;
    }

    const { data: allPlayers } = await supabase
      .from("players")
      .select("id, voted_for")
      .eq("room_id", roomId)
      .eq("mode", "player");

    const total = allPlayers?.length || 0;
    const voted = allPlayers?.filter(p => p.voted_for).length || 0;

    if (total > 0 && voted === total) {
      await setRoomState("results");
    }

    setIsSubmitting(false);
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <header className="text-center py-4">
        <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-slate-100">
          SPY GAME
        </h1>
      </header>

      <main className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-center text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Голосование
        </h2>

        {/* Список игроков */}
        <div className="space-y-2">
          {candidates.map((player) => (
            <button
              key={player.id}
              disabled={hasVoted || isSubmitting}
              onClick={() => setSelectedPlayerId(player.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all flex justify-between items-center ${
                selectedPlayerId === player.id
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20 ring-1 ring-green-500"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 hover:border-slate-400 dark:hover:border-slate-600"
              }`}
            >
              <span className="font-medium">
                Игрок №{player.player_number} — {player.nickname}
              </span>
              {selectedPlayerId === player.id && (
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-3 pt-4">
          <button
            onClick={handleConfirmVote}
            disabled={!selectedPlayerId || isSubmitting || hasVoted}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
          >
            {hasVoted ? "Голос принят" : isSubmitting ? "Загрузка..." : "Подтвердить голос"}
          </button>

          <button
            onClick={() => setRoomState("results")}
            className="w-full bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 py-3 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm"
          >
            Показать результаты
          </button>
        </div>

        <button
          onClick={() => setRoomState("lobby")}
          className="w-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-3 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
        >
          Вернуться в лобби
        </button>
      </main>
    </div>
  );
}