"use client";

import { useEffect, useState } from "react";
import { PlayingScreen } from "@/components/game/screens/PlayingScreen";
import { JoinRoomForm } from "./join-room-form";
import { RoomLobby } from "./room-lobby";
import { VotingScreen } from "@/components/game/screens/VotingScreen";

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

  const [playerRole, setPlayerRole] =
    useState<string | null>(null);

  const [playerMode, setPlayerMode] =
    useState<string>("player");

  useEffect(() => {
    async function verifyMembership() {
      const storedPlayerId = localStorage.getItem("spy-player-id");

      if (!storedPlayerId) {
        setJoined(false);
        return;
      }

      try {
        // Сначала получаем ID комнаты по коду
        const { data: roomData } = await supabase
          .from("rooms")
          .select("id, state")
          .eq("code", roomCode)
          .single();

        if (!roomData) {
          setJoined(false);
          return;
        }

        setRoomState(roomData.state);

        // Проверяем, существует ли игрок с таким ID в этой комнате
        const { data: playerData } = await supabase
          .from("players")
          .select("id, role, mode")
          .eq("id", storedPlayerId)
          .eq("room_id", roomData.id)
          .single();

        setJoined(!!playerData);
        if (playerData) {
          setPlayerRole(playerData.role);
          setPlayerMode(playerData.mode);
        }
      } catch (err) {
        setJoined(false);
      }
    }

    verifyMembership();

    async function loadRoom() {
      const storedPlayerId = localStorage.getItem("spy-player-id");

      const { data: roomData } =
        await supabase
          .from("rooms")
          .select("*")
          .eq("code", roomCode)
          .single();

      if (roomData) {
        setRoomState(roomData.state);

        // Обновляем данные текущего игрока, чтобы поймать момент назначения роли
        if (storedPlayerId) {
          const { data: playerData } = await supabase
            .from("players")
            .select("role, mode")
            .eq("id", storedPlayerId)
            .single();
          
          if (playerData) {
            setPlayerRole(playerData.role);
            setPlayerMode(playerData.mode);
          }
        }
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

  // Если игра уже идет, а у текущего игрока нет роли (он зашел позже),
  // то мы не пускаем его на игровые экраны, а оставляем в лобби.
  const isLateJoiner = roomState !== "lobby" && !playerRole;

  if (
    roomState ===
    "playing" && !isLateJoiner
  ) {
    return (
      <PlayingScreen
  roomCode={roomCode}
/>
    );
  }
  
  if (
    roomState ===
    "voting" && !isLateJoiner
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