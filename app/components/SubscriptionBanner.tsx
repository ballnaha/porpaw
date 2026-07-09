"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Container, Typography } from "@mui/material";
import {
  ArrowRight,
  Check,
  Crown,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { DS } from "./DesignSystem";
import { SUBSCRIPTION_TIERS } from "../lib/subscriptionPricing";
import type { SubscriptionPlanName } from "../lib/subscriptionPricing";

interface SubscriptionBannerProps {
  handleLineLogin: () => void;
  calculatedGrams?: number | null;
  species?: "dog" | "cat";
  nutrition?: {
    dailyGrams: number;
    dailyKcal: number;
    recommendedPlan: SubscriptionPlanName;
  } | null;
}

const BENEFITS = ["รอบส่ง 1 เดือน", "เลือกเกรดอาหาร", "เลือกสูตรดูแล"];
const TIER_ICONS = [PackageCheck, Crown, ShieldCheck] as const;

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({
  handleLineLogin,
  species = "dog",
  nutrition,
}) => {
  const router = useRouter();

  const plans = React.useMemo(
    () =>
      SUBSCRIPTION_TIERS.map((plan, index) => ({
        ...plan,
        icon: TIER_ICONS[index] ?? PackageCheck,
        title: plan.name,
        highlight: nutrition ? plan.name === nutrition.recommendedPlan : plan.name === "Plus",
        amount: nutrition ? `จัดชุดเกรด ${plan.name} สำหรับ 1 เดือน` : null,
        calculatedPrice: plan.price,
      })),
    [nutrition],
  );

  const selectPlan = (title: string) => {
    router.push(`/configure?plan=${title}&species=${species}`);
  };

  return (
    <Container
      maxWidth="lg"
      id="promo"
      sx={{ py: { xs: 3, md: 5 }, px: { xs: 2.5, sm: 3, lg: 1 }, scrollMarginTop: 40 }}
    >
      <Box
        component="section"
        aria-labelledby="subscription-title"
        sx={{
          bgcolor: "#FBFAF8",
          border: `1px solid ${DS.line}`,
          borderRadius: { xs: "24px", md: "32px" },
          p: { xs: 2.25, sm: 3, md: 4 },
          boxShadow: "0 20px 60px rgba(43,43,51,.06)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "flex-end" },
            gap: 2.5,
            mb: { xs: 3, md: 3.5 },
          }}
        >
          <Box sx={{ maxWidth: 650 }}>
            <Typography
              sx={{
                color: "#B96449",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              Subscription
            </Typography>
            <Typography
              id="subscription-title"
              sx={{
                color: DS.ink,
                fontSize: { xs: 28, sm: 32, md: 36 },
                fontWeight: 700,
                letterSpacing: "-.025em",
                lineHeight: 1.15,
              }}
            >
              เลือกการดูแลที่พอดีกับน้อง
            </Typography>
            <Typography
              sx={{ color: "#68646A", fontSize: { xs: 14.5, md: 16 }, fontWeight: 400, mt: 1, lineHeight: 1.6 }}
            >
              รอบส่งมาตรฐาน 1 เดือน เลือกเกรดอาหารตามงบ แล้วเลือกสูตรดูแล เช่น บำรุงขน เสริมภูมิ คุมน้ำหนัก หรือแพ้ง่ายในขั้นตอนถัดไป
            </Typography>
          </Box>

          {nutrition ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, auto)",
                gap: "6px 18px",
                bgcolor: DS.white,
                border: `1px solid ${DS.line}`,
                borderRadius: "18px",
                px: 2,
                py: 1.5,
              }}
            >
              <Typography sx={{ color: DS.gray, fontSize: 11.5, fontWeight: 600 }}>พลังงาน / วัน</Typography>
              <Typography sx={{ color: DS.gray, fontSize: 11.5, fontWeight: 600 }}>อาหาร / วัน</Typography>
              <Typography sx={{ color: DS.ink, fontSize: 17, fontWeight: 800 }}>
                {nutrition.dailyKcal.toLocaleString()} kcal
              </Typography>
              <Typography sx={{ color: DS.ink, fontSize: 17, fontWeight: 800 }}>
                {nutrition.dailyGrams.toLocaleString()} กรัม
              </Typography>
              <Typography sx={{ gridColumn: "1 / -1", color: "#B96449", fontSize: 12.5, fontWeight: 700, mt: 0.25 }}>
                แนะนำเกรด {nutrition.recommendedPlan} สำหรับผลคำนวณนี้
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {BENEFITS.map((benefit) => (
                <Box
                  key={benefit}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.65,
                    bgcolor: DS.white,
                    border: `1px solid ${DS.line}`,
                    borderRadius: DS.radius.pill,
                    px: 1.25,
                    py: 0.75,
                  }}
                >
                  <Check size={13} strokeWidth={3} color="#60906F" />
                  <Typography sx={{ color: DS.ink, fontSize: 12.5, fontWeight: 600 }}>
                    {benefit}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 1.5 }}>
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Box
                key={plan.title}
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  bgcolor: plan.highlight ? DS.ink : DS.white,
                  color: plan.highlight ? DS.white : DS.ink,
                  border: plan.highlight ? `1px solid ${DS.ink}` : `1px solid ${DS.line}`,
                  borderRadius: "22px",
                  p: { xs: 2.25, md: 2.5 },
                  boxShadow: plan.highlight ? "0 18px 38px rgba(43,43,51,.18)" : "none",
                  transform: { md: plan.highlight ? "translateY(-6px)" : "none" },
                }}
              >
                {plan.highlight && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -12,
                      right: 18,
                      bgcolor: DS.peach,
                      color: DS.ink,
                      borderRadius: DS.radius.pill,
                      px: 1.4,
                      py: 0.5,
                      fontSize: 11,
                      fontWeight: 800,
                      boxShadow: "0 6px 16px rgba(245,185,155,.35)",
                    }}
                  >
                    {nutrition ? "เหมาะกับน้อง" : "แนะนำ"}
                  </Box>
                )}

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                        borderRadius: "13px",
                        bgcolor: plan.highlight ? "rgba(255,255,255,.12)" : DS.peachSoft,
                        color: plan.highlight ? DS.peach : "#C87559",
                      }}
                    >
                      <Icon size={20} strokeWidth={2.2} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 19, fontWeight: 800, lineHeight: 1.15 }}>
                        {plan.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: plan.highlight ? "rgba(255,255,255,.64)" : DS.gray,
                          fontSize: 12.5,
                          fontWeight: 600,
                          mt: 0.3,
                        }}
                      >
                        {plan.audience}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ color: plan.highlight ? DS.peach : "#B96449", fontSize: 12.5, fontWeight: 800 }}>
                    {plan.value}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75, mt: 2.5 }}>
                  <Typography sx={{ fontSize: { xs: 38, md: 42 }, fontWeight: 800, letterSpacing: "-.04em", lineHeight: 1 }}>
                    {plan.days}
                  </Typography>
                  <Typography sx={{ color: plan.highlight ? "rgba(255,255,255,.7)" : DS.gray, fontSize: 14, fontWeight: 600 }}>
                    วัน / รอบ
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    color: plan.highlight ? "rgba(255,255,255,.76)" : "#66616A",
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: 1.55,
                    mt: 1.25,
                    minHeight: { md: 44 },
                  }}
                >
                  {plan.amount ?? plan.detail}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: 1,
                    borderTop: `1px solid ${plan.highlight ? "rgba(255,255,255,.14)" : DS.line}`,
                    mt: 2,
                    pt: 1.75,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: plan.highlight ? "rgba(255,255,255,.58)" : DS.gray,
                        fontSize: 11.5,
                        fontWeight: 600,
                      }}
                      >
                      ราคาเริ่มต้น
                    </Typography>
                    <Typography sx={{ fontSize: 25, fontWeight: 800, letterSpacing: "-.025em", lineHeight: 1.15, mt: 0.2 }}>
                      ฿{plan.calculatedPrice.toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      color: plan.highlight ? "rgba(255,255,255,.58)" : DS.gray,
                      fontSize: 12,
                      fontWeight: 600,
                      mb: 0.25,
                    }}
                  >
                    / เดือน
                  </Typography>
                </Box>

                <Button
                  onClick={() => selectPlan(plan.title)}
                  endIcon={<ArrowRight size={16} strokeWidth={2.5} />}
                  disableElevation
                  sx={{
                    mt: 2.5,
                    bgcolor: plan.highlight ? DS.peach : "#F5F2EF",
                    color: DS.ink,
                    borderRadius: DS.radius.pill,
                    py: 1.1,
                    px: 2,
                    fontSize: 14,
                    fontWeight: 700,
                    "&:hover": { bgcolor: plan.highlight ? "#F1A986" : DS.peachSoft },
                  }}
                >
                  เลือก {plan.title}
                </Button>
              </Box>
            );
          })}
        </Box>

        <Typography sx={{ color: DS.gray, fontSize: 11.5, textAlign: "center", mt: 1.75 }}>
          *ทุกเกรดเป็นรอบ 1 เดือน สูตรดูแลจะแยกเลือกในหน้าจัดแพ็กเกจ
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
            mt: { xs: 2.5, md: 3 },
          }}
        >
          <Typography sx={{ color: DS.gray, fontSize: 13.5 }}>
            ยังไม่ตรงกับที่ต้องการ?
          </Typography>
          <Button
            onClick={handleLineLogin}
            variant="text"
            startIcon={<MessageCircle size={16} strokeWidth={2.2} />}
            endIcon={<ArrowRight size={14} strokeWidth={2.2} />}
            sx={{ color: DS.ink, fontSize: 13.5, fontWeight: 700, px: 1, py: 0.5 }}
          >
            จัดกล่องเฉพาะน้องผ่าน LINE
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
