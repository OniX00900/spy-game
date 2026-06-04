"use client";

import { useGame } from "../providers/game-provider";

export function VotingScreen() {
  const { setRoomState } =
    useGame();

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">

      <h1 className="text-3xl font-bold">
        Голосование
      </h1>

      <div className="rounded-lg border p-4 cursor-pointer">
        Игорь
      </div>

      <div className="rounded-lg border p-4 cursor-pointer">
        Вася
      </div>

      <div className="rounded-lg border p-4 cursor-pointer">
        Петя
      </div>

      <button
        onClick={() =>
          setRoomState("finished")
        }
        className="w-full rounded-lg border p-4"
      >
        Подтвердить голос
      </button>

    </div>
  );
}