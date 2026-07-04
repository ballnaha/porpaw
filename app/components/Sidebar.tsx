"use client";

import React from "react";
import { Box } from "@mui/material";
import {
  PawPrint,
  Home,
  ShoppingBag,
  Package,
  Gift,
  Compass,
  ShieldPlus,
  User,
} from "lucide-react";
import { DS } from "./DesignSystem";

const NAV = [
  { icon: Home, label: "Home", href: "#top", active: true },
  { icon: ShoppingBag, label: "Shop", href: "#features" },
  { icon: Package, label: "Subscription", href: "#promo" },
  { icon: Gift, label: "Sets & Gifts", href: "#promo" },
  { icon: Compass, label: "Explore", href: "#explore" },
  { icon: ShieldPlus, label: "Vet & Care", href: "#explore" },
  { icon: User, label: "Account", href: "#top" },
];

/** Fixed floating rail — desktop only, mirrors the reference sidebar. */
export const Sidebar: React.FC = () => {
  return (
    <Box
      component="nav"
      aria-label="เมนูหลัก"
      sx={{
        display: { xs: "none", lg: "flex" },
        position: "fixed",
        left: 17,
        top: 14,
        bottom: 16,
        zIndex: 60,
        width: 78,
        bgcolor: DS.white,
        borderRadius: "38px",
        p: "30px 5px 25px",
        boxShadow: "0 12px 34px rgba(43,43,51,0.10)",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo dot */}
      <Box
        sx={{
          width: 49,
          height: 49,
          borderRadius: "50%",
          bgcolor: "#F6B39E",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <PawPrint size={24} color={DS.white} fill={DS.white} strokeWidth={1.8} />
      </Box>

      {NAV.map(({ icon: Icon, label, href, active }) => (
        <Box
          key={label}
          component="a"
          href={href}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.35,
            width: 66,
            py: 0,
            borderRadius: "20px",
            textDecoration: "none",
            color: active ? "#EF8E72" : "#343237",
            fontSize: 10.5,
            lineHeight: 1.15,
            fontWeight: active ? 700 : 500,
            transition: "color .2s, transform .2s",
            "&:hover": { color: DS.ink, transform: "translateY(-1px)" },
            "&:focus-visible": { outline: `2px solid ${DS.peach}`, outlineOffset: 2 },
          }}
        >
          <Box
            sx={{
              width: active ? 49 : 38,
              height: active ? 49 : 38,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              bgcolor: active ? "#FFF0EA" : "transparent",
            }}
          >
            <Icon size={20} strokeWidth={active ? 2.2 : 1.65} />
          </Box>
          {label}
        </Box>
      ))}
    </Box>
  );
};
