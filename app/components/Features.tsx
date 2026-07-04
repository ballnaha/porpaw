"use client";

import React from "react";
import Image from "next/image";
import { Box, Button, Container, Typography } from "@mui/material";
import { ArrowRight } from "lucide-react";
import { DS } from "./DesignSystem";

const CATEGORIES = [
  { label: "Dog Food", image: "/hero_pets.png", bg: "#CBE5DD", position: "30% center" },
  { label: "Cat Food", image: "/hero_pets.png", bg: "#F7CFC3", position: "61% center" },
  { label: "Treats", image: "/images/snack.png", bg: "#F8DFA7", position: "center" },
  { label: "Toys", image: "/images/box.png", bg: "#DCCEEB", position: "60% center" },
  { label: "Care", image: "/service_treats.png", bg: "#D9E9E3", position: "center" },
  { label: "Accessories", image: "/images/home.png", bg: "#F6C2A9", position: "center" },
];

export const Features: React.FC = () => {
  return (
    <Container
      maxWidth="lg"
      id="features"
      sx={{
        py: { xs: 3, md: 4 },
        px: { xs: 2.5, sm: 3, lg: 1 },
        scrollMarginTop: "40px",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "285px minmax(0, 1fr)" },
          gap: { xs: 2, md: 2.5 },
        }}
      >
        <Box
          sx={{
            position: "relative",
            minHeight: { xs: 190, md: 210 },
            overflow: "hidden",
            borderRadius: "28px",
            bgcolor: "#DCEDE8",
            p: { xs: 2.75, md: 3 },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 2, maxWidth: 145 }}>
            <Typography
              sx={{
                color: "#477B70",
                fontSize: { xs: 18, md: 19 },
                fontWeight: 900,
                lineHeight: 1.05,
              }}
            >
              Subscribe
              <br />
              <Box component="span" sx={{ color: DS.ink }}>
                &amp; Save More
              </Box>
            </Typography>
            <Typography sx={{ mt: 1.5, color: "#56545A", fontSize: 11, lineHeight: 1.7 }}>
              Flexible plans, pause
              <br />
              or cancel anytime.
            </Typography>
            <Button
              component="a"
              href="#promo"
              endIcon={<ArrowRight size={13} />}
              sx={{
                mt: 1.75,
                minWidth: 104,
                px: 1.75,
                py: 0.7,
                color: DS.ink,
                bgcolor: "rgba(255,255,255,.35)",
                border: "1px solid rgba(43,43,51,.45)",
                borderRadius: DS.radius.pill,
                fontSize: 10.5,
                "&:hover": { bgcolor: "rgba(255,255,255,.7)" },
              }}
            >
              View Plans
            </Button>
          </Box>

          <Image
            src="/service_subscription.png"
            alt="กล่อง Subscription สำหรับสัตว์เลี้ยง"
            width={1024}
            height={1024}
            style={{
              position: "absolute",
              width: "57%",
              height: "78%",
              right: "-2%",
              bottom: "-5%",
              objectFit: "cover",
              objectPosition: "58% 58%",
              borderRadius: "24px 0 0 0",
              mixBlendMode: "multiply",
            }}
          />
        </Box>

        <Box
          sx={{
            minHeight: { md: 210 },
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", lg: "repeat(6, 1fr)" },
            alignItems: "center",
            gap: { xs: 2.5, lg: 1.25 },
            borderRadius: "28px",
            bgcolor: "#FCF9F4",
            px: { xs: 2, md: 2.5 },
            py: { xs: 3, md: 2 },
          }}
        >
          {CATEGORIES.map(({ label, image, bg, position }) => (
            <Box
              component="a"
              href="#promo"
              key={label}
              sx={{
                color: DS.ink,
                textAlign: "center",
                textDecoration: "none",
                transition: "transform .2s",
                "&:hover": { transform: "translateY(-3px)" },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: { xs: 82, md: 88 },
                  height: { xs: 82, md: 88 },
                  mx: "auto",
                  mb: 1.25,
                  overflow: "hidden",
                  borderRadius: "50%",
                  bgcolor: bg,
                }}
              >
                <Image
                  src={image}
                  alt={label}
                  fill
                  sizes="88px"
                  style={{ objectFit: "cover", objectPosition: position, mixBlendMode: "multiply" }}
                />
              </Box>
              <Typography sx={{ fontSize: 12, fontWeight: 800, lineHeight: 1.2 }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};
