"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleJoinRoom = () => {
    if (!joinRoomCode) {
      setError("Пожалуйста, введите код комнаты.");
      return;
    }
    setError(null);
    router.push(`/room/${joinRoomCode.toUpperCase()}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">

        <h1 className="text-center text-4xl font-bold">
          Spy Game
        </h1>

        <Link
          href="/create"
          className="block rounded-lg border p-4 text-center"
        >
          Создать комнату
        </Link>

        <input
          placeholder="Код комнаты"
          className="w-full rounded-lg border p-4"
          value={joinRoomCode}
          onChange={(e) => setJoinRoomCode(e.target.value)}
        />

        <button
          onClick={handleJoinRoom}
          disabled={!joinRoomCode}
          className="w-full rounded-lg border p-4 bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-400 transition-all"
        >
          Войти
        </button>

        {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}
      </div>
    </main>
  );
}
