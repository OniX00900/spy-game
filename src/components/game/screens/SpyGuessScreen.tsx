"use client";

export function SpyGuessScreen() {
  return (
    <div className="space-y-6 py-10">

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">

        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Контратака шпиона
        </h1>

        <input
          placeholder="Введите слово"
          className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-slate-500 outline-none transition-all text-lg"
        />

        <button className="w-full bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 py-3 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm">
          Ответить
        </button>

      </div>

    </div>
  );
}