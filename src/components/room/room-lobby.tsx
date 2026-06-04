"use client";

import {
  useEffect,
  useState,
} from "react";

import { PlayerList } from "./player-list";
import { LeaveRoomButton } from "./leave-room-button";

import { StartGameButton } from "@/components/game/start-game-button";
import { supabase } from "@/lib/supabase";

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

  const [playerId, setPlayerId] =
  useState("");

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
            "spy_count, word_pack"
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
    Игроки
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
  Зрители
</h2>

{currentMode ===
  "player" && (
  <button
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
)}

</div>
<div className="text-sm">
  Количество шпионов:{" "}
  <span className="font-semibold">
    {spyCount}
  </span>
</div>

{isHost && (
  <input
    type="number"
    min={0}
    value={spyCount}
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

</div>

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
  );
}