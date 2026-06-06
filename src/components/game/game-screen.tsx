"use client";

import { useEffect, useState } from "react";
import { useGame } from "./providers/game-provider";
import { JoinScreen } from "./screens/JoinScreen";
import { LobbyScreen } from "./screens/LobbyScreen";
import { PlayingScreen } from "./screens/PlayingScreen";
import { VoteDecisionScreen } from "./screens/VoteDecisionScreen";
import { VotingScreen } from "./screens/VotingScreen";
import { SpyGuessScreen } from "./screens/SpyGuessScreen";
import { FinishedScreen } from "./screens/FinishedScreen";

export function GameScreen() {
  const { room } = useGame();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /// Защита от ошибок гидратации Next.js
  if (!mounted) {
  
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950" />;
  }

  // Если комнаты нет в контексте, показываем экран создания
  if (!room || !room.code || room.id === "1") { // "1" — это ID из мока
    return (
      
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <JoinScreen />
      </div>
    );
  }

  // Основной роутер экранов на основе состояния комнаты
  return (
    
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {(() => {
        switch (room.state) {
          case "lobby":
            return <LobbyScreen />;
          case "playing":
            return <PlayingScreen roomCode={room.code} />;
          case "voteDecision":
            return <VoteDecisionScreen />;
          case "voting":
            return <VotingScreen />;
          case "spyGuess":
            return <SpyGuessScreen />;
          case "finished":
            return <FinishedScreen />;
          default:
            return <LobbyScreen />;
        }
      })()}
    </div>
  );
}