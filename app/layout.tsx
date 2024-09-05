import { ThemeSwitcher } from "@/components/Theme-switcher";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CMSA-PRODUCT",
  description: "created by Erick lwanda",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body>
          <Toaster />
          <Providers
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </Providers>
        </body>
      </html>
    </SessionProvider>
  );
}
