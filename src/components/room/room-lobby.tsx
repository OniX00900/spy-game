"use client";

import {
  useEffect,
  useState,
} from "react";

import { PlayerList } from "./player-list";
import { LeaveRoomButton } from "./leave-room-button";

import { StartGameButton } from "@/components/game/start-game-button";
import { supabase } from "@/lib/supabase";
import { useRoomPlayers } from "@/hooks/useRoomPlayers";

interface RoomLobbyProps {
  roomCode: string;
}

export function RoomLobby({
  roomCode,
}: RoomLobbyProps) {
  const [isHost, setIsHost] =
    useState(false);
    const [currentMode, setCurrentMode] =
    useState<
      "player" | "spectator"
    >("player");
  const [spyCount, setSpyCount] =
    useState(1);
    const [wordPack, setWordPack] =
  useState("default");

  const [spiesKnowEachOther, setSpiesKnowEachOther] =
    useState(false);
  const [revealRoleOnDeath, setRevealRoleOnDeath] =
    useState(false);
  const [revealVotes, setRevealVotes] = useState(false);
  const [betaSpyGuess, setBetaSpyGuess] = useState(false);
  const [customWords, setCustomWords] = useState("");

  const [playerId, setPlayerId] =
  useState("");
  const players =
  useRoomPlayers(
    roomCode
  );
  const playerCount =
  players.filter(
    (player) =>
      player.mode ===
      "player"
  ).length;

const spectatorCount =
  players.filter(
    (player) =>
      player.mode ===
      "spectator"
  ).length;

  useEffect(() => {
    const player =
      JSON.parse(
        localStorage.getItem(
          "spy-player"
        ) || "{}"
      );

      setPlayerId(
        player.id ?? ""
      );

    setIsHost(
      player.is_host === true
    );

    setCurrentMode(
      player.mode ?? "player"
    );

    async function loadRoom() {
      const { data } =
        await supabase
          .from("rooms")
          .select(
            "spy_count, word_pack, spies_know_each_other, reveal_role_on_death, reveal_votes, beta_spy_guess, custom_words"
          )
          .eq("code", roomCode)
          .single();
    
      if (data) {
        setSpyCount(
          data.spy_count ?? 1
        );
    
        setWordPack(
          data.word_pack ??
            "default"
        );

        setSpiesKnowEachOther(
          data.spies_know_each_other ?? false
        );

        setRevealRoleOnDeath(
          data.reveal_role_on_death ?? false
        );

        setRevealVotes(
          data.reveal_votes ?? false
        );

        setBetaSpyGuess(
          data.beta_spy_guess ?? false
        );

        setCustomWords(
          data.custom_words ?? ""
        );
      }
    }
    
    loadRoom();
    
    const interval =
      setInterval(
        loadRoom,
        2000
      );
    
    return () => {
      clearInterval(
        interval
      );
    };
  }, [roomCode]);

  return (
    <div className="space-y-6">

      <div className="rounded-lg border p-4">
        <h2 className="text-xl font-semibold">
          Код комнаты
        </h2>

        <div className="mt-2 flex items-center justify-between">

          <span className="text-2xl font-bold">
            {roomCode}
          </span>

          <div className="flex gap-2">

            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  roomCode
                )
              }
              className="rounded-lg border px-4 py-2"
            >
              Копировать
            </button>

            <LeaveRoomButton />

          </div>

        </div>
      </div>

      <div className="rounded-lg border p-4">

<div className="mb-3 flex items-center justify-between">

<h2 className="text-xl font-semibold">
  Игроки ({playerCount})
</h2>

  {currentMode ===
    "spectator" && (
      <button
      onClick={async () => {
    
        await supabase
          .from("players")
          .update({
            mode: "player",
          })
          .eq(
            "id",
            playerId
          );
    
        setCurrentMode(
          "player"
        );
    
      }}
      className="rounded border px-3 py-1 text-sm"
    >
      Стать игроком
    </button>
  )}

</div>

<div className="space-y-2">

  <PlayerList
    mode="player"
    roomCode={roomCode}
  />

</div>

</div>

      <div className="rounded-lg border p-4">

      <div className="mb-3 flex items-center justify-between">

      <h2 className="text-xl font-semibold">
  Зрители ({spectatorCount})
</h2>

{currentMode ===
  "player" && (
    <button
    onClick={async () => {
  
      await supabase
        .from("players")
        .update({
          mode: "spectator",
        })
        .eq(
          "id",
          playerId
        );
  
      setCurrentMode(
        "spectator"
      );
  
    }}
    className="rounded border px-3 py-1 text-sm"
  >
    Стать зрителем
  </button>
)}

