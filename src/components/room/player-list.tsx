"use client";

import { useRoomPlayers } from "@/hooks/useRoomPlayers";

interface Player {
  id: string;
  nickname: string;
  mode: "player" | "spectator";
  is_host: boolean;
}

interface Props {
  mode: "player" | "spectator";
  roomCode: string;
}

export function PlayerList({
  mode,
  roomCode,
}: Props) {
  const players =
    useRoomPlayers(
      roomCode
    ) as Player[];

  const currentPlayerId =
    typeof window !== "undefined"
      ? localStorage.getItem(
          "spy-player-id"
        )
      : null;

      const filteredPlayers =
      players;

  if (
    filteredPlayers.length === 0
  ) {
    return (
      <div className="rounded border p-2">
        Пока никого нет
      </div>
    );
  }

  return (
    <>
      {filteredPlayers.map(
        (player) => {
          const isMe =
            player.id ===
            currentPlayerId;

          return (
            <div
              key={player.id}
              className="rounded border p-2"
            >
              {player.nickname}

              {isMe &&
                " (Вы)"}

              {player.is_host &&
                " 👑"}
            </div>
          );
        }
      )}
    </>
  );
}