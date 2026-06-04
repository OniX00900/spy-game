"use client";

export function SpyGuessScreen() {
  return (
    <div className="mx-auto max-w-xl p-6">

      <div className="rounded-lg border p-6 space-y-4">

        <h1 className="text-3xl font-bold">
          Контратака шпиона
        </h1>

        <input
          placeholder="Введите слово"
          className="w-full rounded-lg border p-3"
        />

        <button className="w-full rounded-lg border p-3">
          Ответить
        </button>

      </div>

    </div>
  );
}