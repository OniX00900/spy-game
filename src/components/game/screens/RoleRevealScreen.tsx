"use client";

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
}

export function RoleRevealScreen() {
  const [revealed, setRevealed] =
    useState(false);

  const [role, setRole] =
    useState("");

  const [word, setWord] =
    useState("");

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

      setRole(player.role);

      const room =
        await getRoomById(
          player.room_id
        );

      if (
        player.role ===
        "civilian"
      ) {
        setWord(
          room?.secret_word ??
            ""
        );
      }
    }

    loadData();
  }, []);

  return (
    <div className="mx-auto max-w-md p-6">
      <div className="rounded-lg border p-6 text-center space-y-6">

        <h1 className="text-3xl font-bold">
          Ваша роль
        </h1>

        {!revealed ? (
          <button
            onClick={() =>
              setRevealed(true)
            }
            className="w-full rounded-lg border p-4"
          >
            Показать роль
          </button>
        ) : (
          <>
            <div className="space-y-4">

              <div className="text-4xl font-bold">
                {role === "spy"
                  ? "ШПИОН"
                  : "МИРНЫЙ"}
              </div>

              {role !== "spy" && (
                <>
                  <div className="text-xl">
                    Слово:
                  </div>

                  <div className="text-3xl font-semibold">
                    {word}
                  </div>
                </>
              )}

            </div>

            <button
              onClick={() =>
                setRevealed(false)
              }
              className="w-full rounded-lg border p-4"
            >
              Скрыть
            </button>

          </>
        )}

      </div>
    </div>
  );
}