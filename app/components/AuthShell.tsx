import Image from "next/image";
import Link from "next/link";
import { Box, Container, Typography } from "@mui/material";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { DS } from "./DesignSystem";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  detail: string;
  children: React.ReactNode;
  backSlot?: React.ReactNode;
  compact?: boolean;
  minimal?: boolean;
  fontFamily?: string;
};

const highlights = [
  "ผูกบัญชี LINE กับแพ็กเกจและสูตรอาหาร",
  "ดูสถานะและสิทธิ์ได้จากบัญชีเดียว",
  "พร้อมต่อหลังบ้านสำหรับทีม baebite",
];

export function AuthShell({ eyebrow, title, detail, children, backSlot, compact = false, minimal = false, fontFamily }: AuthShellProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: minimal ? DS.white : "#FCFBFA",
        color: DS.ink,
        position: "relative",
        overflow: "hidden",
        ...(fontFamily
          ? {
              fontFamily,
              "& .MuiTypography-root, & .MuiButton-root, & .MuiInputBase-root, & .MuiInputLabel-root": {
                fontFamily,
              },
            }
          : {}),
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            minimal
              ? "linear-gradient(180deg, #FFFFFF 0%, #FCFBFA 100%)"
              : "linear-gradient(135deg, rgba(251,220,201,.62), rgba(255,255,255,.2) 42%, rgba(217,235,221,.64))",
          pointerEvents: "none",
        }}
      />
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: minimal ? "minmax(0, 480px)" : compact ? "0.86fr 1fr" : "1.05fr .95fr" },
          justifyContent: minimal ? "center" : "normal",
          alignItems: "center",
          gap: minimal ? 0 : { xs: 3, md: 5 },
          px: { xs: 2.25, sm: 3, lg: 1 },
          py: minimal ? { xs: 2.5, md: 4 } : { xs: 3, md: 6 },
        }}
      >
        {!minimal && <Box sx={{ display: { xs: "none", md: "grid" }, gap: 2.25 }}>
          <Link href="/" aria-label="ไปหน้าแรก" style={{ textDecoration: "none" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.35 }}>
              <Image src="/images/logo_new6.png" alt="baebite" width={1191} height={346} priority style={{ width: 150, height: "auto" }} />
              <Box sx={{ color: DS.gray, fontSize: 12.5, fontWeight: 700 }}>Pet Food Delivery</Box>
            </Box>
          </Link>

          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              minHeight: 420,
              border: "1px solid rgba(255,255,255,.7)",
              borderRadius: "32px",
              bgcolor: "rgba(255,255,255,.68)",
              boxShadow: "0 22px 60px rgba(43,43,51,.10)",
              p: 3,
            }}
          >
            <Box sx={{ position: "absolute", right: -34, bottom: -48, width: 330, height: 330, opacity: .96 }}>
              <Image src="/images/box4.webp" alt="baebite package" fill sizes="330px" style={{ objectFit: "contain" }} />
            </Box>
            <Box sx={{ position: "relative", zIndex: 1, maxWidth: 420 }}>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: .8, color: "#B96449", bgcolor: "#FFF7F3", border: "1px solid #F4DED4", borderRadius: DS.radius.pill, px: 1.45, py: .75, fontSize: 12.5, fontWeight: 800 }}>
                <Sparkles size={14} />
                LINE-FIRST EXPERIENCE
              </Box>
              <Typography sx={{ fontSize: { md: 36, lg: 42 }, fontWeight: 900, lineHeight: 1.08, letterSpacing: "-.02em", mt: 2 }}>
                ระบบสมาชิกที่พร้อมโตไปกับแพ็กเกจและสูตรอาหาร
              </Typography>
              <Typography sx={{ color: "#686169", fontSize: 15, lineHeight: 1.75, mt: 1.4, maxWidth: 380 }}>
                เริ่มจาก login ที่ไว้ใจได้ แล้วต่อเข้ากับ package, recipe และสิทธิ์ผู้ใช้โดยไม่ต้องรื้อ flow ภายหลัง
              </Typography>
              <Box sx={{ display: "grid", gap: 1, mt: 3 }}>
                {highlights.map((item) => (
                  <Box key={item} sx={{ display: "flex", alignItems: "center", gap: 1, color: DS.ink, fontSize: 13.5, fontWeight: 700 }}>
                    <CheckCircle2 size={17} color="#568768" />
                    {item}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>}

        <Box sx={{ width: "100%", maxWidth: 520, justifySelf: "center" }}>
          {minimal && backSlot && (
            <Box sx={{ mb: 1.35 }}>
              {backSlot}
            </Box>
          )}
          <Link href="/" aria-label="ไปหน้าแรก" style={{ textDecoration: "none" }}>
            <Box sx={{ display: minimal ? "flex" : { xs: "flex", md: "none" }, alignItems: "center", justifyContent: minimal ? "center" : "flex-start", gap: 1.2, mb: minimal ? 3 : 2 }}>
              <Image src="/images/logo_new6.png" alt="baebite" width={1191} height={346} priority style={{ width: minimal ? 145 : 132, height: "auto" }} />
            </Box>
          </Link>
          <Box sx={{ bgcolor: minimal ? DS.white : "rgba(255,255,255,.9)", border: `1px solid ${DS.line}`, borderRadius: minimal ? { xs: "20px", sm: "24px" } : { xs: "24px", sm: "30px" }, p: minimal ? { xs: 2.25, sm: 3 } : { xs: 2.25, sm: 3.25 }, boxShadow: minimal ? "0 12px 34px rgba(43,43,51,.06)" : "0 18px 48px rgba(43,43,51,.10)" }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: .75, color: minimal ? DS.gray : "#568768", bgcolor: minimal ? "#F8F7F5" : "#EEF7F0", border: `1px solid ${minimal ? DS.line : "#CFE5D4"}`, borderRadius: DS.radius.pill, px: 1.35, py: .7, fontSize: 11.5, fontWeight: 900, letterSpacing: ".06em" }}>
              <ShieldCheck size={14} />
              {eyebrow}
            </Box>
            <Typography component="h1" sx={{ fontSize: minimal ? { xs: 27, sm: 32 } : { xs: 30, sm: 39 }, fontWeight: 900, lineHeight: 1.08, letterSpacing: "-.02em", mt: 1.65 }}>
              {title}
            </Typography>
            <Typography sx={{ color: DS.gray, fontSize: minimal ? 13.5 : 14.5, lineHeight: 1.7, mt: 1 }}>
              {detail}
            </Typography>
            {children}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
