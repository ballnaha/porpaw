"use client";

import React from "react";
import Image from "next/image";
import { Box, Container, Typography, Button, IconButton } from "@mui/material";
import { Check, ArrowRight, ShoppingCart, Plus } from "lucide-react";
import { DS } from "./DesignSystem";

interface PromoTrioProps {
  handleLineLogin: () => void;
}

const CHECKS = ["Save up to 20%", "Free delivery", "Flexible schedule"];
const FREQ = [
  { n: "1", unit: "Week" },
  { n: "2", unit: "Weeks", sel: true },
  { n: "1", unit: "Month" },
];
const BUILD_ITEMS = ["/service_delivery.png", "/service_subscription.png", "/service_treats.png"];

const darkPill = {
  bgcolor: DS.ink,
  color: DS.white,
  borderRadius: DS.radius.pill,
  px: 3,
  py: 1.4,
  fontSize: 13.5,
  fontWeight: 800,
  transition: "transform .2s, box-shadow .2s",
  "&:hover": {
    bgcolor: DS.ink,
    transform: "translateY(-2px)",
    boxShadow: "0 10px 24px rgba(43,43,51,.22)",
  },
} as const;

export const PromoTrio: React.FC<PromoTrioProps> = ({ handleLineLogin }) => {
  return (
    <Container maxWidth="lg" id="promo" sx={{ py: { xs: 3, md: 4 }, scrollMarginTop: "40px" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "repeat(2, minmax(0, 1fr))",
            lg: "minmax(0, 1.15fr) minmax(0, 1fr) minmax(0, 0.95fr)",
          },
          gap: 2.5,
          alignItems: "stretch",
        }}
      >
        {/* ── 1 · Subscribe & Save ── */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            bgcolor: DS.lavenderSoft,
            borderRadius: "28px",
            p: 3.5,
            minHeight: 380,
          }}
        >
          <Box sx={{ position: "relative", zIndex: 2, maxWidth: 200 }}>
            <Typography sx={{ fontSize: 24, fontWeight: 900, color: DS.ink, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
              Subscribe &amp; Save
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#5b5b64", fontWeight: 700, mt: 1.5, lineHeight: 1.5 }}>
              Never run out of what your pet loves.
            </Typography>
            <Box sx={{ display: "grid", gap: 1.1, mt: 2 }}>
              {CHECKS.map((c) => (
                <Box key={c} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      bgcolor: DS.mintDeep,
                      color: DS.white,
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Check size={11} strokeWidth={3} />
                  </Box>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: DS.ink }}>{c}</Typography>
                </Box>
              ))}
            </Box>
            <Button
              onClick={handleLineLogin}
              disableElevation
              endIcon={<ArrowRight size={15} strokeWidth={2.5} />}
              sx={{ ...darkPill, mt: 3 }}
            >
              Start Subscribing
            </Button>
          </Box>

          {/* Dog photo */}
          <Box
            sx={{
              position: "absolute",
              right: { xs: -18, md: -24 },
              top: { xs: 8, md: 18 },
              width: { xs: 150, md: 200 },
              height: { xs: 150, md: 200 },
              zIndex: 1,
              opacity: 0.96,
              pointerEvents: "none",
            }}
          >
            <Image src="/service_delivery.png" alt="สุนัขรับกล่องพัสดุ" fill sizes="200px" style={{ objectFit: "contain" }} />
          </Box>

          {/* Deliver-every card */}
          <Box
            sx={{
              position: "absolute",
              right: { xs: 14, md: 20 },
              bottom: 20,
              zIndex: 3,
              bgcolor: DS.white,
              borderRadius: "18px",
              p: "12px 14px",
              boxShadow: "0 12px 28px rgba(43,43,51,.12)",
            }}
          >
            <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: DS.ink }}>Deliver every</Typography>
            <Box sx={{ display: "flex", gap: 0.85, mt: 1 }}>
              {FREQ.map((f, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 38,
                    height: 44,
                    borderRadius: "12px",
                    bgcolor: f.sel ? DS.lavender : DS.card,
                    color: f.sel ? DS.white : DS.gray,
                    display: "grid",
                    placeItems: "center",
                    textAlign: "center",
                    lineHeight: 1.1,
                  }}
                >
                  <Box>
                    <Box component="b" sx={{ fontSize: 14, color: f.sel ? DS.white : DS.ink, display: "block" }}>
                      {f.n}
                    </Box>
                    <Box component="span" sx={{ fontSize: 9, fontWeight: 800 }}>
                      {f.unit}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ── 2 · Popular Sets ── */}
        <Box sx={{ bgcolor: DS.card, borderRadius: "28px", p: 3.5, display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 24, fontWeight: 900, color: DS.ink, letterSpacing: "-0.01em" }}>
              Popular Sets
            </Typography>
            <Button
              onClick={handleLineLogin}
              disableElevation
              sx={{
                bgcolor: DS.white,
                border: `1px solid ${DS.line}`,
                borderRadius: DS.radius.pill,
                px: 2,
                py: 0.75,
                fontSize: 11.5,
                fontWeight: 800,
                color: DS.ink,
                "&:hover": { bgcolor: DS.white, borderColor: DS.ink },
              }}
            >
              View All
            </Button>
          </Box>

          <Box
            sx={{
              mt: 2.25,
              borderRadius: "20px",
              height: 180,
              background: "linear-gradient(145deg,#FBEFE4,#F3E2CE)",
              display: "grid",
              placeItems: "center",
              overflow: "hidden",
            }}
          >
            <Box sx={{ position: "relative", width: "82%", height: "88%" }}>
              <Image src="/service_subscription.png" alt="กล่องเซ็ตสินค้าสัตว์เลี้ยง" fill sizes="300px" style={{ objectFit: "contain" }} />
            </Box>
          </Box>

          <Box sx={{ mt: 2, display: "flex", alignItems: "flex-end", gap: 1.5 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 900, color: DS.ink }}>Puppy Starter Set</Typography>
              <Typography sx={{ fontSize: 12, color: DS.gray, fontWeight: 700, mt: 0.5, lineHeight: 1.4 }}>
                Everything they need to start strong!
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 900, color: DS.ink, mt: 1 }}>฿1,290</Typography>
            </Box>
            <IconButton
              aria-label="เพิ่มลงตะกร้า"
              onClick={handleLineLogin}
              sx={{
                width: 52,
                height: 52,
                bgcolor: DS.peach,
                color: DS.white,
                transition: "transform .2s",
                "&:hover": { bgcolor: DS.peach, transform: "scale(1.08)" },
              }}
            >
              <ShoppingCart size={19} strokeWidth={2} />
            </IconButton>
          </Box>
        </Box>

        {/* ── 3 · Build Your Own Set ── */}
        <Box
          sx={{
            bgcolor: DS.mint,
            borderRadius: "28px",
            p: 3.5,
            display: "flex",
            flexDirection: "column",
            gridColumn: { md: "1 / -1", lg: "auto" },
          }}
        >
          <Typography sx={{ fontSize: 24, fontWeight: 900, color: DS.ink, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
            Build Your
            <br />
            Own Set
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#5b5b64", fontWeight: 700, mt: 1.5, lineHeight: 1.5 }}>
            Mix and match your pet&apos;s favorites.
          </Typography>
          <Button
            onClick={handleLineLogin}
            disableElevation
            endIcon={<ArrowRight size={15} strokeWidth={2.5} />}
            sx={{ ...darkPill, mt: 3, alignSelf: "flex-start" }}
          >
            Start Building
          </Button>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: "auto", pt: 3.5 }}>
            {BUILD_ITEMS.map((src, i) => (
              <React.Fragment key={src}>
                <Box
                  sx={{
                    width: 62,
                    height: 62,
                    borderRadius: "50%",
                    bgcolor: DS.white,
                    boxShadow: "0 8px 18px rgba(43,43,51,.07)",
                    overflow: "hidden",
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  <Image src={src} alt="สินค้าสำหรับจัดเซ็ต" fill sizes="62px" style={{ objectFit: "cover" }} />
                </Box>
                {i < BUILD_ITEMS.length - 1 && (
                  <Plus size={16} color={DS.mintDeep} strokeWidth={3} style={{ flexShrink: 0 }} />
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
