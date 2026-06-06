"use client";

import { startGame } from "@/lib/startGame";
import { useRoomPlayers } from "@/hooks/useRoomPlayers";

interface Props {
  roomCode: string;
}

export function StartGameButton({
  roomCode,
}: Props) {
  const players = useRoomPlayers(roomCode);
  
  // Вычисляем количество активных игроков (не зрителей)
  const playerCount = players.filter(
    (player) => player.mode === "player"
  ).length;

  async function handleStartGame() {
    await startGame(roomCode);
  }

  return (
    <button
      className="w-full bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 rounded-lg p-3 font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
      onClick={handleStartGame}
      disabled={playerCount < 3}
    >
      Начать игру
    </button>
  );
}