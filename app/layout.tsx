import type { Metadata } from "next";
import { Overpass_Mono } from "next/font/google";
import "./globals.css";

import { ConvexClientProvider } from "@/providers/convex-client-provider";
import { Toaster } from "@/components/ui/sonner";
import { ModalProvider } from "@/providers/modal-provider";

const overpass_mono = Overpass_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scratch!",
  description: "An online collaborative platform for whiteboarding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={overpass_mono.className}>
        <ConvexClientProvider>
          <Toaster />
          <ModalProvider/>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
