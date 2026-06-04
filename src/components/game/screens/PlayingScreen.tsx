"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";
import { getCurrentPlayer } from "@/lib/getCurrentPlayer";
import { getRoomById } from "@/lib/getRoomById";
import { PlayerOrderList } from "@/components/game/player-order-list";

interface Props {
  roomCode: string;
}

export function PlayingScreen({
  roomCode,
}: Props) {
  const [round, setRound] =
    useState(1);

  const [isHost, setIsHost] =
    useState(false);

  const [roomId, setRoomId] =
    useState("");

  const [showRole, setShowRole] =
    useState(false);

  const [role, setRole] =
    useState("");

  const [word, setWord] =
    useState("");

  const [playerNumber, setPlayerNumber] =
    useState<number | null>(
      null
    );

  useEffect(() => {
    async function loadRoom() {
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
        );

      if (!player) {
        return;
      }

      setIsHost(
        player.is_host === true
      );

      setRole(
        player.role ?? ""
      );

      setPlayerNumber(
        player.player_number ??
          null
      );

      const room =
        await getRoomById(
          player.room_id
        );

      if (!room) {
        return;
      }

      setRoomId(room.id);

      setRound(
        room.round ?? 1
      );

      if (
        player.role ===
        "civilian"
      ) {
        setWord(
          room.secret_word ?? ""
        );
      }
    }

    loadRoom();

    const interval =
      setInterval(
        loadRoom,
        2000
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, []);

  async function nextRound() {
    const newRound =
      round + 1;

    await supabase
      .from("rooms")
      .update({
        round: newRound,
      })
      .eq("id", roomId);

    setRound(newRound);
  }

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">

      <div className="rounded-lg border p-6">
        <h1 className="text-3xl font-bold">
          Раунд {round}
        </h1>

        {playerNumber && (
          <p className="mt-2 text-lg font-semibold">
            Игрок №
            {playerNumber}
          </p>
        )}

        <p className="mt-2">
          Обсуждение идёт...
        </p>
        </div>

<PlayerOrderList
  roomCode={roomCode}
/>

<div className="rounded-lg border p-6 space-y-4">

        <button
          onClick={() =>
            setShowRole(
              !showRole
            )
          }
          className="w-full rounded-lg border p-3"
        >
          {showRole
            ? "Скрыть роль"
            : "Показать роль"}
        </button>

        {showRole && (
          <div className="space-y-3 text-center">

            <div className="text-2xl font-bold">
              {role === "spy"
                ? "ШПИОН"
                : "МИРНЫЙ"}
            </div>

            {role !== "spy" && (
              <div className="text-xl">
                Слово: {word}
              </div>
            )}

            {playerNumber && (
              <div className="text-xl font-semibold">
                Игрок №
                {playerNumber}
              </div>
            )}

          </div>
        )}

      </div>

      {isHost && (
        <button
          onClick={nextRound}
          className="w-full rounded-lg border p-4"
        >
          Следующий раунд
        </button>
      )}

    </div>
  );
}