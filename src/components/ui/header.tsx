import Link from "next/link";

import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl items-center justify-between">

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