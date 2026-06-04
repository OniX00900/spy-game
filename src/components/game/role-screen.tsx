"use client";

import { useState } from "react";

import { PlayerRole } from "@/types/game";

interface RoleScreenProps {
  role: PlayerRole;
  word?: string;
}

export function RoleScreen({
  role,
  word,
}: RoleScreenProps) {
  const [revealed, setRevealed] =
    useState(false);

  return (
    <div className="mx-auto max-w-md rounded-lg border p-6 space-y-4">

      <h2 className="text-2xl font-bold text-center">
        Ваша роль
      </h2>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full rounded-lg border p-4"
        >
          Показать роль
        </button>
      ) : (
        <>
          <div className="text-center text-3xl font-bold">
            {role === "spy"
              ? "ШПИОН"
              : "МИРНЫЙ"}
          </div>

          <div className="rounded border p-4 text-center">
            {role === "spy"
              ? "Слово скрыто"
              : word}
          </div>

          <button
            onClick={() => setRevealed(false)}
            className="w-full rounded-lg border p-3"
          >
            Скрыть роль
          </button>
        </>
      )}

    </div>
  );
}