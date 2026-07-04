"use client";

import React from "react";
import Image from "next/image";
import { Box, Container, Typography } from "@mui/material";
import { ArrowRight } from "lucide-react";
import { DS } from "./DesignSystem";

interface PlacesProps {
  handleLineLogin: () => void;
}

const PLACES = [
  { title: "Dog Parks", img: "/place_travel.png" },
  { title: "Pet Travel", img: "/service_places.png" },
  { title: "Veterinary Hospitals", img: "/place_hospital.png" },
  { title: "Pet Hotels", img: "/place_hotel.png" },
];

/** Flat pastel scene — corgi trotting toward a clinic, mirrors the reference. */
const ExploreScene: React.FC = () => (
  <Box
    aria-hidden
    sx={{
      display: { xs: "none", md: "block" },
      width: "100%",
      mt: -1,
      mb: 1,
      pointerEvents: "none",
    }}
  >
    <Box component="svg" viewBox="0 0 820 150" sx={{ width: "100%", height: "auto", display: "block" }}>
      {/* soft clouds */}
      <ellipse cx="150" cy="30" rx="34" ry="11" fill="#F1F4EF" />
      <ellipse cx="600" cy="26" rx="40" ry="12" fill="#F1F4EF" />

      {/* mint hill */}
      <path d="M0 150 Q 410 78 820 150 Z" fill={DS.mint} />
      <path d="M0 150 Q 410 96 820 150 Z" fill={DS.mintDeep} opacity="0.35" />

      {/* dashed path from corgi to pin */}
      <path
        d="M250 118 Q 430 92 600 104"
        fill="none"
        stroke={DS.gray}
        strokeWidth="2.5"
        strokeDasharray="2 9"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* location pin */}
      <g transform="translate(604,58)">
        <path d="M0 0 C 16 0 16 20 0 40 C -16 20 -16 0 0 0 Z" fill={DS.peach} />
        <circle cx="0" cy="15" r="6" fill="#fff" />
      </g>

      {/* clinic building */}
      <g transform="translate(660,58)">
        <rect x="0" y="24" width="96" height="60" rx="6" fill="#fff" stroke="#E7E4DE" strokeWidth="2" />
        <path d="M-6 26 L48 4 L102 26 Z" fill={DS.mintDeep} />
        <rect x="40" y="52" width="16" height="32" rx="3" fill={DS.mint} />
        <rect x="12" y="40" width="14" height="12" rx="2" fill={DS.lavenderSoft} />
        <rect x="70" y="40" width="14" height="12" rx="2" fill={DS.lavenderSoft} />
        {/* cross */}
        <rect x="42" y="12" width="12" height="4" rx="1" fill="#fff" />
        <rect x="46" y="8" width="4" height="12" rx="1" fill="#fff" />
      </g>

      {/* corgi trotting right */}
      <g transform="translate(150,74)">
        {/* tail */}
        <path d="M-4 14 Q -22 6 -18 24 Q -8 24 -2 20 Z" fill="#E3A063" stroke="#C67F3E" strokeWidth="1.5" />
        {/* legs */}
        <rect x="14" y="38" width="7" height="16" rx="3" fill="#F3E9DE" />
        <rect x="30" y="40" width="7" height="15" rx="3" fill="#EAD9C7" />
        <rect x="50" y="38" width="7" height="16" rx="3" fill="#F3E9DE" />
        <rect x="64" y="40" width="7" height="15" rx="3" fill="#EAD9C7" />
        {/* body */}
        <ellipse cx="42" cy="30" rx="42" ry="21" fill="#E3A063" />
        <path d="M14 40 Q 42 54 74 40 Q 42 46 14 40 Z" fill="#FBF3EA" />
        {/* head */}
        <circle cx="92" cy="20" r="20" fill="#E3A063" />
        {/* ears */}
        <path d="M78 6 L74 -14 L92 2 Z" fill="#E3A063" stroke="#C67F3E" strokeWidth="1.5" />
        <path d="M104 4 L112 -14 L96 0 Z" fill="#E3A063" stroke="#C67F3E" strokeWidth="1.5" />
        {/* face white blaze + muzzle */}
        <path d="M88 8 Q 96 20 92 34 Q 88 20 88 8 Z" fill="#FBF3EA" />
        <ellipse cx="103" cy="26" rx="11" ry="9" fill="#FBF3EA" />
        <circle cx="88" cy="18" r="2.4" fill="#3A2A1C" />
        <circle cx="108" cy="30" r="2.6" fill="#3A2A1C" />
        <path d="M100 33 Q 104 37 108 33" fill="none" stroke="#3A2A1C" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </Box>
  </Box>
);

export const Places: React.FC<PlacesProps> = ({ handleLineLogin }) => {
  return (
    <Container maxWidth="lg" id="explore" sx={{ py: { xs: 4, md: 5 }, scrollMarginTop: "40px" }}>
      {/* Heading */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 12.5, fontWeight: 800, color: DS.ink }}>Explore More</Typography>
        <Typography
          component="h2"
          sx={{
            display: "inline-block",
            position: "relative",
            fontSize: { xs: "1.7rem", md: "2.1rem" },
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: DS.ink,
            mt: 0.75,
            lineHeight: 1.2,
          }}
        >
          Pet-Friendly Places &amp; Services
          <Box
            component="svg"
            viewBox="0 0 120 10"
            sx={{ position: "absolute", left: 2, bottom: -8, width: 120, height: 10 }}
          >
            <path d="M2 7 Q60 -2 118 6" stroke={DS.peach} strokeWidth="4" fill="none" strokeLinecap="round" />
          </Box>
        </Typography>
      </Box>

      {/* Decorative scene */}
      <ExploreScene />

      {/* Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2.25,
        }}
      >
        {PLACES.map((p) => (
          <Box
            key={p.title}
            onClick={handleLineLogin}
            sx={{
              position: "relative",
              borderRadius: "22px",
              overflow: "hidden",
              aspectRatio: "0.86",
              cursor: "pointer",
              display: "flex",
              alignItems: "flex-end",
              transition: "transform .25s, box-shadow .25s",
              "&:hover": { transform: "translateY(-5px)", boxShadow: DS.cardShadowHover },
              "&:hover img": { transform: "scale(1.05)" },
            }}
          >
            <Image
              src={p.img}
              alt={p.title}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 25vw"
              style={{ objectFit: "cover", transition: "transform .35s" }}
            />
            {/* Gradient bar */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                background: "linear-gradient(transparent, rgba(20,20,26,.62))",
                p: "38px 16px 16px",
                color: DS.white,
              }}
            >
              <Typography sx={{ fontSize: 14.5, fontWeight: 800, lineHeight: 1.25 }}>{p.title}</Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: DS.white,
                  color: DS.ink,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <ArrowRight size={15} strokeWidth={2.5} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
};
