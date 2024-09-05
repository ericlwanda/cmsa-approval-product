"use client";
import { useConfig } from "@/app/(FRONTEND)/hooks/use-config";
import { cn } from "@/lib/utils";

interface ThemeWrapperProps extends React.ComponentProps<"div"> {
  defaultTheme?: string;
}

export function ThemeWrapper({
  defaultTheme,
  children,
  className,
}: ThemeWrapperProps) {
  const [config] = useConfig();

  return (
    <div
      className={cn(`theme-${config.theme}`, "w-full", className)}
      style={
        {
          "--radius": `${config.radius ? config.radius : 0.5}rem`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
