"use client";

import {
  useEffect,
  useState,
} from "react";

import { PlayerList } from "./player-list";
import { LeaveRoomButton } from "./leave-room-button";

import { StartGameButton } from "@/components/game/start-game-button";

interface RoomLobbyProps {
  roomCode: string;
}

export function RoomLobby({
  roomCode,
}: RoomLobbyProps) {
  const [isHost, setIsHost] =
    useState(false);

  useEffect(() => {
    const player =
      JSON.parse(
        localStorage.getItem(
          "spy-player"
        ) || "{}"
      );

    setIsHost(
      player.is_host === true
    );
  }, []);

  return (
    <div className="space-y-6">

      <div className="rounded-lg border p-4">
        <h2 className="text-xl font-semibold">
          Код комнаты
        </h2>

        <div className="mt-2 flex items-center justify-between">

          <span className="text-2xl font-bold">
            {roomCode}
          </span>

          <div className="flex gap-2">

            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  roomCode
                )
              }
              className="rounded-lg border px-4 py-2"
            >
              Копировать
            </button>

            <LeaveRoomButton />

          </div>

        </div>
      </div>

      <div className="rounded-lg border p-4">

        <h2 className="text-xl font-semibold mb-3">
          Игроки
        </h2>

        <div className="space-y-2">

          <PlayerList
            mode="player"
            roomCode={roomCode}
          />

        </div>

      </div>

      <div className="rounded-lg border p-4">

        <h2 className="text-xl font-semibold mb-3">
          Зрители
        </h2>

        <div className="space-y-2">

          <PlayerList
            mode="spectator"
            roomCode={roomCode}
          />

        </div>

      </div>

      <div className="rounded-lg border p-4 space-y-3">

        <p className="text-sm text-gray-500">
          Для начала игры требуется минимум 3 игрока.
        </p>

        {isHost ? (
          <StartGameButton
            roomCode={roomCode}
          />
        ) : (
          <div className="text-center text-sm text-gray-500">
            Только хост может начать игру
          </div>
        )}

      </div>

    </div>
  );
}