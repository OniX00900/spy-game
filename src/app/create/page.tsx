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
  
          <div>
            <label className="block mb-2 font-medium">
              Количество шпионов
            </label>
  
            <input
              type="number"
              min={1}
              max={10}
              defaultValue={1}
              className="w-full rounded-lg border p-3"
            />
          </div>
  
          <div className="space-y-3">
  
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Шпионы знают друг друга
            </label>
  
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Показывать роль выбывшего игрока
            </label>
  
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Показывать кто за кого голосовал
            </label>
  
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Автоматическая проверка контратаки (BETA)
            </label>
  
          </div>
  
          <div>
  
            <h2 className="mb-2 text-xl font-semibold">
              Пресет слов
            </h2>
  
            <select
  id="word-pack"
  className="w-full rounded-lg border p-3"
>
  <option value="default">
    По умолчанию
  </option>

  <option value="dota2">
    Герои DOTA 2
  </option>

  <option value="custom">
    Пользовательский
  </option>
</select>
  
          </div>
  
          <div>
  
            <h2 className="mb-2 text-xl font-semibold">
              Свои слова
            </h2>
  
            <textarea
              className="w-full min-h-64 rounded-lg border p-3"
              placeholder="Каждое слово с новой строки"
            />
  
          </div>
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