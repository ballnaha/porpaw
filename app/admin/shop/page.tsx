import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminChrome } from "../_components/AdminChrome";
import { ShopAdminTabs } from "./ShopAdminTabs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminShopPage() {
  const session = await auth();

  if (session?.user.role !== "ADMIN") redirect("/admin/login");

  return (
    <AdminChrome
      title="จัดการสินค้า"
      detail="เพิ่มสินค้าและตรวจข้อมูลที่ใช้ร่วมกับหน้าร้าน /shop และหน้ารายละเอียด /shop/[slug]"
      userName={session.user.name ?? "baebite Admin"}
      active="shop"
    >
      <ShopAdminTabs />
    </AdminChrome>
  );
}
