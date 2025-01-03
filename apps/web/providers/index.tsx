import React from "react";
import { ThemeProvider } from "next-themes";
import StoreProvider from "./StoreProvider";

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <StoreProvider>{children}</StoreProvider>
    </ThemeProvider>
  );
}

export default Provider;
