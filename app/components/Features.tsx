"use client";

import React from "react";
import Image from "next/image";
import { Box, Button, Container, Typography } from "@mui/material";
import { ArrowRight } from "lucide-react";
import { DS } from "./DesignSystem";

const CATEGORIES = [
  {
    thLabel: "อาหารสุนัข",
    enLabel: "Dog Food",
    image: "/images/food_dog.webp",
    bg: "#F2FAF7",
    borderColor: "#E1EFEA",
  },
  {
    thLabel: "อาหารแมว",
    enLabel: "Cat Food",
    image: "/images/food_cat.webp",
    bg: "#FAF4F1",
    borderColor: "#F3E7E1",
  },
  {
    thLabel: "ขนม",
    enLabel: "Treats",
    image: "/images/snack1.webp",
    bg: "#FDF4F2",
    borderColor: "#F9E4DE",
  },
  {
    thLabel: "ของเล่น",
    enLabel: "Toys",
    image: "/images/toy2.webp",
    bg: "#FDF5F1",
    borderColor: "#F9E9E0",
  },
  {
    thLabel: "อุปกรณ์ดูแล",
    enLabel: "Grooming",
    image: "/images/groom3.webp",
    bg: "#F3FAF7",
    borderColor: "#E3EFEA",
  },
  {
    thLabel: "ที่นอน & บ้าน",
    enLabel: "Bed & House",
    image: "/images/home.webp",
    bg: "#FAF4EF",
    borderColor: "#F3E7DA",
  },
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
            height: { xs: 160, md: 175 },
            overflow: "hidden",
            borderRadius: "28px",
            bgcolor: "#DCEDE8",
            p: { xs: 2, md: 2.25 },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 2, maxWidth: 145 }}>
            <Typography
              sx={{
                color: "#477B70",
                fontSize: { xs: 18, md: 19 },
                fontWeight: 900,
                lineHeight: 1.15,
              }}
            >
              รวมส่งครั้งเดียว
              <br />
              <Box component="span" sx={{ color: DS.ink }}>
                คุ้มทุกกล่อง
              </Box>
            </Typography>
            <Typography sx={{ mt: 1, color: "#56545A", fontSize: 10.5, lineHeight: 1.55 }}>
              รวมอาหารและของใช้พร้อมกัน
              <br />
              ค่าส่งชัดเจนก่อนชำระ
            </Typography>
            <Button
              component="a"
              href="#explore"
              endIcon={<ArrowRight size={13} />}
              sx={{
                mt: 1.25,
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
              ดูรอบจัดส่ง
            </Button>
          </Box>

          <Image
            src="/images/delivery.webp"
            alt="บริการจัดส่งอาหารสัตว์เลี้ยง"
            width={300}
            height={300}
            style={{
              position: "absolute",
              height: "82%",
              width: "auto",
              maxWidth: "45%",
              right: "3%",
              bottom: "6%",
              objectFit: "contain",
              mixBlendMode: "multiply",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", lg: "repeat(6, 1fr)" },
            gap: 2.25,
          }}
        >
          {CATEGORIES.map(({ thLabel, enLabel, image, bg, borderColor }) => (
            <Box
              component="a"
              href="#promo"
              key={thLabel}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                bgcolor: bg,
                border: "1px solid",
                borderColor: borderColor,
                borderRadius: "28px",
                p: 1.5,
                height: { xs: 160, md: 175 },
                textDecoration: "none",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.01)",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 20px 38px rgba(43,43,51,0.06)",
                  borderColor: DS.peach,
                },
                "&:hover img": {
                  transform: "scale(1.08) translateY(-2px)",
                },
              }}
            >
              {/* Image Wrapper */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: 100, md: 115 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src={image}
                  alt={thLabel}
                  fill
                  sizes="(max-width: 600px) 150px, 120px"
                  style={{
                    objectFit: "contain",
                    mixBlendMode: "multiply",
                    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </Box>

              {/* Text Labels */}
              <Box sx={{ textAlign: "center", mt: 0.75, width: "100%" }}>
                <Typography
                  sx={{
                    fontSize: { xs: 13, md: 14 },
                    fontWeight: 900,
                    color: DS.ink,
                    lineHeight: 1.25,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {thLabel}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: 9.5, md: 10.5 },
                    color: "#9A9A9A",
                    mt: 0.5,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {enLabel}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};
