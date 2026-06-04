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

  const [allPlayers, setAllPlayers] =
    useState<any[]>([]);

  const [isSpectator, setIsSpectator] =
    useState(false);

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

      setIsSpectator(
        player.mode === "spectator"
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
        player.role === "civilian" ||
        player.mode === "spectator"
      ) {
        setWord(
          room.secret_word ?? ""
        );
      }

      const { data: playersData } =
        await supabase
          .from("players")
          .select("*")
          .eq("room_id", player.room_id)
          .eq("mode", "player");

      if (playersData) {
        setAllPlayers(playersData);
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

      {!isSpectator ? (
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
      ) : (
        <div className="rounded-lg border p-6 space-y-4 bg-gray-50/50">
          <h2 className="text-xl font-bold text-center">
            Панель зрителя
          </h2>
          <div className="text-center text-lg">
            Секретное слово: <span className="font-bold underline">{word}</span>
          </div>
          
          <div className="space-y-2 mt-4">
            <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wider">
              Роли игроков:
            </h3>
            <div className="grid gap-2">
              {allPlayers.map((p) => (
                <div 
                  key={p.id} 
                  className="flex justify-between items-center p-3 rounded border bg-white"
                >
                  <span className="font-medium">
                    {p.nickname}
                    {p.is_host && " 👑"}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    p.role === 'spy' 
                      ? 'bg-red-100 text-red-700 border border-red-200' 
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {p.role === 'spy' ? 'ШПИОН' : 'МИРНЫЙ'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isHost && (
        <button
          onClick={nextRound}
          className="w-full rounded-lg border p-4"
        >
          Следующий раунд
        </button>
      )}
      {isHost && (
  <button
    onClick={async () => {
      await supabase
        .from("players")
        .update({
          role: null,
          player_number: null,
        })
        .eq(
          "room_id",
          roomId
        );

      await supabase
        .from("rooms")
        .update({
          state: "lobby",
          round: 1,
          secret_word: null,
        })
        .eq(
          "id",
          roomId
        );
    }}
    className="w-full rounded-lg border p-4"
  >
    Завершить игру
  </button>
)}

    </div>
  );
}