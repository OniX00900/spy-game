"use client";

import { useGame } from "../providers/game-provider";
import { LobbyScreen } from "./LobbyScreen";
import { PlayingScreen } from "./PlayingScreen";
import { VotingScreen } from "./VotingScreen";
import { FinishedScreen } from "./FinishedScreen";
import { ResultsScreen } from "./ResultsScreen";

export function GameScreen() {
  const { room } = useGame();

  if (!room) return null;

  // Переключатель экранов на основе состояния комнаты
  switch (room.state) {
    case "lobby":
      return <LobbyScreen />;
    case "playing":
      return <PlayingScreen roomCode={room.code} />;
    case "voting":
      return <VotingScreen roomCode={room.code} />;
    case "finished":
      return <FinishedScreen roomCode={room.code} />;
    case "results":
      return <ResultsScreen roomCode={room.code} />;
    default:
      // ПРИЧИНА БАГА: Если состояние было "results", но оно не было описано выше,
      // выполнение доходило сюда и возвращало лобби.
      return <LobbyScreen />;
  }
}