"use client";

import { useGame } from "../providers/game-provider";

export function FinishedScreen() {
  const { setRoomState } =
    useGame();

  return (
    <div className="space-y-6 py-10">

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center space-y-6 shadow-sm">

        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Игра окончена
        </h1>

        <p className="text-lg text-slate-500 dark:text-slate-400">
          Победа мирных жителей
        </p>

        <button
          onClick={() =>
            setRoomState("lobby")
          }
          className="w-full bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 py-3 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm"
        >
          Новая игра
        </button>

      </div>

    </div>
  );
}