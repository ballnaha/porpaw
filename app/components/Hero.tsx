"use client";

import React from "react";
import Image from "next/image";
import { Box, Container, Typography, Button } from "@mui/material";
import { ArrowRight, Truck, PackageCheck, CalendarDays } from "lucide-react";
import { DS } from "./DesignSystem";

interface HeroProps {
  handleLineLogin: () => void;
  isConnecting: boolean;
}

const BENEFITS = [
  {
    icon: Truck,
    title: "ค่าส่งโปร่งใส",
    detail: "แจ้งก่อนชำระทุกครั้ง",
  },
  {
    icon: PackageCheck,
    title: "สินค้าคุณภาพ",
    detail: "คัดสรรแบรนด์ชั้นนำ",
  },
  {
    icon: CalendarDays,
    title: "รอบส่งควบคุมได้",
    detail: "ปรับ/เลื่อนผ่าน LINE ได้เสมอ",
  },
];

export const Hero: React.FC<HeroProps> = ({ handleLineLogin, isConnecting }) => {
  return (
    <Box component="section" sx={{ position: "relative", overflow: "hidden" }}>
      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 2, md: 3 },
          pb: { xs: 5, md: 3 },
          px: { xs: 2.5, sm: 3, lg: 1 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "minmax(0, .9fr) minmax(0, 1.1fr)",
            },
            alignItems: "center",
            gap: { xs: 5, md: 1 },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 2, pb: { md: 3 } }}>
            <Typography
              sx={{
                color: DS.gray,
                fontSize: { xs: 10, md: 11 },
                fontWeight: 800,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                mb: 2,
              }}
            >
              Food Delivery &amp; Subscription
            </Typography>

            <Typography
              component="h1"
              sx={{
                color: DS.ink,
                fontSize: { xs: "2.35rem", sm: "3rem", md: "3.25rem" },
                fontWeight: 800,
                lineHeight: 1.22,
                letterSpacing: "-.025em",
                maxWidth: 570,
              }}
            >
              อาหารดี ส่งถึงบ้าน
              <br />
              เพื่อสัตว์เลี้ยงที่คุณรัก
            </Typography>

            <Typography
              sx={{
                mt: 2.5,
                color: "#5f5b59",
                fontSize: { xs: 15, md: 17 },
                fontWeight: 400,
                lineHeight: 1.65,
                maxWidth: 520,
              }}
            >
              คัดสรรอาหารคุณภาพ ส่งไวทั่วไทย
              <br />
              พร้อมจัดปริมาณและรอบส่งให้พอดีกับเค้า ไม่ซื้อเกินจำเป็น
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.75, mt: 3.5 }}>
              <Button
                onClick={handleLineLogin}
                disabled={isConnecting}
                disableElevation
                endIcon={<ArrowRight size={18} />}
                sx={{
                  bgcolor: "#F7947F",
                  color: DS.white,
                  borderRadius: DS.radius.pill,
                  px: 3.25,
                  py: 1.35,
                  minWidth: 148,
                  fontSize: 14,
                  "&:hover": { bgcolor: "#EE876F" },
                }}
              >
                {isConnecting ? "กำลังเชื่อมต่อ…" : "สั่งอาหารเลย"}
              </Button>
              <Button
                component="a"
                href="#promo"
                disableElevation
                sx={{
                  bgcolor: DS.white,
                  color: DS.ink,
                  border: "1.5px solid #77716E",
                  borderRadius: DS.radius.pill,
                  px: 3.25,
                  py: 1.35,
                  minWidth: 180,
                  fontSize: 14,
                  "&:hover": { borderColor: DS.ink, bgcolor: DS.white },
                }}
              >
                ดูแผน Subscription
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              position: "relative",
              minHeight: { xs: 350, sm: 460, md: 520 },
              alignSelf: "end",
            }}
          >
            <Image
              src="/images/banner11.webp"
              alt="สุนัข แมว และกล่องอาหารสัตว์คุณภาพ"
              width={800}
              height={600}
              priority
              draggable={false}
              style={{
                position: "absolute",
                zIndex: 1,
                width: "100%",
                maxWidth: "520px",
                height: "auto",
                left: "50%",
                transform: "translateX(-50%)",
                bottom: 0,
                objectFit: "contain",
                pointerEvents: "none",
                userSelect: "none",
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 3,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: { xs: 2, sm: 3 },
            maxWidth: { md: 650 },
            mt: { xs: 3, md: -7 },
            pb: { md: 3 },
          }}
        >
          {BENEFITS.map(({ icon: Icon, title, detail }) => (
            <Box key={title} sx={{ display: "flex", alignItems: "center", gap: 1.4 }}>
              <Icon size={34} color="#F49A87" strokeWidth={1.7} />
              <Typography sx={{ color: DS.ink, fontSize: 12.5, lineHeight: 1.45 }}>
                <Box
                  component="span"
                  sx={{
                    display: { xs: "inline", md: "block" },
                    fontWeight: 800,
                    mr: { xs: 1, md: 0 }
                  }}
                >
                  {title}
                </Box>
                <Box
                  component="span"
                  sx={{
                    color: "#5f5b59",
                    fontWeight: 500,
                    display: "inline"
                  }}
                >
                  {detail}
                </Box>
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};
