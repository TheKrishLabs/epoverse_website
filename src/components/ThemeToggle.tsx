"use client";

import { useTheme } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      {theme === "dark" ? (
        <FaSun
          size={20}
          className="text-orange-500 cursor-pointer"
          onClick={() => setTheme("light")}
        />
      ) : (
        <FaMoon
          size={20}
          className="text-gray-700 cursor-pointer"
          onClick={() => setTheme("dark")}
        />
      )}
    </>
  );
}