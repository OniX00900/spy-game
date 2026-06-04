"use client";

import { useRoomPlayers } from "@/hooks/useRoomPlayers";

interface Player {
  id: string;
  nickname: string;
  player_number: number;
}

interface Props {
  roomCode: string;
}

export function PlayerOrderList({
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

  const sortedPlayers =
    [...players].sort(
      (a, b) =>
        a.player_number -
        b.player_number
    );

  return (
    <div className="rounded-lg border p-4">

      <h2 className="text-xl font-semibold mb-3">
        Порядок игроков
      </h2>

      <div className="space-y-2">

        {sortedPlayers.map(
          (player) => (
            <div
              key={player.id}
              className="rounded border p-2"
            >
              {player.player_number}.{" "}
              {player.nickname}

              {player.id ===
                currentPlayerId &&
                " (Вы)"}
            </div>
          )
        )}

      </div>

    </div>
  );
}