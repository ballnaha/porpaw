import type { Metadata } from "next";
import { Kanit, Nunito, Prompt } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./components/CartProvider";
import { ToastProvider } from "./components/ToastProvider";

const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
  display: "swap",
});

const nunito = Nunito({
  weight: ["400", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const prompt = Prompt({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "thai"],
  variable: "--font-prompt",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4017"),
  title: "WhatDaDog - บริการกล่องอาหารและแนะนำสถานที่สำหรับสัตว์เลี้ยง",
  description: "แอปจัดกล่องอาหารบาร์ฟสดและโภชนาการพรีเมียมเฉพาะบุคคลสำหรับสุนัขและแมว",
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      data-scroll-behavior="smooth"
      className={`${kanit.variable} ${nunito.variable} ${prompt.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-800 font-sans">
        <ToastProvider>
          <CartProvider>{children}</CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
