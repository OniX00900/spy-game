"use client";

import { useState } from "react";
import { joinRoom } from "@/lib/joinRoom";

interface Props {
  roomCode: string;
}

export function JoinRoomForm({
  roomCode,
}: Props) {
  const [nickname, setNickname] =
    useState("");

  const [mode, setMode] =
    useState<"player" | "spectator">(
      "player"
    );

  async function handleJoin() {
    try {
      const result =
        await joinRoom(
          roomCode,
          nickname,
          mode
        );

      localStorage.setItem(
        "spy-player-id",
        result.player.id
      );

      localStorage.setItem(
        "spy-player",
        JSON.stringify(result.player)
      );

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert(
        "Не удалось войти в комнату"
      );
    }
  }

  return (
    <div className="rounded-lg border p-6 space-y-4">
      <h2 className="text-2xl font-bold">
        Вход в комнату
      </h2>

      <input
        value={nickname}
        onChange={(e) =>
          setNickname(e.target.value)
        }
        placeholder="Ваш никнейм"
        className="w-full rounded-lg border p-3"
      />

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={mode === "player"}
            onChange={() =>
              setMode("player")
            }
          />
          Игрок
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={mode === "spectator"}
            onChange={() =>
              setMode("spectator")
            }
          />
          Зритель
        </label>
      </div>

      <button
        onClick={handleJoin}
        className="w-full rounded-lg border p-3"
      >
        Войти
      </button>
    </div>
  );
}