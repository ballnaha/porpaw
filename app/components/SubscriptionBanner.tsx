"use client";

import React from "react";
import Image from "next/image";
import { Box, Container, Typography, Button } from "@mui/material";
import { Check, ArrowRight, Sparkles, Crown, Gem, SlidersHorizontal } from "lucide-react";
import { DS } from "./DesignSystem";

interface SubscriptionBannerProps {
  handleLineLogin: () => void;
}

const CHECKS = ["ประหยัดสูงสุด 20%", "ส่งฟรีทุกกล่อง", "ยืดหยุ่น ไม่ผูกมัด"];

const PLANS = [
  {
    icon: Sparkles,
    badge: null,
    title: "Starter",
    detail: "เหมาะสำหรับเริ่มต้นทดลอง",
    save: "ประหยัด 5%",
    saveColor: DS.mintDeep,
    highlight: false,
    custom: false,
  },
  {
    icon: Crown,
    badge: "ยอดนิยม",
    title: "Pawrents' Choice",
    detail: "คุ้มที่สุดสำหรับดูแลทุกวัน",
    save: "ประหยัด 15%",
    saveColor: DS.peach,
    highlight: true,
    custom: false,
  },
  {
    icon: Gem,
    badge: null,
    title: "Ultimate Care",
    detail: "ดูแลครบ ครอบคลุมโภชนาการ",
    save: "ประหยัด 20%",
    saveColor: DS.mintDeep,
    highlight: false,
    custom: false,
  },
  {
    icon: SlidersHorizontal,
    badge: null,
    title: "จัดกล่องเอง",
    detail: "เลือกสินค้าที่เค้าชอบ ส่วนลดตามจริง",
    save: "ปรับได้",
    saveColor: DS.gray,
    highlight: false,
    custom: true,
  },
];

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({
  handleLineLogin,
}) => {
  return (
    <Container
      maxWidth="lg"
      id="promo"
      sx={{ py: { xs: 3, md: 4 }, px: { xs: 2.5, sm: 3, lg: 1 }, scrollMarginTop: "40px" }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          bgcolor: DS.peachBg,
          background: `linear-gradient(135deg, #FDF0E8 0%, ${DS.peachSoft} 100%)`,
          borderRadius: "28px",
          p: { xs: 2.5, md: 3 },
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "minmax(0, 1fr) minmax(0, 1.05fr)",
            lg: "minmax(0, 0.8fr) minmax(0, 1.3fr) minmax(0, 0.9fr)",
          },
          alignItems: "center",
          gap: { xs: 2.5, lg: 2 },
        }}
      >
        {/* ── Left · copy + CTA ── */}
        <Box sx={{ maxWidth: 340 }}>
          <Typography
            sx={{
              fontSize: { xs: 28, md: 33 },
              fontWeight: 700,
              color: DS.ink,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            สมัครสมาชิก ประหยัดกว่า
          </Typography>
          <Typography
            sx={{
              fontSize: 16,
              color: "#6b5f59",
              fontWeight: 400,
              mt: 1.5,
              lineHeight: 1.6,
            }}
          >
            แผนที่ยืดหยุ่นตามความต้องการของเค้า
            <br />
            หยุด ข้าม หรือยกเลิกได้ทุกเมื่อ
          </Typography>

          <Box sx={{ display: "grid", gap: 1.1, mt: 2.75 }}>
            {CHECKS.map((c) => (
              <Box key={c} sx={{ display: "flex", alignItems: "center", gap: 1.15 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: `1.5px solid ${DS.mintDeep}`,
                    color: DS.mintDeep,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Check size={11} strokeWidth={3} />
                </Box>
                <Typography sx={{ fontSize: 14.5, fontWeight: 500, color: DS.ink }}>
                  {c}
                </Typography>
              </Box>
            ))}
          </Box>

          <Button
            onClick={handleLineLogin}
            disableElevation
            endIcon={<ArrowRight size={17} strokeWidth={2.5} />}
            sx={{
              mt: 3.25,
              bgcolor: DS.peach,
              color: DS.white,
              borderRadius: DS.radius.pill,
              px: 3.5,
              py: 1.4,
              fontSize: 15.5,
              fontWeight: 600,
              minWidth: 190,
              justifyContent: "space-between",
              transition: "transform .2s, box-shadow .2s",
              "&:hover": {
                bgcolor: "#EE876F",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 26px rgba(238,135,111,.32)",
              },
            }}
          >
            ดูแผนทั้งหมด
          </Button>
        </Box>

        {/* ── Center · product box ── */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1",
            maxWidth: { xs: 300, md: 420 },
            maxHeight: { xs: 300, md: 420 },
            mx: "auto",
            mt: { md: -3 },
            mb: { md: -3 },
            alignSelf: { md: "end" },
            order: { xs: -1, md: 0 },
          }}
        >
          <Image
            src="/images/box4.webp"
            alt="กล่องอาหารและขนมสัตว์เลี้ยง Porpaw"
            fill
            sizes="(max-width: 900px) 300px, 420px"
            priority
            style={{ objectFit: "contain", objectPosition: "center bottom" }}
          />
        </Box>

        {/* ── Right · plan cards ── */}
        <Box sx={{ display: "grid", gap: 1.25 }}>
          {PLANS.map((p) => {
            const Icon = p.icon;
            return (
              <Box
                key={p.title}
                onClick={p.custom ? handleLineLogin : undefined}
                role={p.custom ? "button" : undefined}
                tabIndex={p.custom ? 0 : undefined}
                sx={{
                  position: "relative",
                  bgcolor: p.custom ? "transparent" : DS.white,
                  borderRadius: "18px",
                  border: p.highlight
                    ? `1.5px solid ${DS.peach}`
                    : p.custom
                      ? `1.5px dashed ${DS.peach}`
                      : "1.5px solid transparent",
                  p: "15px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  cursor: p.custom ? "pointer" : "default",
                  boxShadow: p.highlight
                    ? "0 14px 30px rgba(245,153,127,.18)"
                    : p.custom
                      ? "none"
                      : "0 8px 20px rgba(43,43,51,.06)",
                  transition: "transform .2s, box-shadow .2s, border-color .2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: p.custom
                      ? "0 10px 24px rgba(245,153,127,.14)"
                      : "0 16px 32px rgba(43,43,51,.12)",
                    borderColor: p.custom ? DS.peach : undefined,
                    bgcolor: p.custom ? "rgba(255,255,255,.5)" : undefined,
                  },
                  "&:focus-visible": {
                    outline: `2px solid ${DS.peach}`,
                    outlineOffset: 2,
                  },
                }}
              >
                {/* Floating "popular" badge */}
                {p.badge && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -9,
                      left: 16,
                      bgcolor: DS.peach,
                      color: DS.white,
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: ".04em",
                      px: 1.15,
                      py: "3px",
                      borderRadius: DS.radius.pill,
                      boxShadow: "0 4px 10px rgba(245,153,127,.35)",
                    }}
                  >
                    {p.badge}
                  </Box>
                )}

                {/* Icon chip */}
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "12px",
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: p.highlight
                      ? DS.peach
                      : p.custom
                        ? "transparent"
                        : DS.peachSoft,
                    border: p.custom ? `1.5px dashed ${DS.peach}` : "none",
                    color: p.highlight ? DS.white : DS.peach,
                  }}
                >
                  <Icon size={18} strokeWidth={2.2} />
                </Box>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: DS.ink, lineHeight: 1.25 }}>
                    {p.title}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 12.5, color: DS.gray, fontWeight: 400, mt: 0.2, lineHeight: 1.35 }}
                  >
                    {p.detail}
                  </Typography>
                </Box>

                {p.custom ? (
                  <ArrowRight size={17} strokeWidth={2.5} color={DS.peach} style={{ flexShrink: 0 }} />
                ) : (
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: p.saveColor,
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.save}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Container>
  );
};
