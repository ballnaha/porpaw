"use client";

import React from "react";
import Image from "next/image";
import { Box, Button, Container, Typography } from "@mui/material";
import { ArrowRight, Clock3, MapPin, ShieldCheck } from "lucide-react";
import { DS } from "./DesignSystem";

interface HealthcareProps {
  handleLineLogin: () => void;
}

export const Healthcare: React.FC<HealthcareProps> = ({ handleLineLogin }) => {
  return (
    <Container
      maxWidth="lg"
      id="care"
      sx={{
        pb: { xs: 5, md: 6 },
        px: { xs: 2.5, sm: 3, lg: 1 },
        scrollMarginTop: "40px",
      }}
    >
      <Box
        sx={{
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, .9fr) minmax(0, 1.1fr)" },
          minHeight: { md: 260 },
          border: "1px solid #E2EDE8",
          borderRadius: "26px",
          bgcolor: "#F2F8F5",
        }}
      >
        <Box sx={{ p: { xs: 3, md: 4 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, color: "#6BA58E" }}>
            <ShieldCheck size={17} strokeWidth={2} />
            <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: ".07em" }}>
              VET &amp; CARE
            </Typography>
          </Box>
          <Typography
            component="h2"
            sx={{ mt: 1, color: DS.ink, fontSize: { xs: 24, md: 29 }, fontWeight: 900, letterSpacing: "-.025em" }}
          >
            สถานพยาบาลใกล้คุณ
          </Typography>
          <Typography sx={{ mt: 1, maxWidth: 420, color: "#69666B", fontSize: 13, lineHeight: 1.65 }}>
            ค้นหาโรงพยาบาลและคลินิกสัตว์ที่เชื่อถือได้ พร้อมข้อมูลเวลาเปิดและบริการฉุกเฉิน
          </Typography>
          <Button
            onClick={handleLineLogin}
            endIcon={<ArrowRight size={14} />}
            sx={{
              mt: 2.25,
              alignSelf: "flex-start",
              bgcolor: DS.ink,
              color: DS.white,
              borderRadius: DS.radius.pill,
              px: 2.5,
              py: 1,
              fontSize: 12,
              "&:hover": { bgcolor: "#17171C" },
            }}
          >
            ดูสถานพยาบาลทั้งหมด
          </Button>
        </Box>

        <Box sx={{ p: { xs: 2, md: 2.5 }, minWidth: 0 }}>
          <Box
            component="button"
            type="button"
            onClick={handleLineLogin}
            sx={{
              width: "100%",
              height: "100%",
              minHeight: 220,
              position: "relative",
              overflow: "hidden",
              border: 0,
              borderRadius: "20px",
              bgcolor: DS.white,
              cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "left",
            }}
          >
            <Image
              src="/place_hospital.png"
              alt="Paw Care Animal Hospital"
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
              style={{ objectFit: "cover" }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: "auto 0 0",
                p: 2,
                color: DS.white,
                background: "linear-gradient(transparent, rgba(25,31,29,.78))",
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 900 }}>Paw Care Animal Hospital</Typography>
              <Box sx={{ mt: 0.75, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <MapPin size={13} fill="#F49A87" color="#F49A87" />
                  <Typography sx={{ fontSize: 10.5, fontWeight: 600 }}>กรุงเทพฯ · 2.4 กม.</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Clock3 size={13} color="#A8D6BE" />
                  <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: "#C9F0DC" }}>เปิด 24 ชั่วโมง</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
