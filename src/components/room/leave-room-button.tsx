"use client";

interface Props {
  className?: string;
}

export function LeaveRoomButton({ className }: Props) {
  function handleLeave() {
    localStorage.removeItem("spy-player");

    window.location.reload();
  }

  return (
    <button onClick={handleLeave} className={className}>
      Покинуть комнату
    </button>
  );
}