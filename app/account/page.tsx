import Image from "next/image";
import { Box, Button, Container, Typography } from "@mui/material";
import { CalendarDays, HeartPulse, LogOut, PackageCheck, ShieldCheck, UserRound } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { signOutToHome } from "../actions/session";
import { BackButton } from "../components/BackButton";
import { DS } from "../components/DesignSystem";

const accountStats = [
  { label: "Package", value: "ยังไม่มี", detail: "พร้อมเริ่มจัดกล่อง", icon: PackageCheck, color: "#568768", bg: "#EEF7F0" },
  { label: "สูตรที่เข้าถึงได้", value: "0", detail: "รอผูกสิทธิ์จากแอดมิน", icon: HeartPulse, color: "#B96449", bg: "#FFF7F3" },
  { label: "Session", value: "Active", detail: "signed cookie", icon: ShieldCheck, color: "#6D5EA8", bg: "#F1EEFA" },
];

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) redirect("/login?next=/account");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FCFBFA", color: DS.ink, position: "relative", overflow: "hidden" }}>
      <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(251,220,201,.55), rgba(255,255,255,0) 45%, rgba(217,235,221,.55))", pointerEvents: "none" }} />
      <Container maxWidth="lg" sx={{ position: "relative", px: { xs: 2.25, sm: 3, lg: 1 }, py: { xs: 3, md: 5 } }}>
          <BackButton fallbackHref="/" preferHistory bottomSpacing={2.5}>
            กลับหน้าแรก
          </BackButton>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0,1fr) 360px" }, gap: 2.25, alignItems: "start" }}>
          <Box sx={{ bgcolor: "rgba(255,255,255,.92)", border: `1px solid ${DS.line}`, borderRadius: "30px", p: { xs: 2.5, sm: 3.5 }, boxShadow: "0 18px 48px rgba(43,43,51,.10)" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
              <Box sx={{ position: "relative", width: 82, height: 82, display: "grid", placeItems: "center", bgcolor: DS.peachSoft, color: "#B96449", borderRadius: "26px", overflow: "hidden", border: "4px solid white", boxShadow: "0 10px 22px rgba(43,43,51,.08)" }}>
                {session.user.image ? (
                  <Image src={session.user.image} alt={session.user.name ?? "ZoomieDash user"} fill sizes="82px" style={{ objectFit: "cover" }} />
                ) : (
                  <UserRound size={34} />
                )}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ color: "#B96449", fontSize: 12, fontWeight: 900, letterSpacing: ".1em" }}>ZOOMIEDASH ACCOUNT</Typography>
                <Typography component="h1" sx={{ fontSize: { xs: 30, sm: 40 }, fontWeight: 900, lineHeight: 1.08, letterSpacing: "-.02em", mt: .35 }}>
                  {session.user.name ?? "ZoomieDash User"}
                </Typography>
                <Typography sx={{ color: DS.gray, fontSize: 13.5, mt: .3 }}>สิทธิ์บัญชี {session.user.role === "ADMIN" ? "Admin" : "LINE Member"}</Typography>
              </Box>
              </Box>
              <form action={signOutToHome}>
                <Button type="submit" startIcon={<LogOut size={16} />} sx={{ color: DS.gray, border: `1px solid ${DS.line}`, bgcolor: DS.white, borderRadius: DS.radius.pill, px: 2.2, py: .95 }}>
                  ออกจากระบบ
                </Button>
              </form>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" }, gap: 1.25, mt: 3 }}>
              {accountStats.map((item) => {
                const Icon = item.icon;

                return (
                  <Box key={item.label} sx={{ border: `1px solid ${DS.line}`, borderRadius: "18px", p: 2, bgcolor: DS.white }}>
                    <Box sx={{ width: 40, height: 40, display: "grid", placeItems: "center", bgcolor: item.bg, color: item.color, borderRadius: "13px" }}>
                      <Icon size={20} />
                    </Box>
                    <Typography sx={{ color: DS.gray, fontSize: 12.2, fontWeight: 800, mt: 1.25 }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: 22, fontWeight: 900, mt: .1 }}>{item.value}</Typography>
                    <Typography sx={{ color: DS.gray, fontSize: 12.5, mt: .1 }}>{item.detail}</Typography>
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 3 }}>
              <Button href="/shop" sx={{ bgcolor: DS.ink, color: DS.white, borderRadius: DS.radius.pill, px: 2.75, py: 1.1, boxShadow: "0 10px 22px rgba(43,43,51,.16)", "&:hover": { bgcolor: "#44444D" } }}>
                เลือกแพ็กเกจ/สินค้า
              </Button>
              <Button href="/#calculator" sx={{ color: DS.ink, border: `1px solid ${DS.line}`, bgcolor: DS.white, borderRadius: DS.radius.pill, px: 2.5 }}>
                คำนวณอาหารก่อน
              </Button>
            </Box>
          </Box>

          <Box sx={{ bgcolor: DS.ink, color: DS.white, borderRadius: "28px", p: 2.5, boxShadow: "0 18px 48px rgba(43,43,51,.12)" }}>
            <CalendarDays size={24} color={DS.peach} />
            <Typography sx={{ fontSize: 22, fontWeight: 900, mt: 1.2 }}>ข้อมูลบัญชี</Typography>
            <Typography sx={{ color: "rgba(255,255,255,.68)", fontSize: 13.5, lineHeight: 1.75, mt: .75 }}>
              เมื่อเชื่อม database แล้วกล่องนี้จะแสดงรอบจัดส่งล่าสุด สูตรที่ใช้งานได้ และประวัติคำสั่งซื้อของผู้ใช้
            </Typography>
            <Box sx={{ borderTop: "1px solid rgba(255,255,255,.14)", mt: 2, pt: 2 }}>
              <Typography sx={{ color: DS.peach, fontSize: 11.5, fontWeight: 900, letterSpacing: ".08em" }}>USER ID</Typography>
              <Typography sx={{ fontSize: 12.5, overflowWrap: "anywhere", mt: .6 }}>{session.user.id}</Typography>
            </Box>
          </Box>
          </Box>
        </Container>
      </Box>
  );
}
