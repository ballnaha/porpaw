"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Box, Button, Container, Typography, IconButton, Chip } from "@mui/material";
import { ArrowRight, Heart, MapPin, Star, ShieldCheck } from "lucide-react";
import { DS } from "./DesignSystem";

interface HealthcareProps {
  handleLineLogin: () => void;
}

const SERVICES = [
  {
    category: "clinic",
    type: "โรงพยาบาลสัตว์ 24 ชม.",
    title: "รพ.สัตว์พอว์แคร์",
    province: "กรุงเทพฯ",
    distance: "2.4 กม.",
    img: "/place_hospital.png",
    rating: 4.9,
    reviews: 148,
    status: "เปิดอยู่ (24 ชม.)",
    tags: ["มีหมอเฉพาะทาง", "ห้องฉุกเฉิน"],
    featured: true,
  },
  {
    category: "grooming",
    type: "อาบน้ำ & ตัดขน",
    title: "แฮร์รี่เทล กรูมมิ่งสปา",
    province: "กรุงเทพฯ",
    distance: "1.8 กม.",
    img: "/service_treats.png",
    rating: 4.8,
    reviews: 92,
    status: "เปิดอยู่ (ปิด 20:00)",
    tags: ["สปาโอโซน", "ตัดแต่งสไตล์เกาหลี"],
    featured: false,
  },
  {
    category: "hotel",
    type: "โรงแรมรับฝากเลี้ยง",
    title: "โรงแรมสัตว์เลี้ยงโคซี่พาวส์",
    province: "นนทบุรี",
    distance: "3.5 กม.",
    img: "/place_hotel.png",
    rating: 4.9,
    reviews: 76,
    status: "เปิดอยู่ (ปิด 19:00)",
    tags: ["CCTV 24 ชม.", "สนามวิ่งเล่นแอร์"],
    featured: true,
  },
  {
    category: "rehab",
    type: "คลินิกกายภาพสัตว์เลี้ยง",
    title: "คลินิกกายภาพ ดร.เพ็ท",
    province: "กรุงเทพฯ",
    distance: "4.2 กม.",
    img: "/place_travel.png",
    rating: 4.7,
    reviews: 58,
    status: "เปิดอยู่ (ปิด 18:00)",
    tags: ["วารีบำบัด", "ตรวจข้อสะโพก"],
    featured: false,
  },
];

