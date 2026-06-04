"use client";

import { RoomState } from "@/types/game";

import { LobbyScreen } from "./screens/LobbyScreen";
import { RoleRevealScreen } from "./screens/RoleRevealScreen";
import { PlayingScreen } from "./screens/PlayingScreen";
import { VoteDecisionScreen } from "./screens/VoteDecisionScreen";
import { VotingScreen } from "./screens/VotingScreen";
import { SpyGuessScreen } from "./screens/SpyGuessScreen";
import { FinishedScreen } from "./screens/FinishedScreen";

interface Props {
  state: RoomState;
}

export function GameStateRouter({
  state,
}: Props) {
  switch (state) {
    case "lobby":
      return <LobbyScreen />;

    case "roleReveal":
      return <RoleRevealScreen />;

    case "playing":
      return <PlayingScreen />;

    case "voteDecision":
      return <VoteDecisionScreen />;

    case "voting":
      return <VotingScreen />;

    case "spyGuess":
      return <SpyGuessScreen />;

    case "finished":
      return <FinishedScreen />;

    default:
      return null;
  }
}