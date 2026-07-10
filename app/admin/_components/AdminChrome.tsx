import Image from "next/image";
import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import { BookOpenText, LayoutDashboard, LogOut, Package, ShieldCheck, ShoppingBag, UsersRound } from "lucide-react";
import { signOutToAdminLogin } from "@/app/actions/session";
import { DS } from "../../components/DesignSystem";
import { AdminBackCacheGuard } from "./AdminBackCacheGuard";
import { adminFontSx } from "./adminFonts";

type AdminChromeProps = {
  title: string;
  eyebrow?: string;
  detail?: string;
  userName: string;
  active?: "dashboard" | "shop" | "packages" | "recipes" | "users";
  children: React.ReactNode;
};

const navItems = [
  { id: "dashboard", label: "Dashboard", detail: "ภาพรวมระบบ", href: "/admin", icon: LayoutDashboard },
  { id: "shop", label: "Shop", detail: "สินค้าและหน้าร้าน", href: "/admin/shop", icon: ShoppingBag },
  { id: "packages", label: "Package", detail: "แพ็กเกจรายเดือน", href: "/admin/packages", icon: Package },
  { id: "recipes", label: "สูตรอาหาร", detail: "สูตรดูแลน้อง", href: "/admin/recipes", icon: BookOpenText },
  { id: "users", label: "Users", detail: "บัญชีและสิทธิ์", href: "/admin/users", icon: UsersRound },
] as const;

