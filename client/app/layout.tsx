import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

import ThemeRegistry from '@core/theme/ThemeRegistry';
import { GradientBackground } from '@modules/common/components';
import { UserContextProvider } from '@modules/user';
import { userService } from '@modules/user/services';
import "./globals.css";

// Display / headings — a technical grotesque for the brutalist look.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Body / UI — monospace for the "engineered", severe feel.
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WEB STORE — CURATED GOODS",
  description: "A modern web store with a raw, brutalist brown-gold interface.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await userService.fetchCurrentUser();

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <GradientBackground />
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <UserContextProvider user={user}>
              {children}
            </UserContextProvider>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
