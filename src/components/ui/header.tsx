import Link from "next/link";

import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="border-b bg-orange-500 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">

        <Link
          href="/"
          className="text-xl font-bold"
        >
          Spy Game
        </Link>

        <ThemeToggle />

      </div>
    </header>
  );
}