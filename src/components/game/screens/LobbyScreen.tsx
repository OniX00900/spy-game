"use client";

import { useGame } from "../providers/game-provider";

export function LobbyScreen() {
  const {
    room,
    setRoomState,
  } = useGame();

  const players = room.players.filter(
    (player) => player.mode === "player"
  );

  const spectators = room.players.filter(
    (player) => player.mode === "spectator"
  );

  return (
    <div className="space-y-6">

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Комната {room.code}
        </h1>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Игроки ({players.length})
        </h2>

        <div className="space-y-2">
          {players.map((player) => (
            <div
              key={player.id}
              className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-slate-900 dark:text-slate-100"
            >
              {player.nickname}
              {player.isHost && " 👑"}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Зрители ({spectators.length})
        </h2>

        <div className="space-y-2">
          {spectators.map((player) => (
            <div
              key={player.id}
              className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-slate-900 dark:text-slate-100"
            >
              {player.nickname}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Настройки
        </h2>

        <div className="space-y-2 text-slate-600 dark:text-slate-400 font-medium">
          <div>
            Показывать роли:
            {" "}
            {room.reveal_role_on_death
              ? "Да"
              : "Нет"}
          </div>

          <div>
            Показывать голоса:
            {" "}
            {room.reveal_votes
              ? "Да"
              : "Нет"}
          </div>

          <div>
            Автоматическая проверка контратаки (BETA):
            {" "}
            {room.beta_spy_guess
              ? "Да"
              : "Нет"}
          </div>

          <div>
            Набор слов:
            {" "}
            {room.word_pack === "default"
              ? "По умолчанию"
              : room.word_pack === "dota2"
                ? "Герои DOTA 2"
                : "Пользовательский"}
          </div>

        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">

        <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Слова
        </h2>

        <textarea
          readOnly
          value={room.custom_words ?? ""}
          className="w-full min-h-40 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 outline-none transition-all"
        />

      </div>

      <button
  onClick={() =>
    setRoomState("playing")
  }
  className="w-full bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 py-4 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm"
>
  Начать игру
</button>

    </div>
  );
}