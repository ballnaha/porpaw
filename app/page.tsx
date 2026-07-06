"use client";

import React, { useState } from "react";
import GuestLandingPage from "./components/GuestLandingPage";


export default function Home() {
  const [isConnecting, setIsConnecting] = useState(false); // แอนิเมชันล็อกอิน

  const handleLineLogin = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white text-[#322B24] flex flex-col w-full antialiased font-sans pb-12 sm:pb-0">
      
      <GuestLandingPage
        handleLineLogin={handleLineLogin}
        isConnecting={isConnecting}
      />

    </div>
  );
}
