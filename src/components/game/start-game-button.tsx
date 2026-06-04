"use client";

import { startGame } from "@/lib/startGame";

interface Props {
  roomCode: string;
}

export function StartGameButton({
  roomCode,
}: Props) {
  async function handleStartGame() {
    await startGame(roomCode);
  }

  return (
    <button
      onClick={handleStartGame}
      className="w-full rounded-lg border p-3"
    >
      Начать игру
    </button>
  );
}