export const Healthcare: React.FC<HealthcareProps> = ({ handleLineLogin }) => {
  const [likedServices, setLikedServices] = useState<Record<string, boolean>>({});

  const toggleLike = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    setLikedServices((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <Container
      maxWidth="lg"
      id="care"
      sx={{
        py: { xs: 6, md: 8 },
        px: { xs: 2.5, sm: 3, lg: 1 },
        scrollMarginTop: "40px",
      }}
    >
      {/* Header section */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "flex-end" },
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <ShieldCheck size={16} color="#6BA58E" />
            <Typography
              sx={{
                color: "#6BA58E",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            >
              Vet &amp; Health Services
            </Typography>
          </Box>
          <Typography
            component="h2"
            sx={{
              color: DS.ink,
              fontSize: { xs: 28, md: 34 },
              fontWeight: 900,
              letterSpacing: "-.025em",
              lineHeight: 1.2,
            }}
          >
            บริการสุขภาพและกรูมมิ่งแนะนำ
          </Typography>
          <Typography sx={{ color: DS.gray, mt: 1, fontSize: { xs: 14, md: 15 } }}>
            โรงพยาบาลสัตว์ คลินิกกายภาพ และสปาอาบน้ำตัดขนระดับพรีเมียมที่ผ่านการคัดสรร
          </Typography>
        </Box>
        <Button
          onClick={handleLineLogin}
          endIcon={<ArrowRight size={14} />}
          sx={{
            flexShrink: 0,
            color: "#FFF",
            bgcolor: "#6BA58E",
            borderRadius: DS.radius.pill,
            px: { xs: 2, sm: 2.75 },
            py: { xs: 0.85, sm: 1 },
            fontSize: { xs: 11.5, sm: 13 },
            fontWeight: 600,
            boxShadow: "0 6px 20px rgba(107, 165, 142, 0.2)",
            transition: "all .3s ease",
            "&:hover": {
              bgcolor: "#568B75",
              boxShadow: "0 8px 24px rgba(86, 139, 117, 0.3)",
              transform: "translateY(-1.5px)",
            },
          }}
        >
          ดูบริการทั้งหมด
        </Button>
      </Box>

      {/* Services Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: { xs: 1.5, sm: 2.5, md: 3 },
        }}
      >
        {SERVICES.map(({ category, type, title, province, distance, img, rating, reviews, status, tags, featured }) => (
          <Box
            component="div"
            key={title}
            onClick={handleLineLogin}
            sx={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid #E6EEEC",
              borderRadius: { xs: "16px", md: "24px" },
              bgcolor: "#FFFFFF",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(43,43,51,.025)",
              transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: "0 22px 45px rgba(43,43,51,.08)",
                borderColor: "#BDD4CD",
              },
              "&:hover img": { transform: "scale(1.05)" },
            }}
          >
            {/* Image Area */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/10",
                overflow: "hidden",
                borderRadius: { xs: "16px 16px 0 0", md: "24px 24px 0 0" },
              }}
            >
              <Image
                src={img}
                alt={title}
                fill
                sizes="(max-width: 600px) 50vw, (max-width: 1200px) 50vw, 25vw"
                style={{ objectFit: "cover", transition: "transform .4s ease" }}
              />

              {/* Gradient overlay */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)",
                }}
              />

              {/* Top Bar Badges */}
              <Box
                sx={{
                  position: "absolute",
                  top: { xs: 8, md: 14 },
                  left: { xs: 8, md: 14 },
                  right: { xs: 8, md: 14 },
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                {/* Type Badge */}
                <Chip
                  label={type}
                  size="small"
                  sx={{
                    bgcolor: featured ? "rgba(236, 253, 245, 0.95)" : "rgba(255, 255, 255, 0.9)",
                    color: featured ? "#047857" : DS.ink,
                    fontWeight: 500,
                    fontSize: { xs: 9.5, md: 11 },
                    backdropFilter: "blur(4px)",
                    border: featured ? "1px solid rgba(167, 243, 208, 0.5)" : "none",
                    height: { xs: 22, md: 26 },
                    px: { xs: 0.75, md: 1.25 },
                  }}
                />

                {/* Like Button */}
                <IconButton
                  size="small"
                  onClick={(e) => toggleLike(e, title)}
                  sx={{
                    pointerEvents: "auto",
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    color: likedServices[title] ? "#E11D48" : "#8B8B95",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                    transition: "all 0.2s ease",
                    width: { xs: 24, md: 32 },
                    height: { xs: 24, md: 32 },
                    "&:hover": {
                      bgcolor: "#FFF",
                      color: "#E11D48",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <Heart size={14} fill={likedServices[title] ? "#E11D48" : "none"} strokeWidth={likedServices[title] ? 0 : 2} />
                </IconButton>
              </Box>

              {/* Status Badge (Blinking dot) */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: { xs: 8, md: 12 },
                  left: { xs: 8, md: 14 },
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  bgcolor: "rgba(15, 23, 42, 0.75)",
                  backdropFilter: "blur(4px)",
                  px: { xs: 1, md: 1.5 },
                  py: 0.35,
                  borderRadius: "20px",
                }}
              >
                <Box
                  sx={{
                    width: { xs: 5, md: 7 },
                    height: { xs: 5, md: 7 },
                    borderRadius: "50%",
                    bgcolor: "#10B981",
                    position: "relative",
                    "@keyframes pulse": {
                      "0%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(16, 185, 129, 0.7)" },
                      "70%": { transform: "scale(1)", boxShadow: "0 0 0 6px rgba(16, 185, 129, 0)" },
                      "100%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(16, 185, 129, 0)" },
                    },
                    animation: "pulse 1.8s infinite ease-in-out",
                  }}
                />
                <Typography sx={{ color: "#FFF", fontSize: { xs: 8.5, md: 10 }, fontWeight: 700 }}>
                  {status}
                </Typography>
              </Box>
            </Box>

            {/* Content Area */}
            <Box sx={{ p: { xs: 1.5, md: 2.5 }, display: "flex", flexDirection: "column", flexGrow: 1 }}>
              {/* Rating & Reviews */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.75 }}>
                <Star size={12} fill={DS.yellow} color={DS.yellow} />
                <Typography sx={{ fontSize: { xs: 10.5, md: 12 }, fontWeight: 600, color: DS.ink }}>
                  {rating.toFixed(1)}
                </Typography>
                <Typography sx={{ fontSize: { xs: 10, md: 11.5 }, color: DS.gray }}>
                  ({reviews} รีวิว)
                </Typography>
              </Box>

              {/* Title */}
              <Typography
                sx={{
                  fontSize: { xs: 14, md: 16 },
                  fontWeight: 600,
                  color: DS.ink,
                  mb: { xs: 0.75, md: 1.25 },
                  lineHeight: 1.3,
                  minHeight: { xs: 36, md: 45 },
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {title}
              </Typography>

              {/* Specific tags */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: { xs: 1.5, md: 2 } }}>
                {tags.map((tag) => (
                  <Box
                    key={tag}
                    sx={{
                      bgcolor: "#F0F8F5",
                      color: "#059669",
                      fontSize: { xs: 8.5, md: 10 },
                      fontWeight: 700,
                      px: { xs: 0.8, md: 1.2 },
                      py: { xs: 0.25, md: 0.4 },
                      borderRadius: "6px",
                      border: "1px solid #D1EAE0",
                    }}
                  >
                    {tag}
                  </Box>
                ))}
              </Box>

              {/* Divider */}
              <Box sx={{ width: "100%", height: "1px", bgcolor: "#E6EEEC", my: { xs: 1, md: 1.5 }, opacity: 0.5 }} />

              {/* Footer row (Location & Action) */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: "auto",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.35, color: DS.gray }}>
                  <MapPin size={13} color="#6BA58E" fill="#6BA58E" strokeWidth={1.5} />
                  <Typography sx={{ fontSize: { xs: 11, md: 12.5 }, fontWeight: 400, color: DS.ink }}>
                    {province} <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>· {distance}</Box>
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: 9.5, md: 11 },
                    fontWeight: 800,
                    color: "#6BA58E",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.25,
                    transition: "color 0.2s",
                    "&:hover": { color: "#568B75" },
                  }}
                >
                  จองบริการ <ArrowRight size={10} />
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
};
