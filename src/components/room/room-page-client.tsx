"use client";

import { useEffect, useState } from "react";
import { PlayingScreen } from "@/components/game/screens/PlayingScreen";
import { JoinRoomForm } from "./join-room-form";
import { RoomLobby } from "./room-lobby";
import { VotingScreen } from "@/components/game/screens/VotingScreen";
import { FinishedScreen } from "@/components/game/screens/FinishedScreen";
import { ResultsScreen } from "@/components/game/screens/ResultsScreen";

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
          .select("id, role, mode, is_host")
          .eq("id", storedPlayerId)
          .eq("room_id", roomData.id)
          .single();

        setJoined(!!playerData);
        if (playerData) {
          setPlayerRole(playerData.role);
          setPlayerMode(playerData.mode);

          // Обновляем статус хоста в localStorage
          const player = JSON.parse(localStorage.getItem("spy-player") || "{}");
          player.is_host = playerData.is_host;
          localStorage.setItem("spy-player", JSON.stringify(player));
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
            .select("role, mode, is_host")
            .eq("id", storedPlayerId)
            .maybeSingle();
          
          if (playerData) {
            setPlayerRole(playerData.role);
            setPlayerMode(playerData.mode);

            // Обновляем статус хоста в localStorage
            const player = JSON.parse(localStorage.getItem("spy-player") || "{}");
            player.is_host = playerData.is_host;
            localStorage.setItem("spy-player", JSON.stringify(player));
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
  // то мы не пускаем его на игровые экраны. Зрителей (spectator) это не касается.
  const isLateJoiner = playerMode === "player" && roomState !== "lobby" && !playerRole;

  if (isLateJoiner) {
    return <RoomLobby roomCode={roomCode} />;
  }

  // Семантичный переключатель экранов
  switch (roomState) {
    case "playing":
      return <PlayingScreen roomCode={roomCode} />;
    case "voting":
      return <VotingScreen roomCode={roomCode} />;
    case "results":
      return <ResultsScreen roomCode={roomCode} />;
    case "finished":
      return <FinishedScreen roomCode={roomCode} />;
    default:
      return <RoomLobby roomCode={roomCode} />;
  }
}