"use client";

import React from "react";
import Image from "next/image";
import { Box, Button, Container, Typography, Tooltip, Chip } from "@mui/material";
import { ArrowRight, Bookmark, MapPin, Waves, Trees, Coffee, Snowflake, Hotel } from "lucide-react";
import { DS } from "./DesignSystem";

interface PlacesProps {
  handleLineLogin: () => void;
}

const FACILITY_MAP: Record<string, { icon: React.ComponentType<any>; label: string }> = {
  pool: { icon: Waves, label: "มีสระว่ายน้ำ" },
  lawn: { icon: Trees, label: "มีสนามหญ้า/สวน" },
  cafe: { icon: Coffee, label: "มีคาเฟ่ให้บริการ" },
  air: { icon: Snowflake, label: "โซนห้องแอร์" },
  hotel: { icon: Hotel, label: "มีบริการที่พักสัตว์เลี้ยง" },
};

const PLACES = [
  {
    type: "คาเฟ่ Pet Friendly",
    title: "CRAFT คิมป์ตัน มาลัย",
    province: "กรุงเทพฯ",
    img: "/images/place4.png",
    facilities: ["cafe", "air"],
  },
  {
    type: "ที่เที่ยวธรรมชาติ",
    title: "อ่างเก็บน้ำห้วยตึงเฒ่า",
    province: "เชียงใหม่",
    img: "/images/place2.png",
    facilities: ["lawn"],
  },
  {
    type: "โรงแรม Pet Friendly",
    title: "อินเตอร์คอนติเนนตัล หัวหิน",
    province: "หัวหิน",
    img: "/images/place3.png",
    facilities: ["pool", "air", "hotel"],
  },
  {
    type: "กิจกรรม / ชายหาด",
    title: "หาดดงตาล พัทยา",
    province: "ชลบุรี",
    img: "/images/place1.png",
    facilities: ["pool", "lawn"],
  },
];

export const Places: React.FC<PlacesProps> = ({ handleLineLogin }) => {
  return (
    <Container
      maxWidth="lg"
      id="explore"
      sx={{
        py: { xs: 4, md: 5 },
        px: { xs: 2.5, sm: 3, lg: 1 },
        scrollMarginTop: "40px",
      }}
    >
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ color: "#EF917C", fontSize: 11, fontWeight: 800, letterSpacing: ".08em" }}>
            PET-FRIENDLY PLACES
          </Typography>
          <Typography
            component="h2"
            sx={{
              mt: 0.35,
              color: DS.ink,
              fontSize: { xs: 22, md: 27 },
              fontWeight: 900,
              letterSpacing: "-.025em",
            }}
          >
            สถานที่แนะนำ
          </Typography>
        </Box>
        <Button
          onClick={handleLineLogin}
          endIcon={<ArrowRight size={14} />}
          sx={{
            flexShrink: 0,
            color: DS.ink,
            bgcolor: "#FFF7F3",
            border: "1px solid #F4DED4",
            borderRadius: DS.radius.pill,
            px: { xs: 2, sm: 2.75 },
            py: { xs: 0.85, sm: 1 },
            fontSize: { xs: 11.5, sm: 13 },
            fontWeight: 600,
            transition: "all .3s ease",
            "&:hover": { bgcolor: "#FDEDE6", borderColor: DS.peach, transform: "translateY(-1.5px)" },
          }}
        >
          ดูสถานที่ทั้งหมด
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: { xs: 1.5, sm: 2, md: 2.25 },
        }}
      >
        {PLACES.map(({ type, title, province, img, facilities }) => (
          <Box
            component="button"
            type="button"
            key={title}
            onClick={handleLineLogin}
            sx={{
              appearance: "none",
              width: "100%",
              p: 0,
              overflow: "hidden",
              border: "1px solid #EEEAE7",
              borderRadius: { xs: "16px", md: "18px" },
              bgcolor: "#FFFEFC",
              color: DS.ink,
              fontFamily: "inherit",
              textAlign: "left",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(43,43,51,.045)",
              transition: "transform .2s, box-shadow .2s",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 12px 26px rgba(43,43,51,.09)",
              },
              "&:hover img": { transform: "scale(1.035)" },
              "&:focus-visible": { outline: `2px solid ${DS.peach}`, outlineOffset: 3 },
            }}
          >
            <Box sx={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden" }}>
              <Image
                src={img}
                alt={title}
                fill
                sizes="(max-width: 600px) 50vw, (max-width: 1200px) 50vw, 25vw"
                style={{ objectFit: "cover", transition: "transform .3s" }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: { xs: 8, md: 12 },
                  left: { xs: 8, md: 12 },
                  zIndex: 2,
                }}
              >
                <Chip
                  label={type}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    color: DS.peach,
                    fontWeight: 500,
                    fontSize: { xs: 9.5, md: 11 },
                    backdropFilter: "blur(4px)",
                    border: "1px solid #FFEBE5",
                    borderRadius: "100px",
                    height: { xs: 22, md: 26 },
                    px: { xs: 0.75, md: 1.25 },
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                position: "relative",
                px: { xs: 1.25, md: 1.5 },
                pt: 1.5,
                pb: 1.5,
                minHeight: { xs: 105, md: 118 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    pr: 3.25,
                    fontSize: { xs: 14, md: 16 },
                    fontWeight: 600,
                    lineHeight: 1.3,
                    minHeight: { xs: 36, md: 45 },
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    color: DS.ink,
                  }}
                >
                  {title}
                </Typography>
                <Box sx={{ mt: 0.85, display: "flex", alignItems: "center", gap: 0.5, color: "#5C5552" }}>
                  <MapPin size={13} color="#F28F7C" fill="#F28F7C" strokeWidth={2.0} />
                  <Typography sx={{ fontSize: { xs: 11, md: 12.5 }, fontWeight: 400 }}>{province}</Typography>
                </Box>
              </Box>

              {/* Facilities Row */}
              <Box sx={{ display: "flex", gap: 0.75, mt: 1.5, mb: 0 }}>
                {facilities.map((fac) => {
                  const info = FACILITY_MAP[fac];
                  if (!info) return null;
                  const Icon = info.icon;
                  return (
                    <Tooltip key={fac} title={info.label} arrow>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          bgcolor: "#F5F2EF",
                          color: "#4A4340",
                          border: "1px solid #E5DFD9",
                          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            bgcolor: DS.peach,
                            color: "#FFFFFF",
                            borderColor: DS.peach,
                            transform: "scale(1.12)",
                            boxShadow: "0 4px 10px rgba(239, 145, 124, 0.25)",
                          },
                        }}
                      >
                        <Icon size={14} strokeWidth={2.2} />
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  top: { xs: 14, md: 16 },
                  right: { xs: 8, md: 13 },
                  color: "#56535A",
                  display: "flex",
                }}
              >
                <Bookmark size={17} strokeWidth={1.8} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
};
