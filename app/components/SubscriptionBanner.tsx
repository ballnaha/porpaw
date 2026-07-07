"use client";

import React from "react";
import Image from "next/image";
import { Box, Container, Typography, Button } from "@mui/material";
import { Check, ArrowRight, CalendarClock, PackageCheck, CalendarRange, SlidersHorizontal } from "lucide-react";
import { DS } from "./DesignSystem";

interface SubscriptionBannerProps {
  handleLineLogin: () => void;
  calculatedGrams?: number | null;
  species?: "dog" | "cat";
}

const CHECKS = [
  "สะสมแต้มทุกกล่อง ยิ่งอยู่นานสิทธิพิเศษยิ่งเพิ่มขึ้น",
  "สั่งต่อเนื่องครบ 3 รอบ รับของขวัญพรีเมียมเฉพาะตัว",
  "แจ้งเตือนก่อนส่ง เลื่อนวันหรือปรับสูตรได้ตลอดผ่าน LINE",
];

const PLANS = [
  {
    icon: CalendarClock,
    badge: null,
    title: "Paw-Lite",
    detail: "รอบส่งทุก 15 วัน · อาหารสดใหม่ไม่ค้างกระสอบ เหมาะสำหรับเริ่มต้น",
    save: "ชิมลาง",
    saveColor: DS.mintDeep,
    highlight: false,
    custom: false,
  },
  {
    icon: PackageCheck,
    badge: "แนะนำสุดคุ้ม",
    title: "Paw-Fit",
    detail: "รอบส่งทุก 30 วัน · ปริมาณพอดีกินจริง 100% หมดกังวลเหลือทิ้ง",
    save: "ยอดนิยม",
    saveColor: DS.peach,
    highlight: true,
    custom: false,
  },
  {
    icon: CalendarRange,
    badge: null,
    title: "Paw-Max",
    detail: "รอบส่งทุก 45 วัน · ขนาดกล่องใหญ่ ลดรอบการส่ง เซฟค่าส่งในระยะยาว",
    save: "ประหยัดสุด",
    saveColor: DS.mintDeep,
    highlight: false,
    custom: false,
  },
  {
    icon: SlidersHorizontal,
    badge: null,
    title: "Paw-Mix",
    detail: "เลือกสินค้า ปริมาณ และความถี่จัดส่งเอง ปรับผ่าน LINE ได้ตลอด",
    save: "ยืดหยุ่นสูง",
    saveColor: DS.gray,
    highlight: false,
    custom: true,
  },
];

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({
  handleLineLogin,
  calculatedGrams,
  species = "dog",
}) => {
  const dynamicPlans = React.useMemo(() => {
    if (!calculatedGrams) return PLANS;

    return PLANS.map((p) => {
      if (p.title === "Paw-Lite") {
        return {
          ...p,
          detail: `จัดส่งรอบละ ${(calculatedGrams / 2 / 1000).toFixed(1)} กก. · สดใหม่ไม่ค้างกระสอบ`,
        };
      }
      if (p.title === "Paw-Fit") {
        return {
          ...p,
          detail: `จัดส่งรอบละ ${(calculatedGrams / 1000).toFixed(1)} กก. · พอดีกินจริง 100% ไร้ของเหลือ`,
        };
      }
      if (p.title === "Paw-Max") {
        return {
          ...p,
          detail: `จัดส่งรอบละ ${(calculatedGrams * 1.5 / 1000).toFixed(1)} กก. · ส่งรอบใหญ่ คุ้มค่าส่งที่สุด`,
        };
      }
      return p;
    });
  }, [calculatedGrams]);

  const handlePlanClick = (p: typeof PLANS[0]) => {
    if (typeof window !== "undefined") {
      const gParam = calculatedGrams ? `&grams=${calculatedGrams}` : "";
      window.location.href = `/configure?plan=${p.title}&species=${species}${gParam}`;
    }
  };

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
            md: "minmax(0, 1fr minmax(0, 1.05fr))",
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
            ดูแลต่อเนื่อง ได้มากกว่าทุกกล่อง
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
            จัดปริมาณตามที่กินจริง หมดกังวลเรื่องอาหารเหลือทิ้ง (Zero Waste)
            <br />
            พร้อมสิทธิพิเศษและของขวัญที่เพิ่มขึ้นเมื่อดูแลต่อเนื่อง
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
            onClick={() => {
              if (typeof window !== "undefined") {
                const gParam = calculatedGrams ? `&grams=${calculatedGrams}` : "";
                window.location.href = `/configure?plan=Paw-Fit&species=${species}${gParam}`;
              }
            }}
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
            เริ่มเป็นสมาชิก
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
          {dynamicPlans.map((p) => {
            const Icon = p.icon;
            return (
              <Box
                key={p.title}
                onClick={() => handlePlanClick(p)}
                role="button"
                tabIndex={0}
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
                  cursor: "pointer",
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
