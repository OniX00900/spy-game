"use client";

import { useGame } from "../providers/game-provider";

export function PlayingScreen() {
  const { setRoomState } =
    useGame();

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">

      <div className="rounded-lg border p-6">
        <h1 className="text-3xl font-bold">
          Раунд 1
        </h1>

        <p className="mt-2">
          Сейчас говорит Игорь
        </p>
      </div>

      <button
        onClick={() =>
          setRoomState(
            "voteDecision"
          )
        }
        className="w-full rounded-lg border p-4"
      >
        Предложить голосование
      </button>

    </div>
  );
}