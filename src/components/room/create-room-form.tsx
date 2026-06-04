"use client";

import { useRouter } from "next/navigation";
import { createRoom } from "@/lib/createRoom";

export function CreateRoomForm() {
  const router = useRouter();

  async function handleCreateRoom() {
    const nicknameInput =
      document.getElementById(
        "host-nickname"
      ) as HTMLInputElement;

    const modeInput =
      document.querySelector(
        'input[name="host-mode"]:checked'
      ) as HTMLInputElement;

    const nickname =
      nicknameInput?.value.trim();

    const mode =
      modeInput?.value as
        | "player"
        | "spectator";

    if (!nickname) {
      alert("Введите никнейм");
      return;
    }

    const result =
      await createRoom(
        nickname,
        mode
      );

    if (!result) {
      alert(
        "Не удалось создать комнату"
      );
      return;
    }

    localStorage.setItem(
      "spy-player-id",
      result.player.id
    );

    localStorage.setItem(
      "spy-player",
      JSON.stringify(
        result.player
      )
    );

    router.push(
      `/room/${result.room.code}`
    );
  }

  return (
    <button
      onClick={handleCreateRoom}
      className="w-full rounded-lg border p-3 font-medium"
    >
      Создать комнату
    </button>
  );
}