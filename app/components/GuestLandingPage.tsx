"use client";

import React, { useCallback, useState } from "react";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme, DS } from "./DesignSystem";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { SubscriptionBanner } from "./SubscriptionBanner";
import { NutritionCalculator } from "./NutritionCalculator";
import { Places } from "./Places";
import { Healthcare } from "./Healthcare";
import { Footer } from "./Footer";

interface GuestLandingPageProps {
  handleLineLogin: () => void;
  isConnecting: boolean;
}

const GuestLandingPage: React.FC<GuestLandingPageProps> = ({
  handleLineLogin,
  isConnecting,
}) => {
  const [calculatedGrams, setCalculatedGrams] = useState<number | null>(null);
  const [species, setSpecies] = useState<"dog" | "cat">("dog");
  const [nutrition, setNutrition] = useState<{
    dailyGrams: number;
    dailyKcal: number;
    recommendedPlan: "Paw-Lite" | "Paw-Fit" | "Paw-Max";
  } | null>(null);

  const handleNutritionCalculate = useCallback(
    (
      grams: number | null,
      sp: "dog" | "cat",
      nutritionResult: {
        dailyGrams: number;
        dailyKcal: number;
        recommendedPlan: "Paw-Lite" | "Paw-Fit" | "Paw-Max";
      } | null,
    ) => {
      setCalculatedGrams(grams);
      setSpecies(sp);
      setNutrition(nutritionResult);
    },
    [],
  );

  return (
    <ThemeProvider theme={theme}>
      {/* Fixed rail — desktop only */}
      <Sidebar />

      {/* Content offset to clear the fixed rail on large screens */}
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: DS.white,
          color: DS.ink,
          overflowX: "hidden",
          pl: { lg: "104px" },
        }}
      >
        <Navbar handleLineLogin={handleLineLogin} isConnecting={isConnecting} />
        <Hero handleLineLogin={handleLineLogin} isConnecting={isConnecting} />
        <Features />
        <NutritionCalculator onCalculate={handleNutritionCalculate} />
        <SubscriptionBanner
          handleLineLogin={handleLineLogin}
          calculatedGrams={calculatedGrams}
          species={species}
          nutrition={nutrition}
        />
        <Places handleLineLogin={handleLineLogin} />
        <Healthcare handleLineLogin={handleLineLogin} />
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default GuestLandingPage;
