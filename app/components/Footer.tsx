"use client";

import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { PawPrint, Cat, Heart } from "lucide-react";
import { DS } from "./DesignSystem";

const STATS = [
  { b: "10K+", s: "Happy Pets" },
  { b: "4.9 ★", s: "Customer Rate" },
  { b: "50+", s: "Pet Partners" },
  { b: "24/7", s: "Support" },
];

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        overflow: "hidden",
        bgcolor: DS.peachBg,
        borderRadius: "60px 60px 0 0",
        mt: { xs: 3, md: 5 },
      }}
    >
      {/* Decorative paw — bottom-left */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          left: { md: 24, lg: 8 },
          bottom: -20,
          color: "rgba(255,255,255,0.6)",
          transform: "rotate(18deg)",
          display: { xs: "none", md: "block" },
          pointerEvents: "none",
        }}
      >
        <PawPrint size={128} strokeWidth={1.5} fill="rgba(255,255,255,0.6)" />
      </Box>

      {/* Heart doodles near the paw */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          left: { md: 120, lg: 92 },
          top: 22,
          color: "rgba(255,255,255,0.7)",
          transform: "rotate(-14deg)",
          display: { xs: "none", md: "block" },
          pointerEvents: "none",
        }}
      >
        <Heart size={18} strokeWidth={2.5} fill="rgba(255,255,255,0.7)" />
      </Box>

      {/* Cat doodle — bottom-right */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          right: 28,
          bottom: 18,
          color: "rgba(255,255,255,0.7)",
          display: { xs: "none", lg: "block" },
          pointerEvents: "none",
        }}
      >
        <Cat size={54} strokeWidth={1.5} />
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 6.5 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "auto 1fr" },
            gap: { xs: 4, md: 5 },
            alignItems: "center",
          }}
        >
          <Box sx={{ pl: { md: 7 } }}>
            <Typography sx={{ fontSize: 24, fontWeight: 900, color: DS.ink, lineHeight: 1.25, letterSpacing: "-0.01em" }}>
              We&apos;re more than
              <br />
              just a pet store.
            </Typography>
            <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: "#6d5b50", mt: 1.25 }}>
              We&apos;re your pet care partner.
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.55)",
              borderRadius: "26px",
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: { xs: 2.5, md: 0 },
              p: "22px 10px",
              textAlign: "center",
            }}
          >
            {STATS.map((st) => (
              <Box key={st.s}>
                <Typography sx={{ fontSize: 24, fontWeight: 900, color: DS.accent }}>{st.b}</Typography>
                <Typography sx={{ fontSize: 11.5, fontWeight: 800, color: "#6d5b50" }}>{st.s}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
