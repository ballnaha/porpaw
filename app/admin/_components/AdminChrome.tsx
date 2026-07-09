import Image from "next/image";
import { Box, Button, Container, Typography } from "@mui/material";
import { BookOpenText, LayoutDashboard, LogOut, Package, UsersRound } from "lucide-react";
import { signOutToAdminLogin } from "@/app/actions/session";
import { DS } from "../../components/DesignSystem";
import { adminFontSx } from "./adminFonts";

type AdminChromeProps = {
  title: string;
  eyebrow?: string;
  detail?: string;
  userName: string;
  active?: "dashboard" | "packages" | "recipes" | "users";
  children: React.ReactNode;
};

const navItems = [
  { id: "dashboard", label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { id: "packages", label: "Package", href: "/admin/packages", icon: Package },
  { id: "recipes", label: "สูตรอาหาร", href: "/admin/recipes", icon: BookOpenText },
  { id: "users", label: "Users", href: "/admin/users", icon: UsersRound },
] as const;

export function AdminChrome({ title, eyebrow = "ZOOMIEDASH ADMIN", detail, userName, active = "dashboard", children }: AdminChromeProps) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7F7F8", color: DS.ink, ...adminFontSx }}>
      <Box sx={{ borderBottom: `1px solid ${DS.line}`, bgcolor: "rgba(255,255,255,.88)", backdropFilter: "blur(14px)", position: "sticky", top: 0, zIndex: 10 }}>
        <Container maxWidth="xl" sx={{ display: "flex", alignItems: "center", gap: 2, px: { xs: 2, md: 3 }, py: 1.35 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
            <Image src="/images/logo_new1.png" alt="ZoomieDash" width={1191} height={346} priority style={{ width: 120, height: "auto" }} />
            <Box sx={{ display: { xs: "none", sm: "block" }, color: DS.gray, fontSize: 12, fontWeight: 800 }}>Admin</Box>
          </Box>
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ display: { xs: "none", sm: "block" }, color: DS.gray, fontSize: 12.5 }}>เข้าสู่ระบบโดย {userName}</Typography>
            <form action={signOutToAdminLogin}>
              <Button type="submit" startIcon={<LogOut size={15} />} sx={{ color: DS.gray, border: `1px solid ${DS.line}`, bgcolor: DS.white, borderRadius: DS.radius.pill, px: 1.75, py: .8, fontSize: 12.5 }}>
                ออก
              </Button>
            </form>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "230px minmax(0,1fr)" }, gap: { xs: 2, lg: 3 }, px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
        <Box component="nav" sx={{ alignSelf: "start", position: { lg: "sticky" }, top: { lg: 88 }, display: "grid", gap: .75, bgcolor: { xs: "transparent", lg: DS.white }, border: { lg: `1px solid ${DS.line}` }, borderRadius: { lg: "22px" }, p: { xs: 0, lg: 1 }, gridTemplateColumns: { xs: "repeat(4,minmax(0,1fr))", lg: "1fr" }, overflowX: { xs: "auto", lg: "visible" } }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const selected = item.id === active;

            return (
              <Button key={item.id} href={item.href} startIcon={<Icon size={16} />} sx={{ justifyContent: { xs: "center", lg: "flex-start" }, minWidth: { xs: 118, lg: 0 }, color: selected ? DS.ink : DS.gray, bgcolor: selected ? DS.peachSoft : "transparent", border: `1px solid ${selected ? "#F4C8B4" : "transparent"}`, borderRadius: "15px", px: 1.5, py: 1.05, fontSize: 13, fontWeight: 800, "&:hover": { bgcolor: selected ? DS.peachSoft : "#F8F7F5" } }}>
                {item.label}
              </Button>
            );
          })}
        </Box>

        <Box component="main" sx={{ minWidth: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 2, flexWrap: "wrap", mb: 2.25 }}>
            <Box>
              <Typography sx={{ color: "#B96449", fontSize: 11.5, fontWeight: 900, letterSpacing: ".1em" }}>{eyebrow}</Typography>
              <Typography component="h1" sx={{ fontSize: { xs: 30, md: 42 }, fontWeight: 900, lineHeight: 1.08, letterSpacing: "-.02em", mt: .35 }}>
                {title}
              </Typography>
              {detail && <Typography sx={{ color: DS.gray, fontSize: 14.5, mt: .75, maxWidth: 760 }}>{detail}</Typography>}
            </Box>
          </Box>
          {children}
        </Box>
      </Container>
    </Box>
  );
}
