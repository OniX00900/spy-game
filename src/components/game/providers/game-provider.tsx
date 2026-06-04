"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Room } from "@/types/game";

import {
  loadRoom,
  saveRoom,
} from "@/lib/roomStorage";

import {
  createMockRoom,
} from "@/lib/createMockRoom";

interface GameContextValue {
  room: Room;

  updateRoom: (
    room: Room
  ) => void;

  setRoomState: (
    state: Room["state"]
  ) => void;
}
const GameContext =
  createContext<GameContextValue | null>(
    null
  );

export function GameProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [room, setRoom] =
    useState<Room>(
      createMockRoom()
    );

  useEffect(() => {
    const saved =
      loadRoom();

    if (saved) {
      setRoom(saved);
    }
  }, []);

  function updateRoom(
    nextRoom: Room
  ) {
    setRoom(nextRoom);
  
    saveRoom(nextRoom);
  }
  
  function setRoomState(
    state: Room["state"]
  ) {
    const nextRoom = {
      ...room,
      state,
    };
  
    updateRoom(nextRoom);
  }
  return (
    <GameContext.Provider
    value={{
      room,
      updateRoom,
      setRoomState,
    }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context =
    useContext(GameContext);

  if (!context) {
    throw new Error(
      "GameProvider missing"
    );
  }

  return context;
}