"use client";

import { useGame } from "../providers/game-provider";

export function FinishedScreen() {
  const { setRoomState } =
    useGame();

  return (
    <div className="mx-auto max-w-xl p-6">

      <div className="rounded-lg border p-6 text-center space-y-6 bg-white shadow-lg">

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
          className="w-full bg-yellow-400 text-black hover:bg-yellow-500 rounded-lg border-2 border-yellow-600 p-3 font-bold transition-all shadow-md"
        >
          Новая игра
        </button>

      </div>

    </div>
  );
}