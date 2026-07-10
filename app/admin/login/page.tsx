import { Box, TextField } from "@mui/material";
import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BackButton } from "../../components/BackButton";
import { AuthShell } from "../../components/AuthShell";
import { DS } from "../../components/DesignSystem";
import { PendingSubmitButton } from "../../components/PendingSubmitButton";
import { adminFontFamily } from "../_components/adminFonts";
import { adminLogin } from "./actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AdminLoginPageProps = {
  searchParams: Promise<{ error?: string }>;
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

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const session = await auth();
  const params = await searchParams;
  const admin = {
    email: process.env.ADMIN_EMAIL ?? "admin@baebite.local",
    password: process.env.ADMIN_PASSWORD ?? "baebite-admin",
    usingDevDefaults: !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD,
  };

  if (session?.user.role === "ADMIN") redirect("/admin");

  return (
    <AuthShell
      eyebrow="ADMIN ACCESS"
      title="Admin Login"
      detail="สำหรับทีมงาน baebite"
      minimal
      fontFamily={adminFontFamily}
      backSlot={(
        <BackButton fallbackHref="/login" preferHistory topSpacing={0} bottomSpacing={0}>
          กลับหน้า Login
        </BackButton>
      )}
    >
      <form action={adminLogin}>
        {params.error && (
          <Box sx={{ bgcolor: "#FFF0F0", border: "1px solid #FFD1D1", color: "#B84A4A", borderRadius: "16px", px: 1.75, py: 1.25, mt: 1.4, fontSize: 13 }}>
            อีเมลหรือรหัสผ่านไม่ถูกต้อง
          </Box>
        )}

        {admin.usingDevDefaults && (
          <Box sx={{ bgcolor: "#FFF8E7", border: "1px solid #F6DCA6", color: "#8A6320", borderRadius: "16px", px: 1.75, py: 1.25, mt: 1.4, fontSize: 13 }}>
            Dev default: {admin.email} / {admin.password}
          </Box>
        )}

        <Box sx={{ display: "grid", gap: 1.2, mt: 2.1 }}>
          <TextField name="email" label="อีเมล" type="email" required size="small" defaultValue={admin.usingDevDefaults ? admin.email : ""} sx={fieldSx} />
          <TextField name="password" label="รหัสผ่าน" type="password" required size="small" defaultValue={admin.usingDevDefaults ? admin.password : ""} sx={fieldSx} />
          <PendingSubmitButton icon="lock" label="เข้าหลังบ้าน" pendingLabel="กำลังเข้าสู่ระบบ" />
          <Box sx={{ display: "flex", alignItems: "center", gap: .8, color: DS.gray, fontSize: 12.2, justifyContent: "center", pt: .3 }}>
            <ShieldCheck size={15} />
            Session จัดการด้วย NextAuth และ Prisma
          </Box>
        </Box>
      </form>
    </AuthShell>
  );
}
