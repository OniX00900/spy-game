"use client";

export function LeaveRoomButton() {
  function handleLeave() {
    localStorage.removeItem("spy-player");

    window.location.reload();
  }

  return (
    <button
      onClick={handleLeave}
      className="rounded-lg border px-4 py-2"
    >
      Покинуть комнату
    </button>
  );
}