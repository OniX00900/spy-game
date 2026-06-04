import { Room } from "@/types/game";

const ROOM_KEY = "spy-room";

export function saveRoom(room: Room) {
  localStorage.setItem(
    ROOM_KEY,
    JSON.stringify(room)
  );
}

export function loadRoom(): Room | null {
  const data =
    localStorage.getItem(ROOM_KEY);

  if (!data) return null;

  return JSON.parse(data);
}