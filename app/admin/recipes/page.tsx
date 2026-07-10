import { AdminModulePlaceholder } from "../_components/AdminModulePlaceholder";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminRecipesPage() {
  return (
    <AdminModulePlaceholder
      title="จัดการสูตรดูแล"
      detail="สูตรเป็นเป้าหมายสุขภาพที่แยกจากราคา เช่น บำรุงขน เสริมภูมิ คุมน้ำหนัก และแพ้ง่าย"
      active="recipes"
      primaryAction="เพิ่มสูตร"
      rows={[
        { name: "บำรุงขน", meta: "สูตรดูแลผิวหนังและเส้นขน · multiplier 1.08", status: "เปิดใช้งาน", accent: "#FFF7F3" },
        { name: "เสริมภูมิ", meta: "สูตรเสริมสมดุลร่างกายและภูมิคุ้มกัน · multiplier 1.06", status: "เปิดใช้งาน", accent: "#EEF7F0" },
        { name: "แพ้ง่าย", meta: "สูตรคัดวัตถุดิบสำหรับน้องไวต่ออาหาร · multiplier 1.22", status: "เปิดใช้งาน", accent: "#F1EEFA" },
      ]}
    />
  );
}
