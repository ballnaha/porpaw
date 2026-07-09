import { Box, Button, Typography } from "@mui/material";
import { ArrowRight, BookOpenText, CircleDollarSign, Package, ShieldCheck, UsersRound } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminChrome } from "./_components/AdminChrome";
import { DS } from "../components/DesignSystem";

const adminCards = [
  { title: "Package Tier", detail: "จัดเกรดอาหาร Essential, Plus, Premium รอบส่ง 1 เดือน", icon: Package, href: "/admin/packages", count: "3 tiers", color: "#568768", bg: "#EEF7F0" },
  { title: "สูตรดูแล", detail: "จัดสูตรบำรุงขน เสริมภูมิ ระบบย่อย คุมน้ำหนัก สูงวัย แพ้ง่าย", icon: BookOpenText, href: "/admin/recipes", count: "6 goals", color: "#B96449", bg: "#FFF7F3" },
  { title: "Users", detail: "ดู LINE account, package tier, สูตรที่เลือก และสิทธิ์รายคน", icon: UsersRound, href: "/admin/users", count: "0 active", color: "#6D5EA8", bg: "#F1EEFA" },
];

const stats = [
  { label: "Monthly revenue", value: "฿0", icon: CircleDollarSign },
  { label: "Active packages", value: "0", icon: Package },
  { label: "LINE members", value: "Dev", icon: UsersRound },
];

export default async function AdminPage() {
  const session = await auth();

  if (session?.user.role !== "ADMIN") redirect("/admin/login");

  return (
    <AdminChrome
      title="Dashboard"
      detail="ศูนย์กลางสำหรับจัด package tier, สูตรดูแล และสิทธิ์ผู้ใช้ผ่าน LINE account"
      userName={session.user.name ?? "ZoomieDash Admin"}
      active="dashboard"
    >
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr .8fr" }, gap: 1.5, mb: 1.5 }}>
        <Box sx={{ bgcolor: DS.ink, color: DS.white, borderRadius: "26px", p: { xs: 2.25, md: 3 }, overflow: "hidden", position: "relative" }}>
          <ShieldCheck size={28} color={DS.peach} />
          <Typography sx={{ fontSize: { xs: 24, md: 31 }, fontWeight: 900, mt: 1 }}>Auth foundation พร้อมใช้งาน</Typography>
          <Typography sx={{ color: "rgba(255,255,255,.72)", fontSize: 14.5, lineHeight: 1.75, mt: .75, maxWidth: 680 }}>
            โมเดลใหม่แยกเกรดอาหารออกจากสูตรดูแลแล้ว: package คุมราคา/คุณภาพ ส่วนสูตรคุมเป้าหมายสุขภาพของน้อง
          </Typography>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(3,1fr)", md: "1fr" }, gap: 1 }}>
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 1.1, bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "18px", p: 1.55 }}>
                <Box sx={{ width: 38, height: 38, display: { xs: "none", sm: "grid" }, placeItems: "center", bgcolor: DS.peachSoft, color: "#B96449", borderRadius: "12px", flexShrink: 0 }}>
                  <Icon size={18} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ color: DS.gray, fontSize: 11.5, fontWeight: 800 }}>{item.label}</Typography>
                  <Typography sx={{ fontSize: { xs: 17, md: 21 }, fontWeight: 900 }}>{item.value}</Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" }, gap: 1.5 }}>
        {adminCards.map((item) => {
          const Icon = item.icon;

          return (
            <Box key={item.title} sx={{ bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "22px", p: 2.25, boxShadow: "0 8px 22px rgba(43,43,51,.05)" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                <Box sx={{ width: 46, height: 46, display: "grid", placeItems: "center", bgcolor: item.bg, color: item.color, borderRadius: "15px" }}>
                  <Icon size={22} />
                </Box>
                <Typography sx={{ color: item.color, bgcolor: item.bg, borderRadius: DS.radius.pill, px: 1.2, py: .55, fontSize: 11.5, fontWeight: 900 }}>{item.count}</Typography>
              </Box>
              <Typography sx={{ fontSize: 21, fontWeight: 900, mt: 1.5 }}>{item.title}</Typography>
              <Typography sx={{ color: DS.gray, fontSize: 13.5, lineHeight: 1.7, mt: .4, minHeight: 46 }}>{item.detail}</Typography>
              <Button href={item.href} endIcon={<ArrowRight size={15} />} sx={{ color: DS.ink, border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, px: 2, mt: 2, "&:hover": { bgcolor: "#F8F7F5" } }}>
                เปิดโมดูล
              </Button>
            </Box>
          );
        })}
      </Box>
    </AdminChrome>
  );
}
