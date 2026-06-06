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
    <main className="flex items-center justify-center py-12 min-h-[calc(100vh-65px)]">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Spy Game
        </h1>

        <Link
          href="/create"
          className="block rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-center font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Создать комнату
        </Link>
        <input
          placeholder="Код комнаты"
          className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-center font-mono text-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all"
          value={joinRoomCode}
          onChange={(e) => setJoinRoomCode(e.target.value)}
        />
        <button
          onClick={handleJoinRoom}
          disabled={!joinRoomCode}
          
          className="w-full rounded-lg p-3 bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm" // Adjusted disabled styles
        >
          Войти
        </button>
        {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}
      </div>
    </main>
  );
}
