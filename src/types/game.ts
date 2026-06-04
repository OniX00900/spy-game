export type RoomState =
  | "lobby"
  | "roleReveal"
  | "playing"
  | "voteDecision"
  | "voting"
  | "spyGuess"
  | "finished";

export type PlayerRole =
  | "civilian"
  | "spy";

export type PlayerMode =
  | "player"
  | "spectator";

export interface GameSettings {
  spiesCount: number;

  spiesKnowEachOther: boolean;

  revealRoleOnDeath: boolean;

  revealVotes: boolean;

  betaSpyGuess: boolean;

  deadPlayersSeeResults: boolean;

  customWords: string[];

  wordPreset: string;
}

export interface Player {
  id: string;

  nickname: string;

  role: PlayerRole;

  mode: PlayerMode;

  alive: boolean;

  connected: boolean;

  isHost: boolean;

  turnOrder: number;
}

export interface Vote {
  voterId: string;

  targetId: string;
}

export interface GameRound {
  roundNumber: number;

  activePlayerId: string | null;
}

export interface Room {
  id: string;

  code: string;

  state: RoomState;

  players: Player[];

  votes: Vote[];

  round: number;

  currentTurnIndex: number;

  secretWord: string | null;

  spy_count: number;
  word_pack: string;
  spies_know_each_other: boolean;
  reveal_role_on_death: boolean;
  reveal_votes: boolean;
  beta_spy_guess: boolean;
  settings: GameSettings;
}