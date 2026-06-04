"use client";

import { supabase } from "@/lib/supabase";
import {
  useEffect,
  useState,
} from "react";

import {
  getCurrentPlayer,
} from "@/lib/getCurrentPlayer";

import {
  getRoomById,
} from "@/lib/getRoomById";

interface Player {
  role: string;
  room_id: string;
  player_number: number;
  mode: string;
}

export function RoleRevealScreen() {
  const [revealed, setRevealed] =
    useState(false);

  const [role, setRole] =
    useState("");

  const [word, setWord] =
    useState("");

  const [playerNumber, setPlayerNumber] =
    useState<number | null>(null);

  const [isSpectator, setIsSpectator] =
    useState(false);

  useEffect(() => {
    async function loadData() {
      const playerId =
        localStorage.getItem(
          "spy-player-id"
        );

      if (!playerId) {
        return;
      }

      const player =
        await getCurrentPlayer(
          playerId
        ) as Player;

      if (!player) {
        return;
      }

      setRole(player.role ?? "");

      setPlayerNumber(
        player.player_number
      );

      setIsSpectator(
        player.mode === "spectator"
      );

      const room =
        await getRoomById(
          player.room_id
        );

      if (
        player.role === "civilian" ||
        player.mode === "spectator"
      ) {
        setWord(
          room?.secret_word ?? ""
        );
      }
    }

    loadData();
  }, []);

  return (
    <div className="mx-auto max-w-md p-6">
      <div className="rounded-lg border p-6 text-center space-y-6">

        <h1 className="text-3xl font-bold">
          {isSpectator ? "Обзор игры" : "Ваша роль"}
        </h1>

        {!revealed ? (
          <button
            onClick={() =>
              setRevealed(true)
            }
            className="w-full rounded-lg border p-4"
          >
            {isSpectator ? "Посмотреть информацию" : "Показать роль"}
          </button>
        ) : (
          <>
            <div className="space-y-4">

              <div className="text-4xl font-bold">
                {isSpectator 
                  ? "ВЫ ЗРИТЕЛЬ" 
                  : (role === "spy" ? "ШПИОН" : "МИРНЫЙ")}
              </div>

              {(role === "civilian" || isSpectator) && (
                <>
                  <div className="text-xl">
                    Слово:
                  </div>

                  <div className="text-3xl font-semibold">
                    {word}
                  </div>
                </>
              )}

              {!isSpectator && playerNumber && (
                <div className="text-xl font-semibold">
                  Игрок №
                  {playerNumber}
                </div>
              )}

            </div>

            <button
              onClick={async () => {
                const playerId =
                  localStorage.getItem(
                    "spy-player-id"
                  );

                if (!playerId) {
                  return;
                }

                const player =
                  await getCurrentPlayer(
                    playerId
                  ) as Player;

                if (!player) {
                  return;
                }

                const room =
                  await getRoomById(
                    player.room_id
                  );

                if (!room) {
                  return;
                }

                await supabase
                  .from("rooms")
                  .update({
                    state: "playing",
                  })
                  .eq("id", room.id);
              }}
              className="w-full rounded-lg border p-4"
            >
              Перейти к игре
            </button>

          </>
        )}

      </div>
    </div>
  );
}