"use client";

import { supabase } from "@/lib/supabase";

interface Props {
  roomCode: string;
}

export function VotingScreen({ roomCode }: Props) {
  // Логика возврата в лобби: обновляем состояние комнаты в БД
  async function handleBackToLobby() {
    await supabase
      .from("rooms")
      .update({ state: "lobby" })
      .eq("code", roomCode);
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      {/* Header проекта */}
      <header className="text-center py-4">
        <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-slate-100">
          SPY GAME
        </h1>
      </header>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-center text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Голосование
        </h2>

        <button
          onClick={handleBackToLobby}
          className="w-full bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 py-3 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm"
        >
          Вернуться в лобби
        </button>
      </div>
    </div>
  );
}