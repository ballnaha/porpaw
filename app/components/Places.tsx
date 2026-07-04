"use client";

import React from "react";
import Image from "next/image";
import { Box, Button, Container, Typography } from "@mui/material";
import { ArrowRight, Bookmark, MapPin } from "lucide-react";
import { DS } from "./DesignSystem";

interface PlacesProps {
  handleLineLogin: () => void;
}

const PLACES = [
  {
    type: "Pet Friendly Cafe",
    title: "Paw Around Cafe",
    province: "กรุงเทพฯ",
    img: "/place_travel.png",
  },
  {
    type: "ที่เที่ยวธรรมชาติ",
    title: "Dog Hill",
    province: "เชียงใหม่",
    img: "/service_places.png",
  },
  {
    type: "Pet Friendly Hotel",
    title: "The Barkley Lodge",
    province: "หัวหิน",
    img: "/place_hotel.png",
  },
  {
    type: "กิจกรรม",
    title: "Pet Swimming Club",
    province: "กรุงเทพฯ",
    img: "/place_travel.png",
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
            px: { xs: 1.75, sm: 2.25 },
            py: 0.85,
            fontSize: { xs: 10.5, sm: 12 },
            "&:hover": { bgcolor: "#FDEDE6", borderColor: DS.peach },
          }}
        >
          ดูสถานที่ทั้งหมด
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: { xs: 2, md: 2.25 },
        }}
      >
        {PLACES.map(({ type, title, province, img }) => (
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
              borderRadius: "18px",
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
            <Box sx={{ position: "relative", height: { xs: 145, md: 104 }, overflow: "hidden" }}>
              <Image
                src={img}
                alt={title}
                fill
                sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 25vw"
                style={{ objectFit: "cover", transition: "transform .3s" }}
              />
              <Box
                sx={{
                  position: "absolute",
                  left: 9,
                  bottom: -1,
                  px: 1.1,
                  py: 0.35,
                  bgcolor: "rgba(255,248,242,.96)",
                  borderRadius: "8px 8px 0 0",
                  color: "#6E6865",
                  fontSize: 9.5,
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                {type}
              </Box>
            </Box>

            <Box sx={{ position: "relative", px: 1.5, pt: 1.25, pb: 1.35, minHeight: 70 }}>
              <Typography sx={{ pr: 3, fontSize: 13, fontWeight: 800, lineHeight: 1.25 }}>
                {title}
              </Typography>
              <Box sx={{ mt: 0.75, display: "flex", alignItems: "center", gap: 0.45, color: DS.gray }}>
                <MapPin size={12} color="#F28F7C" fill="#F28F7C" strokeWidth={1.5} />
                <Typography sx={{ fontSize: 10, fontWeight: 500 }}>{province}</Typography>
              </Box>
              <Bookmark
                size={17}
                strokeWidth={1.5}
                style={{ position: "absolute", top: 14, right: 13, color: "#56535A" }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
};
