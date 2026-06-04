import { Room } from "@/types/game";

export function createMockRoom(): Room {
  return {
    id: "1",

    code: "QPXGG9",

    state: "lobby",

    players: [
        {
          id: "1",
          nickname: "Игорь",
          role: "civilian",
          mode: "player",
          alive: true,
          connected: true,
          isHost: true,
          turnOrder: 1,
        },
      
        {
          id: "2",
          nickname: "Вася",
          role: "civilian",
          mode: "player",
          alive: true,
          connected: true,
          isHost: false,
          turnOrder: 2,
        },
      
        {
          id: "3",
          nickname: "Петя",
          role: "civilian",
          mode: "spectator",
          alive: true,
          connected: true,
          isHost: false,
          turnOrder: 0,
        },
      ],

    votes: [],

    round: {
      roundNumber: 1,
      activePlayerId: null,
    },

    currentTurnIndex: 0,

    secretWord: null,

    settings: {
      spiesCount: 1,

      spiesKnowEachOther: true,

      revealRoleOnDeath: true,

      revealVotes: true,

      betaSpyGuess: true,

      deadPlayersSeeResults: true,

      customWords: [],

      wordPreset: "custom",
    },
  };
}