"use client";

import { useState } from "react";
import { createRoom } from "@/lib/createRoom";

export function JoinScreen() {
  const [nickname, setNickname] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!nickname) return;
    setIsJoining(true);
    setError(null);

    try {
      const { player } = await createRoom(nickname, "player");
      
      localStorage.setItem("spy-player-id", player.id);

      window.location.reload();
    } catch (err) {
      setError("Не удалось создать комнату");
      setIsJoining(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6 mt-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-yellow-600">Шпион</h1>
        <p className="text-gray-500 font-medium">Создание новой игры</p>
      </div>

      <div className="rounded-2xl border bg-white p-8 shadow-xl space-y-4">
        <div className="space-y-1">
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={nickname}
            autoComplete="name"
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Ваше имя"
            className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-yellow-500 focus:ring-0 transition-all text-center text-lg"
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}

        <button
          onClick={handleCreate}
          disabled={isJoining || !nickname}
          className="w-full bg-yellow-400 text-black py-5 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-500 disabled:bg-gray-100 disabled:text-gray-400 transition-all active:scale-95 shadow-lg"
        >
          {isJoining ? "Создание..." : "Создать игру"}
        </button>
      </div>
    </div>
  );
}