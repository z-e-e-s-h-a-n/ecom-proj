"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@workspace/ui/components/button";

export function ThemeSwitch() {
  const { setTheme, theme } = useTheme();
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full text-muted-foreground hover:bg-transparent"
      onClick={toggleTheme}
    >
      <Sun className="!size-5  rotate-0 scale-100 text-black transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute !size-5  rotate-90 scale-0 text-white transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
