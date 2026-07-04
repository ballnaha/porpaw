"use client";

import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import { Leaf, Truck, CalendarHeart, Heart, MapPin } from "lucide-react";
import { DS } from "./DesignSystem";

const FEATURES = [
  {
    icon: Leaf,
    bg: DS.mintDeep,
    title: "Premium Quality",
    desc: "Carefully selected for your pet",
  },
  {
    icon: Truck,
    bg: DS.lavender,
    title: "Fast & Safe Delivery",
    desc: "On-time delivery to your door",
  },
  {
    icon: CalendarHeart,
    bg: DS.peach,
    title: "Flexible Subscription",
    desc: "Skip, pause or cancel anytime",
  },
  {
    icon: Heart,
    bg: DS.yellow,
    title: "Curated Pet Sets",
    desc: "Food, toys, treats and more",
  },
  {
    icon: MapPin,
    bg: DS.green,
    title: "Explore Pet-Friendly",
    desc: "Places, vets and services near you",
  },
];

export const Features: React.FC = () => {
  return (
    <Container maxWidth="lg" id="features" sx={{ py: { xs: 3, md: 4 }, scrollMarginTop: "40px" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(5, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {FEATURES.map(({ icon: Icon, bg, title, desc }) => (
          <Paper
            key={title}
            elevation={0}
            sx={{
              bgcolor: DS.white,
              borderRadius: DS.radius.lg,
              border: `1px solid ${DS.line}`,
              boxShadow: "0 8px 24px rgba(43,43,51,.05)",
              p: { xs: "26px 16px", md: "34px 20px" },
              textAlign: "center",
              transition: "transform .25s, box-shadow .25s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: DS.cardShadow,
              },
            }}
          >
            <Box
              sx={{
                width: 58,
                height: 58,
                borderRadius: "50%",
                bgcolor: bg,
                color: DS.white,
                display: "grid",
                placeItems: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <Icon size={24} strokeWidth={2} />
            </Box>
            <Typography sx={{ fontSize: 15, fontWeight: 800, color: DS.ink, lineHeight: 1.3 }}>
              {title}
            </Typography>
            <Typography sx={{ fontSize: 12, color: DS.gray, fontWeight: 600, mt: 1, lineHeight: 1.5 }}>
              {desc}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};
