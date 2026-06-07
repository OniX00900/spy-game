"use client";

import { supabase } from "@/lib/supabase";

interface Props {
  roomCode: string;
}

export function VoteDecisionScreen({ roomCode }: Props) {
  // Функция обновления состояния комнаты в БД
  async function setRoomState(state: string) {
    await supabase
      .from("rooms")
      .update({ state })
      .eq("code", roomCode);
  }

  return (
    <div className="space-y-6 py-10">

      <header className="text-center">
        <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-slate-100 uppercase">
          SPY GAME
        </h1>
      </header>

      <main className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">

        <section className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Начать голосование?
          </h2>

          <p className="text-slate-600 dark:text-slate-400">
            Игрок предложил начать голосование.
          </p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setRoomState("voting")}
            className="rounded-lg p-3 bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 font-bold hover:opacity-90 transition-all shadow-sm active:scale-95"
          >
            Да
          </button>

          <button
            onClick={() => setRoomState("playing")}
            className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            Нет
          </button>
        </div>

        <button
          onClick={() => setRoomState("lobby")}
          className="w-full bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 py-3 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm"
        >
          Вернуться в лобби
        </button>
      </main>

    </div>
  );
}