export function AdminChrome({ title, eyebrow = "baebite ADMIN", detail, userName, active = "dashboard", children }: AdminChromeProps) {
  const activeNav = navItems.find((item) => item.id === active) ?? navItems[0];
  const initial = userName.trim().charAt(0).toUpperCase() || "A";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F6F4F1", color: DS.ink, ...adminFontSx }}>
      <AdminBackCacheGuard />
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "276px minmax(0,1fr)" }, minHeight: "100vh" }}>
        <Box
          component="aside"
          sx={{
            display: { xs: "none", lg: "flex" },
            flexDirection: "column",
            position: "sticky",
            top: 0,
            height: "100vh",
            px: 2,
            py: 2.25,
            bgcolor: "rgba(255,255,255,.94)",
            borderRight: `1px solid ${DS.line}`,
            boxShadow: "18px 0 45px rgba(43,43,51,.04)",
          }}
        >
          <Link href="/" aria-label="ไปหน้าแรก" style={{ textDecoration: "none" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, px: .5, pb: 2 }}>
              <Image src="/images/logo_new6.png" alt="baebite" width={1191} height={346} priority style={{ width: 142, height: "auto" }} />
              <Box sx={{ color: "#B96449", bgcolor: DS.peachSoft, borderRadius: DS.radius.pill, px: 1, py: .35, fontSize: 11, fontWeight: 900 }}>ADMIN</Box>
            </Box>
          </Link>

          <Box component="nav" sx={{ display: "grid", gap: .7, pt: 1, borderTop: `1px solid ${DS.line}` }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const selected = item.id === active;

              return (
                <Button
                  key={item.id}
                  href={item.href}
                  sx={{
                    justifyContent: "flex-start",
                    gap: 1.2,
                    color: selected ? DS.ink : DS.gray,
                    bgcolor: selected ? "#FFF7F3" : "transparent",
                    border: `1px solid ${selected ? "#F4C8B4" : "transparent"}`,
                    borderRadius: "16px",
                    px: 1.2,
                    py: 1,
                    textTransform: "none",
                    "&:hover": { bgcolor: selected ? "#FFF7F3" : "#F8F7F5" },
                  }}
                >
                  <Box sx={{ width: 36, height: 36, display: "grid", placeItems: "center", color: selected ? "#B96449" : DS.gray, bgcolor: selected ? DS.peachSoft : "#F7F7F8", borderRadius: "12px", flexShrink: 0 }}>
                    <Icon size={18} />
                  </Box>
                  <Box sx={{ minWidth: 0, textAlign: "left" }}>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 900, lineHeight: 1.2 }}>{item.label}</Typography>
                    <Typography sx={{ color: selected ? "#8B6D61" : DS.gray, fontSize: 11.5, fontWeight: 700, lineHeight: 1.25, mt: .15 }}>{item.detail}</Typography>
                  </Box>
                </Button>
              );
            })}
          </Box>

          <Box sx={{ mt: "auto", pt: 2 }}>
            <Box sx={{ bgcolor: "#FBFAF8", border: `1px solid ${DS.line}`, borderRadius: "20px", p: 1.35 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.05, mb: 1.1 }}>
                <Box sx={{ width: 38, height: 38, display: "grid", placeItems: "center", bgcolor: DS.ink, color: DS.white, borderRadius: "13px", fontSize: 14, fontWeight: 900 }}>{initial}</Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ color: DS.gray, fontSize: 11, fontWeight: 800 }}>Signed in</Typography>
                  <Typography noWrap sx={{ fontSize: 13, fontWeight: 900 }}>{userName}</Typography>
                </Box>
              </Box>
              <form action={signOutToAdminLogin} style={{ margin: 0 }}>
                <Button type="submit" fullWidth startIcon={<LogOut size={15} />} sx={{ color: DS.gray, border: `1px solid ${DS.line}`, bgcolor: DS.white, borderRadius: "13px", px: 1.75, py: .8, fontSize: 12.5, fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#F8F7F5" } }}>
                  Logout
                </Button>
              </form>
            </Box>
          </Box>
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: { xs: "block", lg: "none" }, position: "sticky", top: 0, zIndex: 20, bgcolor: "rgba(255,255,255,.94)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${DS.line}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.4, px: 2, py: 1.1 }}>
              <Link href="/" aria-label="ไปหน้าแรก" style={{ textDecoration: "none" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Image src="/images/logo_new6.png" alt="baebite" width={1191} height={346} priority style={{ width: 118, height: "auto" }} />
                  <Box sx={{ color: "#B96449", bgcolor: DS.peachSoft, borderRadius: DS.radius.pill, px: .9, py: .3, fontSize: 10.5, fontWeight: 900 }}>ADMIN</Box>
                </Box>
              </Link>
              <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: .75 }}>
                <Box sx={{ width: 34, height: 34, display: "grid", placeItems: "center", bgcolor: DS.ink, color: DS.white, borderRadius: "12px", fontSize: 13, fontWeight: 900 }}>{initial}</Box>
                <form action={signOutToAdminLogin} style={{ margin: 0 }}>
                  <Button type="submit" aria-label="ออกจากระบบ" sx={{ minWidth: 38, width: 38, height: 38, color: DS.gray, border: `1px solid ${DS.line}`, bgcolor: DS.white, borderRadius: "12px", p: 0 }}>
                    <LogOut size={16} />
                  </Button>
                </form>
              </Box>
            </Box>
            <Box component="nav" sx={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "minmax(118px, max-content)", gap: .75, overflowX: "auto", px: 2, pb: 1.15 }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const selected = item.id === active;

                return (
                  <Button key={item.id} href={item.href} startIcon={<Icon size={16} />} sx={{ justifyContent: "center", color: selected ? DS.ink : DS.gray, bgcolor: selected ? DS.peachSoft : "#F8F7F5", border: `1px solid ${selected ? "#F4C8B4" : DS.line}`, borderRadius: "13px", px: 1.25, py: .85, fontSize: 12.5, fontWeight: 900, textTransform: "none", whiteSpace: "nowrap" }}>
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          </Box>

          <Box component="main" sx={{ width: "100%", maxWidth: 1480, mx: "auto", px: { xs: 2, md: 3, xl: 4 }, py: { xs: 2.25, md: 3.5 } }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0,1fr) auto" }, alignItems: "end", gap: 2, mb: 2.5 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ color: "#B96449", fontSize: 11.5, fontWeight: 900, letterSpacing: ".1em" }}>{eyebrow}</Typography>
                <Typography component="h1" sx={{ fontSize: { xs: 30, md: 41 }, fontWeight: 900, lineHeight: 1.06, mt: .35 }}>
                  {title}
                </Typography>
                {detail && <Typography sx={{ color: DS.gray, fontSize: 14.5, lineHeight: 1.7, mt: .8, maxWidth: 780 }}>{detail}</Typography>}
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "flex-start", md: "flex-end" }, gap: .8, flexWrap: "wrap" }}>
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: .7, color: "#568768", bgcolor: "#EEF7F0", border: "1px solid #CFE6D2", borderRadius: DS.radius.pill, px: 1.25, py: .7, fontSize: 12, fontWeight: 900 }}>
                  <ShieldCheck size={14} />
                  Admin access
                </Box>
                <Box sx={{ color: DS.gray, bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, px: 1.25, py: .7, fontSize: 12, fontWeight: 900 }}>
                  {activeNav.label}
                </Box>
              </Box>
            </Box>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
