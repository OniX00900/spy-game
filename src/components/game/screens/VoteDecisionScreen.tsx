"use client";

import { useGame } from "../providers/game-provider";

export function VoteDecisionScreen() {
  const { setRoomState } =
    useGame();

  return (
    <div className="space-y-6 py-10">

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">

        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Начать голосование?
        </h1>

        <p className="text-slate-600 dark:text-slate-400">
          Игрок предложил начать голосование.
        </p>

        <div className="grid grid-cols-2 gap-4">

          <button
            onClick={() =>
              setRoomState("voting")
            }
            className="rounded-lg p-3 bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 font-bold hover:opacity-90 transition-all shadow-sm active:scale-95"
          >
            Да
          </button>

          <button
            onClick={() =>
              setRoomState("playing")
            }
            className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            Нет
          </button>

        </div>

      </div>

    </div>
  );
}