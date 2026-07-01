import React from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button.jsx"; 
import { useTheme } from "../ThemeProvider.jsx";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  // Orden de los temas al pulsar
  const themes = ["light", "dark"];
  const handleToggleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <Button
      variant="default"
      size="icon"
      onClick={handleToggleTheme}
      className="relative"
    >
      <Sun
        className={`absolute h-5 w-5 transition-all duration-300 ${
          theme === "dark" ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all duration-300 ${
          theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
