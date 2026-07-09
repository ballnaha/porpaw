import { Box, Button, Typography } from "@mui/material";
import { ExternalLink, LogIn, MessageCircle, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BackButton } from "../components/BackButton";
import { AuthShell } from "../components/AuthShell";
import { DS } from "../components/DesignSystem";
import { adminFontFamily } from "../admin/_components/adminFonts";
import { devLineLogin } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    missing?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  const params = await searchParams;

  if (session?.user.role === "ADMIN") redirect("/admin");
  if (session?.user.role === "USER") redirect("/account");

  const callbackUrl = params.next && params.next.startsWith("/") ? params.next : "/account";
  const lineHref = `/api/auth/signin/line?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  const lineReady = Boolean(
    (process.env.AUTH_LINE_ID || process.env.LINE_CHANNEL_ID) &&
      (process.env.AUTH_LINE_SECRET || process.env.LINE_CHANNEL_SECRET),
  );
  const devLineReady = process.env.NODE_ENV !== "production";

  return (
    <AuthShell
      eyebrow="MEMBER ACCESS"
      title="เข้าสู่ระบบผ่าน LINE"
      detail="เชื่อมบัญชี LINE เพื่อเก็บข้อมูลน้อง แพ็กเกจ และสูตรอาหารไว้ในบัญชีเดียว พร้อมใช้งานผ่าน LIFF เมื่อมีโดเมนจริง"
      fontFamily={adminFontFamily}
    >
      <BackButton fallbackHref="/" preferHistory topSpacing={2.4} bottomSpacing={.8}>
        กลับหน้าแรก
      </BackButton>

      {params.error && (
        <Box sx={{ bgcolor: "#FFF0F0", border: "1px solid #FFD1D1", color: "#B84A4A", borderRadius: "16px", px: 1.75, py: 1.25, mt: 1.4, fontSize: 13 }}>
          เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง
        </Box>
      )}

      {params.missing && (
        <Box sx={{ bgcolor: "#FFF8E7", border: "1px solid #F6DCA6", color: "#8A6320", borderRadius: "16px", px: 1.75, py: 1.25, mt: 1.4, fontSize: 13 }}>
          ยังไม่ได้ตั้งค่า LINE Channel ใน `.env` ใช้โหมดทดสอบด้านล่างได้ระหว่างรอโดเมนจริง
        </Box>
      )}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1, mt: 2.4 }}>
        <Box sx={{ border: `1px solid ${lineReady ? "#CFE5D4" : "#F6DCA6"}`, bgcolor: lineReady ? "#F4FBF6" : "#FFF8E7", borderRadius: "17px", p: 1.5 }}>
          <Typography sx={{ color: lineReady ? "#568768" : "#8A6320", fontSize: 11.5, fontWeight: 900, letterSpacing: ".06em" }}>LINE CONFIG</Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 900, mt: .35 }}>{lineReady ? "พร้อมใช้งานจริง" : "รอ Channel"}</Typography>
        </Box>
        <Box sx={{ border: `1px solid ${DS.line}`, bgcolor: "#F8F7F5", borderRadius: "17px", p: 1.5 }}>
          <Typography sx={{ color: DS.gray, fontSize: 11.5, fontWeight: 900, letterSpacing: ".06em" }}>SESSION</Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 900, mt: .35 }}>NextAuth JWT</Typography>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gap: 1.15, mt: 2 }}>
        <Button
          href={lineReady ? lineHref : "/login?missing=1"}
          startIcon={<MessageCircle size={18} />}
          sx={{ bgcolor: "#06C755", color: DS.white, borderRadius: DS.radius.pill, py: 1.35, fontSize: 15, boxShadow: "0 10px 22px rgba(6,199,85,.22)", "&:hover": { bgcolor: "#05B64D" } }}
        >
          {lineReady ? "Login with LINE" : "ตั้งค่า LINE Channel ก่อนใช้งานจริง"}
        </Button>
        {!lineReady && devLineReady && (
          <form action={devLineLogin}>
            <Button
              type="submit"
              startIcon={<LogIn size={18} />}
              fullWidth
              sx={{ color: DS.ink, bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, py: 1.25, "&:hover": { bgcolor: "#F8F7F5" } }}
            >
              เข้าโหมดทดสอบ LINE
            </Button>
          </form>
        )}
        <Button
          href="/admin/login"
          startIcon={<ShieldCheck size={17} />}
          endIcon={<ExternalLink size={14} />}
          sx={{ color: DS.gray, borderRadius: DS.radius.pill, py: 1.1 }}
        >
          เข้าหลังบ้านสำหรับแอดมิน
        </Button>
      </Box>
    </AuthShell>
  );
}
