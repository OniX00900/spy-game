"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { PlayerList } from "./player-list";
import { LeaveRoomButton } from "./leave-room-button";

import { StartGameButton } from "@/components/game/start-game-button";
import { supabase } from "@/lib/supabase";
import { useRoomPlayers } from "@/hooks/useRoomPlayers";

interface RoomLobbyProps {
  roomCode: string;
}

export function RoomLobby({
  roomCode,
}: RoomLobbyProps) {
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isHost, setIsHost] =
    useState(false);
    const [currentMode, setCurrentMode] =
    useState<
      "player" | "spectator"
    >("player");
  const [spyCount, setSpyCount] =
    useState(1);
  const [roomState, setRoomState] =
    useState("lobby");
    const [wordPack, setWordPack] =
  useState("default");

  const [spiesKnowEachOther, setSpiesKnowEachOther] =
    useState(false);
  const [revealRoleOnDeath, setRevealRoleOnDeath] =
    useState(false);
  const [revealVotes, setRevealVotes] = useState(false);
  const [betaSpyGuess, setBetaSpyGuess] = useState(false);
  const [customWords, setCustomWords] = useState("");
  const [playerRole, setPlayerRole] =
    useState<string | null>(null);

  const [playerId, setPlayerId] =
  useState("");
  const players =
  useRoomPlayers(
    roomCode
  );
  const playerCount =
  players.filter(
    (player) =>
      player.mode ===
      "player"
  ).length;

