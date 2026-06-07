"use client";

import { supabase } from "@/lib/supabase";

interface Props {
  roomCode: string;
}

export function ResultsScreen({ roomCode }: Props) {

  return (
    <div className="space-y-6 py-10">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center space-y-6 shadow-sm">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Результаты игры
        </h1>

        <button
          onClick={async () => {
            await supabase
              .from("rooms")
              .update({ state: "lobby" })
              .eq("code", roomCode);
          }}
          className="w-full bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 py-3 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm"
        >
          Вернуться в лобби
        </button>
      </div>
    </div>
  );
}