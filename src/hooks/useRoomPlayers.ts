"use client";

import { useEffect, useState } from "react";

import { getRoomPlayers } from "@/lib/getRoomPlayers";

export function useRoomPlayers(
  roomCode: string
) {
  const [players, setPlayers] =
    useState<any[]>([]);

  useEffect(() => {
    async function loadPlayers() {
      const data =
        await getRoomPlayers(
          roomCode
        );

      setPlayers(data);
    }

    loadPlayers();

    const interval =
      setInterval(
        loadPlayers,
        2000
      );

    return () => {
      clearInterval(interval);
    };
  }, [roomCode]);

  return players;
}