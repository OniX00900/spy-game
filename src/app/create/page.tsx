import { CreateRoomForm } from "@/components/room/create-room-form";

export default function CreateRoomPage() {
    return (
      <main className="flex items-center justify-center py-12 min-h-[calc(100vh-65px)]">
        <div className="w-full max-w-sm space-y-8">
          <h1 className="text-center text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Создание комнаты
          </h1>
  
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
    Хост комнаты
  </h2>

  <input
    id="host-nickname"
    placeholder="Ваш никнейм"
    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-slate-500 outline-none transition-all text-base"
  />

  <div className="space-y-3">
    <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
      <input
        type="radio"
        name="host-mode"
        value="player"
        defaultChecked
        className="form-radio text-slate-700 dark:text-slate-300 focus:ring-slate-500"
      />
      Игрок
    </label>

    <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
      <input
        type="radio"
        name="host-mode"
        value="spectator"
        className="form-radio text-slate-700 dark:text-slate-300 focus:ring-slate-500"
      />
      Зритель
    </label>
  </div>

          <CreateRoomForm />
          </div>
        </div>
      </main>
    );
  }