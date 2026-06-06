"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Player {
  id: string;
  nickname: string;
  role: string;
  player_number: number;
  mode: "player" | "spectator";
}

interface Props {
  roomCode: string;
  playerId: string;
  role: string;
  allPlayers: Player[];
}

export function SpyAlliance({ roomCode, playerId, role, allPlayers }: Props) {
  const [knowEachOther, setKnowEachOther] = useState(false);

  useEffect(() => {
    async function checkRoomSettings() {
      const { data } = await supabase
        .from("rooms")
        .select("spies_know_each_other")
        .eq("code", roomCode)
        .single();
      if (data) setKnowEachOther(data.spies_know_each_other);
    }
    checkRoomSettings();
  }, [roomCode]);

  if (!knowEachOther || role !== "spy") return null;

  const otherSpies = allPlayers.filter(p => p.role === "spy" && p.id !== playerId);
  if (otherSpies.length === 0) return null;

  return (
    <div className="mt-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-4 shadow-sm text-left">
      <h3 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">Другие шпионы:</h3>
      <ul className="space-y-1">
        {otherSpies.map(spy => (
          <li key={spy.id} className="text-sm text-slate-900 dark:text-slate-100 font-medium">
            <span className="opacity-60">Игрок №{spy.player_number}</span> — {spy.nickname}
          </li>
        ))}
      </ul>
    </div>
  );
}