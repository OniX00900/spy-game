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

    round: 1,

    currentTurnIndex: 0,

    secretWord: null,

    // Эти настройки теперь являются прямыми свойствами объекта Room,
    // чтобы соответствовать структуре базы данных.
    spy_count: 1,
    spies_know_each_other: true,
    reveal_role_on_death: true,
    reveal_votes: true,
    beta_spy_guess: true,
    word_pack: "custom", // wordPreset переименован в word_pack для соответствия БД
    custom_words: null,
    // Настройки deadPlayersSeeResults и customWords отсутствуют в БД,
    // поэтому они удалены из мока. Если они нужны, их следует добавить в схему БД.
  };
}