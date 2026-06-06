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
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">

      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
        Порядок игроков
      </h2>

      <div className="space-y-2">

        {sortedPlayers.map(
          (player) => (
            <div
              key={player.id}
              className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 text-slate-900 dark:text-slate-100"
            >
              <span className="font-medium">{player.player_number}.</span>{" "}
              {player.nickname}

              {player.id ===
                currentPlayerId && (
                  <span className="ml-1 text-slate-500 dark:text-slate-400 font-normal italic text-sm">
                    (Вы)
                  </span>
                )}
            </div>
          )
        )}

      </div>

    </div>
  );
}