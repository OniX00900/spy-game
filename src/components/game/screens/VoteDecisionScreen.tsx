"use client";

import { useGame } from "../providers/game-provider";

export function VoteDecisionScreen() {
  const { setRoomState } =
    useGame();

  return (
    <div className="mx-auto max-w-xl p-6">

      <div className="rounded-lg border p-6 space-y-6">

        <h1 className="text-3xl font-bold">
          Начать голосование?
        </h1>

        <p>
          Игрок предложил начать голосование.
        </p>

        <div className="grid grid-cols-2 gap-4">

          <button
            onClick={() =>
              setRoomState("voting")
            }
            className="rounded-lg border p-4"
          >
            Да
          </button>

          <button
            onClick={() =>
              setRoomState("playing")
            }
            className="rounded-lg border p-4"
          >
            Нет
          </button>

        </div>

      </div>

    </div>
  );
}