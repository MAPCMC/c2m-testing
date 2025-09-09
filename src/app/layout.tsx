import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Providers from "@/components/Providers";

import "./globals.css";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connect2Music testportaal",
  description:
    "Geef je mening over toegankelijke muziekapplicaties",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <meta
          name="apple-mobile-web-app-title"
          content="Connect2Music"
        />
      </head>
      <body
        className={`${openSans.className} antialiased bg-c2m-yellow/10 dark:bg-background`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
