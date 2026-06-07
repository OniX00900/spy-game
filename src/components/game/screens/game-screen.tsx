"use client";

import { useGame } from "./providers/game-provider";
import { LobbyScreen } from "./screens/LobbyScreen";
import { PlayingScreen } from "./screens/PlayingScreen";
import { VotingScreen } from "./screens/VotingScreen";
import { FinishedScreen } from "./screens/FinishedScreen";
import { ResultsScreen } from "./screens/ResultsScreen";

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
      return <VotingScreen />;
    case "finished":
      return <FinishedScreen />;
    case "results":
      return <ResultsScreen />;
    default:
      // ПРИЧИНА БАГА: Если состояние было "results", но оно не было описано выше,
      // выполнение доходило сюда и возвращало лобби.
      return <LobbyScreen />;
  }
}