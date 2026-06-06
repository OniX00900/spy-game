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
    players.filter(
      (player) =>
        player.mode === mode
    );

  if (
    filteredPlayers.length === 0
  ) {
    return (
      <div className="rounded-md border border-slate-200 dark:border-slate-800 p-2 text-slate-500 dark:text-slate-400 italic text-sm text-center">
        Пока никого нет
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredPlayers.map(
        (player) => {
          const isMe =
            player.id ===
            currentPlayerId;

          return (
            <div 
              key={player.id}
              className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 text-slate-900 dark:text-slate-100"
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
    </div>
  );
}