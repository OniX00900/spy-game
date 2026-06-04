import { CreateRoomForm } from "@/components/room/create-room-form";

export default function CreateRoomPage() {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-3xl space-y-6">
  
          <h1 className="text-3xl font-bold">
            Создание комнаты
          </h1>
  
          <input
            className="w-full rounded-lg border p-3"
            placeholder="Название комнаты"
          />
  
          <div className="space-y-4 rounded-lg border p-4">
  <h2 className="text-xl font-semibold">
    Хост комнаты
  </h2>

  <input
    id="host-nickname"
    placeholder="Ваш никнейм"
    className="w-full rounded-lg border p-3"
  />

  <div className="space-y-2">
    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="host-mode"
        value="player"
        defaultChecked
      />
      Игрок
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="host-mode"
        value="spectator"
      />
      Зритель
    </label>
  </div>
</div>
          <CreateRoomForm />
  
        </div>
      </main>
    );
  }