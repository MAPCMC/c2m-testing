import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Providers from "@/components/Providers";

import "./globals.scss";

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
      <body className={`${openSans.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
