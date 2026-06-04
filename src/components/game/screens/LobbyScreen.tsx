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
    <div className="mx-auto max-w-4xl space-y-6 p-6">

      <div className="rounded-lg border p-6">
        <h1 className="text-3xl font-bold">
          Комната {room.code}
        </h1>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-bold">
          Игроки ({players.length})
        </h2>

        <div className="space-y-2">
          {players.map((player) => (
            <div
              key={player.id}
              className="rounded border p-3"
            >
              {player.nickname}
              {player.isHost && " 👑"}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-bold">
          Зрители ({spectators.length})
        </h2>

        <div className="space-y-2">
          {spectators.map((player) => (
            <div
              key={player.id}
              className="rounded border p-3"
            >
              {player.nickname}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-bold">
          Настройки
        </h2>

        <div className="space-y-2">
          <div>
            Шпионов: {room.spy_count}
          </div>

          <div>
            Шпионы знают друг друга:
            {" "}
            {room.spies_know_each_other
              ? "Да"
              : "Нет"}
          </div>

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

      <div className="rounded-lg border p-6">

        <h2 className="mb-4 text-2xl font-bold">
          Слова
        </h2>

        <textarea
          readOnly
          value={""} // customWords не является полем в таблице 'rooms' БД
          className="w-full min-h-40 rounded border p-3"
        />

      </div>

      <button
  onClick={() =>
    setRoomState("roleReveal")
  }
  className="w-full rounded-lg border p-4 text-lg font-bold"
>
  Начать игру
</button>

    </div>
  );
}