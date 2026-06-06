"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";
import { getCurrentPlayer } from "@/lib/getCurrentPlayer";
import { getRoomById } from "@/lib/getRoomById";
import { PlayerOrderList } from "@/components/game/player-order-list";
import { SpyAlliance } from "../spy-alliance";

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

  const [playerId, setPlayerId] =
    useState<string | null>(null);

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

      setPlayerId(playerId);

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
     <div className="space-y-6">

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Раунд {round}
        </h1>

        {playerNumber && (
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Игрок №
            {playerNumber}
          </p>
        )}

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Обсуждение идёт...
        </p>
        </div>

<PlayerOrderList
  roomCode={roomCode}
/>

      {!isSpectator ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
          <button
            onClick={() =>
              setShowRole(
                !showRole
              )
            }
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-3 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {showRole
              ? "Скрыть роль" // Text color will be inherited from parent
              : "Показать роль"} {/* Text color will be inherited from parent */}
          </button>

          {showRole && (
            <div className="space-y-3 text-center">

              <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                {role === "spy"
                  ? "ШПИОН"
                  : "МИРНЫЙ"}
              </div>

              {role !== "spy" && (
                <div className="text-xl text-slate-700 dark:text-slate-300">
                  Слово: {word}
                </div>
              )}

              {playerNumber && (
                <div className="text-xl font-semibold">
                  Игрок №
                  {playerNumber}
                </div>
              )}

              {playerId && (
                <SpyAlliance 
                  roomCode={roomCode} 
                  playerId={playerId} 
                  role={role} 
                  allPlayers={allPlayers} 
                />
              )}

            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-center text-slate-900 dark:text-slate-100">
            Панель зрителя
          </h2>
          <div className="text-center text-lg text-slate-700 dark:text-slate-300">
            Секретное слово: <span className="font-bold underline text-slate-900 dark:text-slate-100">{word}</span>
          </div>
          
          <div className="space-y-2 mt-4">
            <h3 className="font-semibold text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
              Роли игроков:
            </h3>
            <div className="grid gap-2">
              {allPlayers.map((p) => (
                <div 
                  key={p.id} 
                  className="flex justify-between items-center p-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                >
                  <span className="font-medium">
                    {p.nickname}
                    {p.is_host && " 👑"}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    p.role === 'spy' 
                      ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/30' 
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
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
          className="w-full rounded-lg p-3 bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 font-bold hover:opacity-90 transition-all shadow-sm"
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
    className="w-full rounded-lg p-3 bg-red-600 text-white dark:bg-red-400 dark:text-red-950 font-bold hover:opacity-90 transition-all shadow-sm"
  >
    Завершить игру
  </button>
)}

    </div>
  );
}