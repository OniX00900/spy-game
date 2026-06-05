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
    <div className="mx-auto max-w-md p-6 mt-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-yellow-600">Шпион</h1>
        <p className="text-gray-500 font-medium">Создание новой игры</p>
      </div>
      
      <>
        {/* Секция для создания комнаты */}
        <div className="rounded-2xl border bg-white p-8 shadow-xl space-y-4">
          <h2 className="text-xl font-semibold text-center text-gray-800">Создать новую комнату</h2>
          <div className="space-y-1">
            <input
              type="text"
              id="create-nickname"
              value={createNickname}
              onChange={(e) => setCreateNickname(e.target.value)}
              placeholder="Ваш никнейм"
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-yellow-500 focus:ring-0 transition-all text-center text-lg text-black"
            />
          </div>
          <button
            onClick={handleCreateRoom}
            disabled={isCreating || !createNickname}
            className="w-full bg-yellow-400 text-black py-5 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-500 disabled:bg-gray-100 disabled:text-gray-400 transition-all active:scale-95 shadow-lg"
          >
            {isCreating ? "Создание..." : "Создать комнату"}
          </button>
        </div>

        {/* Секция для присоединения к комнате */}
        <div className="rounded-2xl border bg-white p-8 shadow-xl space-y-4">
          <h2 className="text-xl font-semibold text-center text-gray-800">Войти в комнату</h2>
          <div className="space-y-1">
            <input
              type="text"
              id="join-room-code"
              value={joinRoomCode}
              onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
              placeholder="Код комнаты"
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-yellow-500 focus:ring-0 transition-all text-center text-lg text-black font-mono"
            />
          </div>
          <button
            onClick={handleEnterRoomCode}
            disabled={!joinRoomCode}
            className="w-full bg-orange-500 text-white py-5 rounded-xl font-black uppercase tracking-widest hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-400 transition-all active:scale-95 shadow-lg"
          >
            Войти
          </button>
        </div>
      </>

      {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}
    </div>
  );
}