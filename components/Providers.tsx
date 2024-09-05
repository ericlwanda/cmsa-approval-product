"use client";
import React, { useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children, ...props }: ThemeProviderProps) {
  const [client] = useState(new QueryClient());
  return (
    <NextThemesProvider {...props}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </NextThemesProvider>
  );
}
