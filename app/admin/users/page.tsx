import { AdminModulePlaceholder } from "../_components/AdminModulePlaceholder";

export default function AdminUsersPage() {
  return (
    <AdminModulePlaceholder
      title="จัดการผู้ใช้"
      detail="เตรียมพื้นที่สำหรับดูบัญชี LINE User ID ประวัติ package และสิทธิ์เข้าถึงสูตรอาหารของลูกค้า"
      active="users"
      primaryAction="เพิ่มผู้ใช้"
      rows={[
        { name: "LINE Dev User", meta: "dev-line-user", status: "เปิดใช้งาน", accent: "#EEF7F0" },
        { name: "Awaiting LINE Login", meta: "รอสมาชิกเชื่อมบัญชีจริง", status: "Draft", accent: "#FFF8E7" },
        { name: "Admin", meta: "ZoomieDash internal account", status: "เปิดใช้งาน", accent: "#F1EEFA" },
      ]}
    />
  );
}
