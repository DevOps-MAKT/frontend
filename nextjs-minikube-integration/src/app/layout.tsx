import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MyNavbar from "@/components/navbar";
import * as React from "react";
import {NextUIProvider} from "@nextui-org/react";
import { PublicEnvScript } from 'next-runtime-env';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Baboon Bookings",
  description: "Where every reservation is monkey business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        <PublicEnvScript />
      </head>
      <body className={inter.className}>
        <NextUIProvider>
          <MyNavbar />
          {children}
        </NextUIProvider>
      </body>
    </html>
  );
}