const spectatorCount =
  players.filter(
    (player) =>
      player.mode ===
      "spectator"
  ).length;

  useEffect(() => {
    const player =
      JSON.parse(
        localStorage.getItem(
          "spy-player"
        ) || "{}"
      );

      setPlayerId(
        player.id ?? ""
      );

    setIsHost(
      player.is_host === true
    );

    setCurrentMode(
      player.mode ?? "player"
    );

    async function loadRoom() {
      const { data } =
        await supabase
          .from("rooms")
          .select("*")
          .eq("code", roomCode)
          .single();
    
      if (data) {
        setRoomState(data.state);

        setSpyCount(
          data.spy_count ?? 1
        );
    
        setWordPack(
          data.word_pack ??
            "default"
        );

        setSpiesKnowEachOther(
          data.spies_know_each_other ?? false
        );

        setRevealRoleOnDeath(
          data.reveal_role_on_death ?? false
        );

        setRevealVotes(
          data.reveal_votes ?? false
        );

        setBetaSpyGuess(
          data.beta_spy_guess ?? false
        );

        setCustomWords(
          data.custom_words ?? ""
        );
      }

      // Проверяем роль и статус хоста текущего игрока
      const storedId = localStorage.getItem("spy-player-id");
      if (storedId) {
        const { data: pData } = await supabase
          .from("players")
          .select("role, is_host")
          .eq("id", storedId)
          .maybeSingle();

        if (pData) {
          setPlayerRole(pData.role);
          setIsHost(pData.is_host);

          // Синхронизируем localStorage на случай перезагрузки страницы
          const player = JSON.parse(localStorage.getItem("spy-player") || "{}");
          if (player.is_host !== pData.is_host) {
            player.is_host = pData.is_host;
            localStorage.setItem("spy-player", JSON.stringify(player));
          }
        }
      }
    }
    
    loadRoom();
    
    const interval =
      setInterval(
        loadRoom,
        2000
      );
    
    return () => {
      clearInterval(
        interval
      );
    };
  }, [roomCode]);

  const handleCopy = async () => {
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }

    try {
      await navigator.clipboard.writeText(roomCode);
      setIsCopied(true);

      copyTimeoutRef.current = setTimeout(() => {
        setIsCopied(false);
        copyTimeoutRef.current = null;
      }, 2000);
    } catch (err) {
      console.error("Ошибка при копировании:", err);
    }
  };

  return (
    <div className="space-y-4">

      {/* Баннер показываем только если игра идет, а у пользователя нет роли и он не зритель */}
      {roomState !== "lobby" && currentMode === "player" && !playerRole && (
        <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-4 text-slate-900 dark:text-slate-100 shadow-sm animate-pulse">
          <div className="flex items-center gap-4">
            <span className="text-2xl">🎮</span>
            <div>
              <h3 className="font-bold uppercase tracking-tight text-lg leading-tight">Игра идёт...</h3>
              <p className="text-sm opacity-90">Вы присоединились во время активной партии. Вы сможете участвовать в следующей игре.</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Код комнаты
        </h2>

        <div className="mt-1 flex items-center justify-between">

          <span className="text-2xl font-bold">
            {roomCode}
          </span>

          <div className="flex gap-2">

            <button
              onClick={handleCopy}
              className={`rounded-md border px-3 py-1 text-sm font-medium transition-all duration-200 ${
                isCopied 
                  ? "border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950" 
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {isCopied ? "✓ Код скопирован" : "Копировать"}
            </button>

            <LeaveRoomButton 
              roomCode={roomCode}
              className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-red-600 dark:text-red-400" 
            />
          </div>

        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">

<div className="mb-3 flex items-center justify-between">

<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
  Игроки ({playerCount})
</h2>

  {currentMode ===
    "spectator" && (
      <button
      onClick={async () => {
    
        await supabase
          .from("players")
          .update({
            mode: "player",
          })
          .eq(
            "id",
            playerId
          );
    
        setCurrentMode(
          "player"
        );
    
      }}
      className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
    >
      Стать игроком
    </button>
  )}

</div>

<div className="space-y-2">

  <PlayerList
    mode="player"
    roomCode={roomCode}
  />

</div>

</div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">

      <div className="mb-3 flex items-center justify-between">

      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
  Зрители ({spectatorCount})
</h2>

{currentMode ===
  "player" && (
    <button
    onClick={async () => {
  
      await supabase
        .from("players")
        .update({
          mode: "spectator",
        })
        .eq(
          "id",
          playerId
        );
  
      setCurrentMode(
        "spectator"
      );
  
    }}
    className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
  >
    Стать зрителем
  </button>
)}

</div>

        <div className="space-y-2">

          <PlayerList
            mode="spectator"
            roomCode={roomCode}
          />

        </div>

      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-4">

        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Для начала игры требуется минимум 3 игрока.
        </p>

        <div className="space-y-4">

        <div className="space-y-3 py-1">
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox"
              checked={spiesKnowEachOther}
              disabled={!isHost}
              onChange={async (e) => {
                const val = e.target.checked;
                setSpiesKnowEachOther(val);
                await supabase
                  .from("rooms")
                  .update({
                    spies_know_each_other: val,
                  })
                  .eq("code", roomCode);
              }}
              className="rounded-sm border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:ring-slate-500 bg-slate-50 dark:bg-slate-950"
            />
            Шпионы знают друг друга
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox"
              checked={revealRoleOnDeath}
              disabled={!isHost}
              onChange={async (e) => {
                const val = e.target.checked;
                setRevealRoleOnDeath(val);
                await supabase
                  .from("rooms")
                  .update({
                    reveal_role_on_death: val,
                  })
                  .eq("code", roomCode);
              }}
              className="rounded-sm border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:ring-slate-500 bg-slate-50 dark:bg-slate-950"
            />
            Показывать роль выбывшего игрока
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox"
              checked={revealVotes}
              disabled={!isHost}
              onChange={async (e) => {
                const val = e.target.checked;
                setRevealVotes(val);
                await supabase
                  .from("rooms")
                  .update({
                    reveal_votes: val,
                  })
                  .eq("code", roomCode);
              }}
              className="rounded-sm border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:ring-slate-500 bg-slate-50 dark:bg-slate-950"
            />
            Показывать кто за кого голосовал
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox"
              checked={betaSpyGuess}
              disabled={!isHost}
              onChange={async (e) => {
                const val = e.target.checked;
                setBetaSpyGuess(val);
                await supabase
                  .from("rooms")
                  .update({
                    beta_spy_guess: val,
                  })
                  .eq("code", roomCode);
              }}
              className="rounded-sm border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:ring-slate-500 bg-slate-50 dark:bg-slate-950"
            />
            Автоматическая проверка контратаки (BETA)
          </label>
        </div>

        <div className="space-y-1">

<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
  Набор слов
</label>

{isHost ? (
  <select
    value={wordPack}
    onChange={async (e) => {
      const value =
        e.target.value;

      setWordPack(
        value
      );

      await supabase
        .from("rooms")
        .update({
          word_pack:
            value,
        })
        .eq(
          "code",
          roomCode
        );
    }}
    className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 text-base focus:ring-2 focus:ring-slate-500 outline-none transition-all"
  >
    <option value="default">
      По умолчанию
    </option>

    <option value="spyfall_locations">
      Шпион (Локации)
    </option>

    <option value="dota2">
      Герои DOTA 2
    </option>

    <option value="custom">
      Пользовательский
    </option>

  </select>
) : (
  <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 text-base">

    {wordPack ===
    "default"
      ? "По умолчанию"
      : wordPack === "spyfall_locations"
        ? "Шпион (Локации)"
      : wordPack ===
          "dota2"
        ? "Герои DOTA 2"
        : "Пользовательский"}
    </div>
  )
}
</div>

{wordPack === "custom" && (
  <div className="mt-2 space-y-1">
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
      Список слов (каждое с новой строки)
    </label>
    <textarea
      value={customWords}
      disabled={!isHost}
      placeholder="Введите слова..."
      onChange={async (e) => {
        const val = e.target.value;
        setCustomWords(val);
        await supabase
          .from("rooms")
          .update({
            custom_words: val,
          })
          .eq("code", roomCode);
      }}
      className="w-full min-h-[120px] rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 text-sm font-mono focus:ring-2 focus:ring-slate-500 outline-none transition-all"
    />
    {isHost && (
      <p className="text-[10px] text-slate-400 dark:text-slate-500">
        Слова сохраняются автоматически
      </p>
    )}
  </div>
)}
<div className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-300">
  Количество шпионов:{" "}
  <span className="font-bold">
    {spyCount}
  </span>
</div>

{isHost && (
  <input
    type="number"
    min={1}
    value={spyCount}
    onChange={async (e) => {
      const value =
        Number(
          e.target.value
        );

      setSpyCount(
        value
      );

      await supabase
        .from("rooms")
        .update({
          spy_count: value,
        })
        .eq(
          "code",
          roomCode
        );
    }}
    className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 text-base focus:ring-2 focus:ring-slate-500 outline-none transition-all"
  />
)}
        <div className="pt-2">
        {isHost ? (
          <StartGameButton
            roomCode={roomCode}
          />
        ) : (
          <div className="text-center text-sm text-slate-500 dark:text-slate-400 italic">
            Только хост может начать игру
          </div>
        )}
        </div>

      </div>
    </div>
    </div>
  );
}