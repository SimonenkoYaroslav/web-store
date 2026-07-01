import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';

import { GradientBackground } from '@modules/common/components';
import ThemeRegistry from '@modules/common/theme/ThemeRegistry';
import { UserContextProvider } from '@modules/user';
import { userService } from '@modules/user/services';
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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
              <NextIntlClientProvider>
                {children}
              </NextIntlClientProvider>
            </UserContextProvider>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
