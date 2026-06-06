"use client";

import { useGame } from "../providers/game-provider";

export function VotingScreen() {
  const { setRoomState } =
    useGame();

  return (
    <div className="space-y-6 py-10">

      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
        Голосование
      </h1>

      <div className="space-y-2">
        <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-slate-900 dark:text-slate-100 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
          Игорь
        </div>

        <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-slate-900 dark:text-slate-100 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
          Вася
        </div>

        <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-slate-900 dark:text-slate-100 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
          Петя
        </div>
      </div>

      <button
        onClick={() =>
          setRoomState("finished")
        }
        className="w-full bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 py-4 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm"
      >
        Подтвердить голос
      </button>

    </div>
  );
}