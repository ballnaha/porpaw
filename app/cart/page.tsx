"use client";

import Image from "next/image";
import Link from "next/link";
import { Box, Button, Container, IconButton, ThemeProvider, Typography } from "@mui/material";
import { ArrowLeft, ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Footer } from "../components/Footer";
import { DS, theme } from "../components/DesignSystem";
import { useCart } from "../components/CartProvider";
import { MobileBottomNav } from "../components/MobileBottomNav";

const lineUrl = "https://line.me/R/ti/p/@porpaw";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const shipping = items.length === 0 || subtotal >= 1000 ? 0 : 79;
  const total = subtotal + shipping;
  const openLine = () => { window.location.href = lineUrl; };

  return <ThemeProvider theme={theme}>
    <Sidebar sectionBase="/" activeItem="Shop" />
    <Box sx={{ minHeight: "100vh", bgcolor: "#FCFBFA", color: DS.ink, pb: { xs: 10, md: 0 }, pl: { lg: "104px" } }}>
      <Navbar handleLineLogin={openLine} isConnecting={false} />
      <Container component="main" maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3, lg: 1 }, py: { xs: 3, md: 5 } }}>
        <Button component={Link} href="/shop" startIcon={<ArrowLeft size={16} />} sx={{ color: DS.gray, px: 0, mb: 2 }}>เลือกสินค้าต่อ</Button>
        <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 2, mb: 3 }}>
          <Box><Typography sx={{ fontSize: { xs: 29, md: 38 }, fontWeight: 800, letterSpacing: "-.025em" }}>ตะกร้าของคุณ</Typography><Typography sx={{ color: DS.gray, fontSize: 14, mt: .5 }}>{items.length ? `${items.length} รายการในตะกร้า` : "ยังไม่มีสินค้าในตะกร้า"}</Typography></Box>
          {items.length > 0 && <Typography sx={{ display: { xs: "none", sm: "block" }, color: "#60906F", fontSize: 13, fontWeight: 700 }}>ส่งฟรีเมื่อครบ ฿1,000</Typography>}
        </Box>

        {items.length === 0 ? <Box sx={{ display: "grid", placeItems: "center", textAlign: "center", minHeight: 390, bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "28px", p: 4 }}><Box><Box sx={{ width: 76, height: 76, display: "grid", placeItems: "center", mx: "auto", bgcolor: DS.peachSoft, color: "#B96449", borderRadius: "24px" }}><ShoppingBag size={32} /></Box><Typography sx={{ fontSize: 23, fontWeight: 800, mt: 2 }}>ตะกร้ายังว่างอยู่</Typography><Typography sx={{ color: DS.gray, fontSize: 14, mt: .5 }}>ลองเลือกอาหารหรือขนมที่เหมาะกับน้องก่อนนะ</Typography><Button component={Link} href="/shop" endIcon={<ArrowRight size={16} />} sx={{ bgcolor: DS.ink, color: DS.white, borderRadius: DS.radius.pill, px: 3, py: 1.1, mt: 2.5, "&:hover": { bgcolor: "#44444D" } }}>ไปหน้าร้านค้า</Button></Box></Box> :
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0,1fr) 360px" }, gap: { xs: 2, lg: 3 }, alignItems: "start" }}>
            <Box sx={{ display: "grid", gap: 1.25 }}>
              {items.map((item) => <Box key={item.id} sx={{ display: "grid", gridTemplateColumns: { xs: "82px 1fr", sm: "110px 1fr auto" }, alignItems: "center", gap: { xs: 1.5, sm: 2 }, bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "20px", p: { xs: 1.25, sm: 1.5 } }}>
                <Box sx={{ position: "relative", width: "100%", height: { xs: 82, sm: 100 }, bgcolor: "#FAF4EF", borderRadius: "15px", overflow: "hidden" }}><Image src={item.image} alt={item.name} fill sizes="110px" style={{ objectFit: "contain", padding: 8 }} /></Box>
                <Box sx={{ minWidth: 0 }}><Typography sx={{ fontSize: { xs: 15, sm: 17 }, fontWeight: 800 }}>{item.name}</Typography><Typography sx={{ color: DS.gray, fontSize: 12, mt: .3 }}>{item.weight}</Typography><Typography sx={{ fontSize: 17, fontWeight: 800, mt: .75 }}>฿{item.price.toLocaleString()}</Typography></Box>
                <Box sx={{ gridColumn: { xs: "1 / -1", sm: "auto" }, display: "flex", alignItems: "center", justifyContent: { xs: "space-between", sm: "flex-end" }, gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, p: .35 }}><IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="ลดจำนวน"><Minus size={14} /></IconButton><Typography sx={{ width: 34, textAlign: "center", fontSize: 13, fontWeight: 800 }}>{item.quantity}</Typography><IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="เพิ่มจำนวน"><Plus size={14} /></IconButton></Box>
                  <IconButton onClick={() => removeItem(item.id)} aria-label={`ลบ ${item.name}`} sx={{ color: DS.gray, "&:hover": { color: "#D35F5F", bgcolor: "#FFF0F0" } }}><Trash2 size={17} /></IconButton>
                </Box>
              </Box>)}
            </Box>

            <Box sx={{ position: { lg: "sticky" }, top: 20, bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "24px", p: { xs: 2.25, md: 2.75 }, boxShadow: DS.cardShadow }}>
              <Typography sx={{ fontSize: 20, fontWeight: 800 }}>สรุปคำสั่งซื้อ</Typography>
              <Box sx={{ display: "grid", gap: 1.2, py: 2, mt: 1, borderBottom: `1px solid ${DS.line}` }}><Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography sx={{ color: DS.gray, fontSize: 13.5 }}>ยอดสินค้า</Typography><Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>฿{subtotal.toLocaleString()}</Typography></Box><Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography sx={{ color: DS.gray, fontSize: 13.5 }}>ค่าจัดส่ง</Typography><Typography sx={{ color: shipping === 0 ? "#60906F" : DS.ink, fontSize: 13.5, fontWeight: 700 }}>{shipping === 0 ? "ฟรี" : `฿${shipping}`}</Typography></Box></Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", py: 2 }}><Typography sx={{ fontSize: 15, fontWeight: 700 }}>ยอดรวม</Typography><Typography sx={{ fontSize: 28, fontWeight: 900 }}>฿{total.toLocaleString()}</Typography></Box>
              <Button component={Link} href="/checkout" endIcon={<ArrowRight size={17} />} fullWidth sx={{ bgcolor: DS.peach, color: DS.ink, borderRadius: DS.radius.pill, py: 1.25, fontSize: 15, fontWeight: 800, "&:hover": { bgcolor: "#F1A986" } }}>ดำเนินการชำระเงิน</Button>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}><Typography sx={{ display: "flex", alignItems: "center", gap: .5, color: DS.gray, fontSize: 10.5 }}><ShieldCheck size={14} />ชำระเงินปลอดภัย</Typography><Typography sx={{ display: "flex", alignItems: "center", gap: .5, color: DS.gray, fontSize: 10.5 }}><Truck size={14} />จัดส่งทั่วประเทศ</Typography></Box>
            </Box>
          </Box>}
      </Container>
      <Box sx={{ display: { xs: "none", md: "block" } }}><Footer /></Box>
      <MobileBottomNav />
    </Box>
  </ThemeProvider>;
}
