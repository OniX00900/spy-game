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

  return ( // This form will be rendered inside the global max-width container
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Вход в комнату
      </h2>

      <input
        value={nickname}
        onChange={(e) =>
          setNickname(e.target.value)
        }
        placeholder="Ваш никнейм"
        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-slate-500 outline-none transition-all text-base"
      />

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="radio"
            checked={mode === "player"}
            onChange={() =>
              setMode("player")
            }
            className="form-radio text-slate-700 dark:text-slate-300 focus:ring-slate-500"
          />
          Игрок
        </label>

        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="radio"
            checked={mode === "spectator"}
            onChange={() =>
              setMode("spectator")
            }
            className="form-radio text-slate-700 dark:text-slate-300 focus:ring-slate-500"
          />
          Зритель
        </label>
      </div>

      <button
        onClick={handleJoin}
        className="w-full rounded-lg p-3 bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 font-bold hover:opacity-90 transition-all shadow-sm"
      >
        Войти
      </button>

    </div>
  );
}