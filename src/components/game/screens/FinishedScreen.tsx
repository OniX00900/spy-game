"use client";

import { useGame } from "../providers/game-provider";

export function FinishedScreen() {
  const { setRoomState } =
    useGame();

  return (
    <div className="mx-auto max-w-xl p-6">

      <div className="rounded-lg border p-6 text-center space-y-6">

        <h1 className="text-4xl font-bold">
          Игра окончена
        </h1>

        <p>
          Победа мирных жителей
        </p>

        <button
          onClick={() =>
            setRoomState("lobby")
          }
          className="w-full rounded-lg border p-3"
        >
          Новая игра
        </button>

      </div>

    </div>
  );
}