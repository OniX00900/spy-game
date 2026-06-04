"use client";

import { useEffect, useState } from "react";
import { PlayingScreen } from "@/components/game/screens/PlayingScreen";
import { JoinRoomForm } from "./join-room-form";
import { RoomLobby } from "./room-lobby";
import { VotingScreen } from "@/components/game/screens/VotingScreen";

import { RoleRevealScreen } from "@/components/game/screens/RoleRevealScreen";

import { supabase } from "@/lib/supabase";

interface Props {
  roomCode: string;
}

export function RoomPageClient({
  roomCode,
}: Props) {
  const [joined, setJoined] =
    useState(false);

  const [roomState, setRoomState] =
    useState("lobby");

  useEffect(() => {
    const player =
      localStorage.getItem(
        "spy-player"
      );

    setJoined(!!player);

    async function loadRoom() {
      const { data } =
        await supabase
          .from("rooms")
          .select("*")
          .eq("code", roomCode)
          .single();

      if (data) {
        setRoomState(
          data.state
        );
      }
    }

    loadRoom();
    const interval = setInterval(
      loadRoom,
      2000
    );

    const channel = supabase
      .channel(
        `room-state-${roomCode}`
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
        },
        async (payload) => {
          console.log(
            "ROOM CHANGED",
            payload
          );

          const { data } =
            await supabase
              .from("rooms")
              .select("*")
              .eq(
                "code",
                roomCode
              )
              .single();

          console.log(
            "NEW ROOM DATA",
            data
          );

          if (data) {
            setRoomState(
              data.state
            );
          }
        }
      );

    channel.subscribe();

    return () => {
      clearInterval(interval);
      channel.unsubscribe();
    };
  }, [roomCode]);

  if (!joined) {
    return (
      <JoinRoomForm
        roomCode={roomCode}
      />
    );
  }

  if (
    roomState ===
    "roleReveal"
  ) {
    return (
      <RoleRevealScreen />
    );
  }
  
  if (
    roomState ===
    "playing"
  ) {
    return (
      <PlayingScreen
  roomCode={roomCode}
/>
    );
  }
  
  if (
    roomState ===
    "voting"
  ) {
    return (
      <VotingScreen />
    );
  }
  
  return (
    <RoomLobby
      roomCode={roomCode}
    />
  );
}