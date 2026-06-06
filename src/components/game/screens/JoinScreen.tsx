"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/lib/createRoom";

export function JoinScreen() {
  const router = useRouter();
  const [createNickname, setCreateNickname] = useState("");
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    if (!createNickname) return;
    setIsCreating(true);
    setError(null);

    try {
      const result = await createRoom(createNickname, "player");
      
      if (result) {
        localStorage.setItem("spy-player-id", result.player.id);
        localStorage.setItem("spy-player", JSON.stringify(result.player));
        router.push(`/room/${result.room.code}`);
      }
    } catch (err) {
      setError("Не удалось создать комнату");
      setIsCreating(false);
    }
  };

  const handleEnterRoomCode = () => {
    if (!joinRoomCode) {
      setError("Пожалуйста, введите код комнаты.");
      return;
    }
    router.push(`/room/${joinRoomCode.toUpperCase()}`);
  };


  return (
    <div className="space-y-6 py-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">Шпион</h1> {/* Already slate */}
        <p className="text-slate-500 dark:text-slate-400 font-medium">Создание новой игры</p> {/* Already slate */}
      </div>
      
      <>
        {/* Секция для создания комнаты */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-center text-slate-900 dark:text-slate-100">Создать новую комнату</h2>
          <div className="space-y-1">
            <input
              type="text"
              id="create-nickname"
              value={createNickname}
              onChange={(e) => setCreateNickname(e.target.value)}
              placeholder="Ваш никнейм"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-slate-500 outline-none transition-all text-center text-base"
            />
          </div>
          <button
            onClick={handleCreateRoom}
            disabled={isCreating || !createNickname}
            className="w-full bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
          >
            {isCreating ? "Создание..." : "Создать комнату"}
          </button>
        </div>

        {/* Секция для присоединения к комнате */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-center text-slate-900 dark:text-slate-100">Войти в комнату</h2>
          <div className="space-y-1">
            <input
              type="text"
              id="join-room-code"
              value={joinRoomCode}
              onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
              placeholder="Код комнаты"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-slate-500 outline-none transition-all text-center text-base font-mono"
            />
          </div>
          <button
            onClick={handleEnterRoomCode}
            disabled={!joinRoomCode}
            className="w-full bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
          >
            Войти
          </button>
        </div>
      </>

      {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>} {/* Error color kept */}
    </div>
  );
}
