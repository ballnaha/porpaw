import { Box, Button, Typography } from "@mui/material";
import { ArrowRight, Plus, Search, SlidersHorizontal } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminChrome } from "./AdminChrome";
import { DS } from "../../components/DesignSystem";

type AdminModulePlaceholderProps = {
  title: string;
  detail: string;
  active: "shop" | "packages" | "recipes" | "users";
  primaryAction: string;
  rows: Array<{
    name: string;
    meta: string;
    status: string;
    accent: string;
  }>;
};

export async function AdminModulePlaceholder({ title, detail, active, primaryAction, rows }: AdminModulePlaceholderProps) {
  const session = await auth();

  if (session?.user.role !== "ADMIN") redirect("/admin/login");

  return (
    <AdminChrome title={title} detail={detail} userName={session.user.name ?? "baebite Admin"} active={active}>
      <Box sx={{ display: "grid", gap: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.25, flexWrap: "wrap", bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "22px", p: { xs: 1.5, md: 1.8 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: { xs: "100%", sm: 260 }, color: DS.gray, bgcolor: "#F8F7F5", border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, px: 1.5, py: 1.05 }}>
            <Search size={16} />
            <Typography sx={{ fontSize: 13.5 }}>ค้นหาในโมดูลนี้</Typography>
          </Box>
          <Button startIcon={<SlidersHorizontal size={16} />} sx={{ color: DS.ink, border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, px: 2, bgcolor: DS.white }}>
            Filter
          </Button>
          <Button startIcon={<Plus size={16} />} sx={{ bgcolor: DS.ink, color: DS.white, borderRadius: DS.radius.pill, px: 2.25, "&:hover": { bgcolor: "#44444D" } }}>
            {primaryAction}
          </Button>
        </Box>

        <Box sx={{ bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "24px", overflow: "hidden", boxShadow: "0 8px 22px rgba(43,43,51,.05)" }}>
          <Box sx={{ display: { xs: "none", md: "grid" }, gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr) 140px 120px", gap: 1, bgcolor: "#F8F7F5", borderBottom: `1px solid ${DS.line}`, px: 2.25, py: 1.25 }}>
            {["รายการ", "รายละเอียด", "สถานะ", "จัดการ"].map((item) => (
              <Typography key={item} sx={{ color: DS.gray, fontSize: 12, fontWeight: 900, letterSpacing: ".06em" }}>{item}</Typography>
            ))}
          </Box>
          {rows.map((row) => (
            <Box key={row.name} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0,1.4fr) minmax(0,1fr) 140px 120px" }, gap: { xs: .75, md: 1 }, alignItems: "center", borderBottom: `1px solid ${DS.line}`, px: 2.25, py: 1.65, "&:last-child": { borderBottom: 0 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, minWidth: 0 }}>
                <Box sx={{ width: 42, height: 42, flexShrink: 0, borderRadius: "14px", bgcolor: row.accent }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 900 }}>{row.name}</Typography>
                  <Typography sx={{ display: { md: "none" }, color: DS.gray, fontSize: 12.5, mt: .2 }}>{row.meta}</Typography>
                </Box>
              </Box>
              <Typography sx={{ display: { xs: "none", md: "block" }, color: DS.gray, fontSize: 13.5 }}>{row.meta}</Typography>
              <Box sx={{ justifySelf: { md: "start" }, color: row.status === "เปิดใช้งาน" ? "#568768" : "#8A6320", bgcolor: row.status === "เปิดใช้งาน" ? "#EEF7F0" : "#FFF8E7", border: `1px solid ${row.status === "เปิดใช้งาน" ? "#CFE5D4" : "#F6DCA6"}`, borderRadius: DS.radius.pill, px: 1.25, py: .55, fontSize: 12, fontWeight: 900 }}>
                {row.status}
              </Box>
              <Button endIcon={<ArrowRight size={14} />} sx={{ justifySelf: { md: "start" }, color: DS.ink, border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, px: 1.5, py: .75, fontSize: 12.5 }}>
                แก้ไข
              </Button>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" }, gap: 1.25 }}>
          {["Schema", "Server actions", "Audit log"].map((item, index) => (
            <Box key={item} sx={{ bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "18px", p: 1.75 }}>
              <Typography sx={{ color: "#B96449", fontSize: 11.5, fontWeight: 900, letterSpacing: ".08em" }}>NEXT STEP {index + 1}</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 900, mt: .45 }}>{item}</Typography>
              <Typography sx={{ color: DS.gray, fontSize: 12.8, lineHeight: 1.65, mt: .35 }}>ต่อ database และ permission check ก่อนเปิดให้แก้ข้อมูลจริง</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </AdminChrome>
  );
}
