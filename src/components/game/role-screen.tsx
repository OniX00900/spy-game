"use client";

import { useState } from "react";

import { PlayerRole } from "@/types/game";

interface RoleScreenProps {
  role: PlayerRole;
  word?: string;
}

export function RoleScreen({
  role,
  word,
}: RoleScreenProps) {
  const [revealed, setRevealed] =
    useState(false);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">

      <h2 className="text-xl font-bold text-center text-slate-500 dark:text-slate-400 uppercase tracking-widest">
        Ваша роль
      </h2>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 py-4 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm"
        >
          Показать роль
        </button>
      ) : (
        <>
          <div className="text-center text-4xl font-black tracking-tighter text-slate-900 dark:text-slate-100">
            {role === "spy"
              ? "ШПИОН"
              : "МИРНЫЙ"}
          </div>

          <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 text-center text-lg font-medium">
            {role === "spy" 
              ? "Слово скрыто"
              : word}
          </div>

          <button
            onClick={() => setRevealed(false)}
            className="w-full border border-slate-200 dark:border-slate-800 p-3 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Скрыть роль
          </button>
        </>
      )}

    </div>
  );
}