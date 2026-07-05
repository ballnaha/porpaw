"use client";

import React from "react";
import Image from "next/image";
import { Box, Container, Typography, Button, IconButton } from "@mui/material";
import { ShoppingCart } from "lucide-react";
import { DS } from "./DesignSystem";

interface NavbarProps {
  handleLineLogin: () => void;
  isConnecting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  handleLineLogin,
  isConnecting,
}) => {
  return (
    <Container
      maxWidth="lg"
      id="top"
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        pt: { xs: 2.5, md: 4.5 },
        pb: { xs: 1, md: 1.5 },
        px: { xs: 2.5, sm: 3, lg: 1 },
      }}
    >
      {/* Brand */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Image
          src="/images/logo.png"
          alt="Porpaw"
          width={1191}
          height={346}
          priority
          style={{
            width: "auto",
            height: "clamp(30px, 6vw, 42px)",
            objectFit: "contain",
          }}
        />
        <Typography
          sx={{
            display: { xs: "none", sm: "block" },
            fontSize: "14px",
            color: DS.gray,
            fontWeight: 400,
          }}
        >
          พ.พาว
        </Typography>
      </Box>

      {/* Right actions */}
      <Box
        sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1.5 }}
      >
        <Button
          onClick={handleLineLogin}
          disableElevation
          sx={{
            display: { xs: "none", sm: "inline-flex" },
            border: `1px solid ${DS.line}`,
            borderRadius: DS.radius.pill,
            minWidth: 122,
            px: 2.5,
            py: 1,
            fontSize: 12,
            fontWeight: 800,
            color: DS.ink,
            bgcolor: DS.white,
            "&:hover": { borderColor: DS.ink, bgcolor: DS.white },
          }}
        >
          {isConnecting ? "กำลังเชื่อมต่อ…" : "Login / Register"}
        </Button>
        <IconButton
          aria-label="ตะกร้าสินค้า"
          onClick={handleLineLogin}
          sx={{
            width: 46,
            height: 46,
            bgcolor: DS.peach,
            color: DS.white,
            transition: "transform .2s",
            "&:hover": { bgcolor: DS.peach, transform: "scale(1.06)" },
          }}
        >
          <ShoppingCart size={20} strokeWidth={1.9} />
        </IconButton>
      </Box>
    </Container>
  );
};
