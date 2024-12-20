import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { MQTTProvider } from "../mqtt/mqtt-client";
import Navbar from "./_components/Navbar";

export const metadata: Metadata = {
  title: "Hawaii Keiki Museum",
  description: "An Interactive Energy Display",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Navbar />
        <div className="container mx-auto p-4 py-20">
          <TRPCReactProvider>
            <MQTTProvider>{children}</MQTTProvider>
          </TRPCReactProvider>
        </div>
      </body>
    </html>
  );
}
