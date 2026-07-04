import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { AtSign, Mail, MessageCircle, PawPrint } from "lucide-react";
import { DS } from "./DesignSystem";

const FOOTER_LINKS = [
  { label: "Shop", href: "#features" },
  { label: "Subscription", href: "#promo" },
  { label: "Places", href: "#explore" },
  { label: "Vet & Care", href: "#care" },
];

const SUPPORT_LINKS = [
  { label: "ช่วยเหลือ", href: "#top" },
  { label: "คำถามที่พบบ่อย", href: "#top" },
  { label: "ติดต่อเรา", href: "mailto:hello@porpaw.co" },
];

const linkStyle = {
  color: "#77737A",
  fontSize: 12,
  fontWeight: 600,
  textDecoration: "none",
  transition: "color .2s",
  "&:hover": { color: DS.ink },
} as const;

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: { xs: 2, md: 4 },
        borderTop: "1px solid #EEEAE7",
        bgcolor: "#FCFAF8",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3, lg: 1 }, pt: { xs: 4, md: 5 }, pb: 2.5 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "1.4fr .8fr .8fr 1fr" },
            gap: { xs: 4, md: 5 },
            pb: { xs: 4, md: 4.5 },
          }}
        >
          <Box sx={{ gridColumn: { xs: "1 / -1", md: "auto" }, maxWidth: 280 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
              <Typography sx={{ color: DS.ink, fontSize: 21, fontWeight: 900, letterSpacing: "-.025em" }}>
                Porpaw
              </Typography>
              <PawPrint size={17} fill={DS.ink} color={DS.ink} strokeWidth={2} />
            </Box>
            <Typography sx={{ mt: 1.25, color: "#77737A", fontSize: 12, lineHeight: 1.65 }}>
              อาหารและบริการที่คัดสรรมาเพื่อสุขภาพและความสุขของสัตว์เลี้ยงทุกตัว
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ mb: 1.5, color: DS.ink, fontSize: 12, fontWeight: 800 }}>บริการ</Typography>
            <Box sx={{ display: "grid", gap: 1 }}>
              {FOOTER_LINKS.map(({ label, href }) => (
                <Box component="a" href={href} key={label} sx={linkStyle}>
                  {label}
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography sx={{ mb: 1.5, color: DS.ink, fontSize: 12, fontWeight: 800 }}>ช่วยเหลือ</Typography>
            <Box sx={{ display: "grid", gap: 1 }}>
              {SUPPORT_LINKS.map(({ label, href }) => (
                <Box component="a" href={href} key={label} sx={linkStyle}>
                  {label}
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography sx={{ mb: 1.5, color: DS.ink, fontSize: 12, fontWeight: 800 }}>ติดตามเรา</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { label: "Social", icon: AtSign },
                { label: "Chat", icon: MessageCircle },
                { label: "Email", icon: Mail },
              ].map(({ label, icon: Icon }) => (
                <Box
                  component="a"
                  href={label === "Email" ? "mailto:hello@porpaw.co" : "#top"}
                  aria-label={label}
                  key={label}
                  sx={{
                    width: 34,
                    height: 34,
                    display: "grid",
                    placeItems: "center",
                    border: "1px solid #E6E1DD",
                    borderRadius: "50%",
                    color: "#6F6B71",
                    bgcolor: DS.white,
                    transition: "color .2s, border-color .2s, transform .2s",
                    "&:hover": { color: DS.accent, borderColor: DS.peach, transform: "translateY(-2px)" },
                  }}
                >
                  <Icon size={15} strokeWidth={1.8} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            pt: 2.25,
            borderTop: "1px solid #EEEAE7",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Typography sx={{ color: "#98949A", fontSize: 10.5 }}>© 2026 Porpaw. All rights reserved.</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box component="a" href="#top" sx={{ ...linkStyle, fontSize: 10.5 }}>นโยบายความเป็นส่วนตัว</Box>
            <Box component="a" href="#top" sx={{ ...linkStyle, fontSize: 10.5 }}>ข้อกำหนดการใช้งาน</Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
