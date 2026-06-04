"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";
import { getCurrentPlayer } from "@/lib/getCurrentPlayer";
import { getRoomById } from "@/lib/getRoomById";

export function PlayingScreen() {
  const [round, setRound] =
    useState(1);

  const [isHost, setIsHost] =
    useState(false);

  const [roomId, setRoomId] =
    useState("");

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
      if (round >= 3) {
        await supabase
          .from("rooms")
          .update({
            state: "voting",
          })
          .eq("id", roomId);
    
        return;
      }
    
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

        <p className="mt-2">
          Обсуждение идёт...
        </p>
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