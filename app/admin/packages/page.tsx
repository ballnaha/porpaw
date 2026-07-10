import { AdminModulePlaceholder } from "../_components/AdminModulePlaceholder";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminPackagesPage() {
  return (
    <AdminModulePlaceholder
      title="จัดการ Package Tier"
      detail="กำหนดเกรดอาหาร ราคา และสถานะการขาย โดยรอบส่งมาตรฐานคือ 1 เดือนทุก tier"
      active="packages"
      primaryAction="เพิ่ม Tier"
      rows={[
        { name: "Essential", meta: "฿1,190 / เดือน · เกรดมาตรฐานสำหรับดูแลประจำวัน", status: "เปิดใช้งาน", accent: "#FFF2E9" },
        { name: "Plus", meta: "฿1,590 / เดือน · เกรดแนะนำ วัตถุดิบและสารบำรุงดีขึ้น", status: "เปิดใช้งาน", accent: "#EEF7F0" },
        { name: "Premium", meta: "฿2,190 / เดือน · เกรดสูงสำหรับน้องแพ้ง่ายหรือสุขภาพเฉพาะ", status: "เปิดใช้งาน", accent: "#F1EEFA" },
      ]}
    />
  );
}
