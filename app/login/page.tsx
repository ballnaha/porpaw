import { Box, Button, TextField } from "@mui/material";
import { ExternalLink, MessageCircle, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BackButton } from "../components/BackButton";
import { AuthShell } from "../components/AuthShell";
import { DS } from "../components/DesignSystem";
import { PendingSubmitButton } from "../components/PendingSubmitButton";
import { adminFontFamily } from "../admin/_components/adminFonts";
import { devLineLogin, memberLogin } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    missing?: string;
    next?: string;
  }>;
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: DS.white,
    borderRadius: "14px",
    "& fieldset": { borderColor: DS.line },
    "&:hover fieldset": { borderColor: DS.peach },
    "&.Mui-focused fieldset": { borderColor: DS.peach },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#B96449" },
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
      title="เข้าสู่ระบบ"
      detail="ใช้บัญชีสมาชิก baebite หรือเข้าสู่ระบบด้วย LINE"
      minimal
      fontFamily={adminFontFamily}
      backSlot={(
        <BackButton fallbackHref="/" preferHistory topSpacing={0} bottomSpacing={0}>
          กลับหน้าแรก
        </BackButton>
      )}
    >
      {params.error && (
        <Box sx={{ bgcolor: "#FFF0F0", border: "1px solid #FFD1D1", color: "#B84A4A", borderRadius: "16px", px: 1.75, py: 1.25, mt: 1.4, fontSize: 13 }}>
          Username หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง
        </Box>
      )}

      {params.missing && (
        <Box sx={{ bgcolor: "#FFF8E7", border: "1px solid #F6DCA6", color: "#8A6320", borderRadius: "16px", px: 1.75, py: 1.25, mt: 1.4, fontSize: 13 }}>
          ยังไม่ได้ตั้งค่า LINE Channel ใน `.env` ใช้โหมดทดสอบด้านล่างได้ระหว่างรอโดเมนจริง
        </Box>
      )}

      <Box sx={{ display: "grid", gap: 1.2, mt: 2.1 }}>
        <Box component="form" action={memberLogin} sx={{ display: "grid", gap: 1.15 }}>
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <TextField name="username" label="Username หรืออีเมล" type="text" required size="small" autoComplete="username" sx={fieldSx} />
          <TextField name="password" label="Password" type="password" required size="small" autoComplete="current-password" sx={fieldSx} />
          <PendingSubmitButton icon="key" label="เข้าสู่ระบบ" pendingLabel="กำลังเข้าสู่ระบบ" />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 1.2, color: DS.gray, fontSize: 12, fontWeight: 700, my: .2 }}>
          <Box sx={{ height: 1, bgcolor: DS.line }} />
          หรือ
          <Box sx={{ height: 1, bgcolor: DS.line }} />
        </Box>

        <Box sx={{ display: "grid", gap: .9 }}>
          <Button
            href={lineReady ? lineHref : "/login?missing=1"}
            startIcon={<MessageCircle size={18} />}
            fullWidth
            sx={{
              bgcolor: DS.white,
              color: lineReady ? "#06A946" : "#8A6320",
              border: `1px solid ${lineReady ? "#BFE8CB" : "#F6DCA6"}`,
              borderRadius: DS.radius.pill,
              py: 1.2,
              fontSize: 14.5,
              boxShadow: "none",
              "&:hover": { bgcolor: lineReady ? "#F4FBF6" : "#FFF8E7" },
            }}
          >
            {lineReady ? "Login with LINE" : "ตั้งค่า LINE Channel ก่อนใช้งานจริง"}
          </Button>
          {!lineReady && devLineReady && (
            <form action={devLineLogin}>
              <PendingSubmitButton icon="login" label="เข้าโหมดทดสอบ LINE" pendingLabel="กำลังเข้าโหมดทดสอบ" tone="muted" />
            </form>
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: .15 }}>
          <Button
            href="/admin/login"
            startIcon={<ShieldCheck size={16} />}
            endIcon={<ExternalLink size={13} />}
            sx={{ color: DS.gray, borderRadius: DS.radius.pill, px: 1.4, py: .8, fontSize: 12.5 }}
          >
            Admin
          </Button>
        </Box>
      </Box>
    </AuthShell>
  );
}