</div>

        <div className="space-y-2">

          <PlayerList
            mode="spectator"
            roomCode={roomCode}
          />

        </div>

      </div>

      <div className="rounded-lg border p-4 space-y-3">

        <p className="text-sm text-gray-500">
          Для начала игры требуется минимум 3 игрока.
        </p>

        <div className="space-y-2">

        <div className="space-y-3 py-2">
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox"
              checked={spiesKnowEachOther}
              disabled={!isHost}
              onChange={async (e) => {
                const val = e.target.checked;
                setSpiesKnowEachOther(val);
                await supabase
                  .from("rooms")
                  .update({
                    spies_know_each_other: val,
                  })
                  .eq("code", roomCode);
              }}
              className="rounded border-gray-300"
            />
            Шпионы знают друг друга
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox"
              checked={revealRoleOnDeath}
              disabled={!isHost}
              onChange={async (e) => {
                const val = e.target.checked;
                setRevealRoleOnDeath(val);
                await supabase
                  .from("rooms")
                  .update({
                    reveal_role_on_death: val,
                  })
                  .eq("code", roomCode);
              }}
              className="rounded border-gray-300"
            />
            Показывать роль выбывшего игрока
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox"
              checked={revealVotes}
              disabled={!isHost}
              onChange={async (e) => {
                const val = e.target.checked;
                setRevealVotes(val);
                await supabase
                  .from("rooms")
                  .update({
                    reveal_votes: val,
                  })
                  .eq("code", roomCode);
              }}
              className="rounded border-gray-300"
            />
            Показывать кто за кого голосовал
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox"
              checked={betaSpyGuess}
              disabled={!isHost}
              onChange={async (e) => {
                const val = e.target.checked;
                setBetaSpyGuess(val);
                await supabase
                  .from("rooms")
                  .update({
                    beta_spy_guess: val,
                  })
                  .eq("code", roomCode);
              }}
              className="rounded border-gray-300"
            />
            Автоматическая проверка контратаки (BETA)
          </label>
        </div>

        <div className="space-y-2">

<label className="block text-sm">
  Набор слов
</label>

{isHost ? (
  <select
    value={wordPack}
    onChange={async (e) => {
      const value =
        e.target.value;

      setWordPack(
        value
      );

      await supabase
        .from("rooms")
        .update({
          word_pack:
            value,
        })
        .eq(
          "code",
          roomCode
        );
    }}
    className="w-full rounded border p-2"
  >
    <option value="default">
      По умолчанию
    </option>

    <option value="dota2">
      Герои DOTA 2
    </option>

    <option value="custom">
      Пользовательский
    </option>

  </select>
) : (
  <div className="rounded border p-2">

    {wordPack ===
    "default"
      ? "По умолчанию"
      : wordPack ===
          "dota2"
        ? "Герои DOTA 2"
        : "Пользовательский"}
    </div>
  )
}

{wordPack === "custom" && (
  <div className="space-y-2">
    <label className="block text-sm font-medium">
      Список слов (каждое с новой строки)
    </label>
    <textarea
      value={customWords}
      disabled={!isHost}
      placeholder="Введите слова..."
      onChange={async (e) => {
        const val = e.target.value;
        setCustomWords(val);
        await supabase
          .from("rooms")
          .update({
            custom_words: val,
          })
          .eq("code", roomCode);
      }}
      className="w-full min-h-[120px] rounded border p-2 text-sm font-mono"
    />
    {isHost && (
      <p className="text-[10px] text-gray-400">
        Слова сохраняются автоматически
      </p>
    )}
  </div>
)}
<div className="mt-4 text-sm">
  Количество шпионов:{" "}
  <span className="font-semibold">
    {spyCount}
  </span>
</div>

{isHost && (
  <input // Этот input для spyCount
    type="number"
    min={1} // Минимум 1 шпион
    value={spyCount} // Контролируемый компонент
    onChange={async (e) => {
      const value =
        Number(
          e.target.value
        );

      setSpyCount(
        value
      );

      await supabase
        .from("rooms")
        .update({
          spy_count: value,
        })
        .eq(
          "code",
          roomCode
        );
    }}
    className="w-full rounded border p-2"
  />
)}

        {isHost ? (
          <StartGameButton
            roomCode={roomCode}
          />
        ) : (
          <div className="text-center text-sm text-gray-500">
            Только хост может начать игру
          </div>
        )}

      </div>
    </div>
  </div>
</div>
  );
}