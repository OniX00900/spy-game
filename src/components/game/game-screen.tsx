"use client";

import { useEffect, useState } from "react";

import { RoleScreen } from "./role-screen";

interface GameData {
  role: "civilian" | "spy";
  word?: string;
}

export function GameScreen() {
  const [game, setGame] =
    useState<GameData | null>(null);

  useEffect(() => {
    const data =
      localStorage.getItem("spy-current-game");

    if (!data) return;

    setGame(JSON.parse(data));
  }, []);

  if (!game) {
    return null;
  }

  return (
    <RoleScreen
      role={game.role}
      word={game.word}
    />
  );
}