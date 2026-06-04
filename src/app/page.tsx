import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">

        <h1 className="text-center text-4xl font-bold">
          Spy Game
        </h1>

        <Link
          href="/create"
          className="block rounded-lg border p-4 text-center"
        >
          Создать комнату
        </Link>

        <input
          placeholder="Код комнаты"
          className="w-full rounded-lg border p-4"
        />

        <button
          className="w-full rounded-lg border p-4"
        >
          Войти
        </button>

      </div>
    </main>
  );
}