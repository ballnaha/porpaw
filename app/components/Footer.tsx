import React from "react";
import Image from "next/image";
import { Box, Container, Typography } from "@mui/material";
import { AtSign, Mail, MessageCircle, PawPrint } from "lucide-react";
import { DS } from "./DesignSystem";

const FOOTER_LINKS = [
  { label: "Shop", href: "#features" },
  { label: "Subscription", href: "#promo" },
  { label: "Places", href: "#explore" },
  { label: "Vet & Care", href: "#care" },
  { label: "ติดต่อเรา", href: "mailto:hello@porpaw.co" },
];

const linkStyle = {
  color: "#8B8B95",
  fontSize: 12.5,
  fontWeight: 600,
  textDecoration: "none",
  transition: "color .2s",
  "&:hover": { color: DS.peach },
} as const;

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#FFF",
        borderTop: "1px solid #F3EFEF",
        py: { xs: 4, md: 5 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3, lg: 1 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            pb: 3,
            borderBottom: "1px solid #F3EFEF",
          }}
        >
          {/* Logo & Brand Name */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/images/logo.png"
              alt="Porpaw"
              width={1191}
              height={346}
              style={{
                width: "auto",
                height: "26px",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Minimal Inline Links */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: { xs: 2.5, sm: 3.5 },
            }}
          >
            {FOOTER_LINKS.map(({ label, href }) => (
              <Box component="a" href={href} key={label} sx={linkStyle}>
                {label}
              </Box>
            ))}
          </Box>

          {/* Social Icons */}
          <Box sx={{ display: "flex", gap: 2.5 }}>
            {[
              { label: "Social", icon: AtSign, href: "#top" },
              { label: "Chat", icon: MessageCircle, href: "#top" },
              { label: "Email", icon: Mail, href: "mailto:hello@porpaw.co" },
            ].map(({ label, icon: Icon, href }) => (
              <Box
                component="a"
                href={href}
                aria-label={label}
                key={label}
                sx={{
                  color: "#8B8B95",
                  transition: "all .2s ease",
                  display: "inline-flex",
                  "&:hover": { color: DS.peach, transform: "translateY(-1px)" },
                }}
              >
                <Icon size={17} strokeWidth={2} />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Bottom copyright */}
        <Box
          sx={{
            pt: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Typography sx={{ color: "#A1A1AA", fontSize: 11 }}>
            © 2026 Porpaw. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 2.5 }}>
            <Box component="a" href="#top" sx={{ ...linkStyle, fontSize: 11, fontWeight: 500 }}>
              นโยบายความเป็นส่วนตัว
            </Box>
            <Box component="a" href="#top" sx={{ ...linkStyle, fontSize: 11, fontWeight: 500 }}>
              ข้อกำหนดการใช้งาน
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
