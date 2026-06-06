"use client";

import {
  useEffect,
  useState,
} from "react";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] =
    useState(false);

  const {
    theme,
    setTheme,
  } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() =>
        setTheme(
          theme === "dark"
            ? "light"
            : "dark"
        )
      }
      className="rounded-md border px-2 py-1 text-sm"
    >
      {theme === "dark"
        ? "☀️"
        : "🌙"}
    </button>
  );
}