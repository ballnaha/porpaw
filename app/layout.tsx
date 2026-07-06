import type { Metadata } from "next";
import { Kanit, Nunito } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
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
      className={`${kanit.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-800 font-sans">
        {children}
      </body>
    </html>
  );
}
