"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Button, Container, FormControlLabel, Radio, RadioGroup, TextField, ThemeProvider, Typography } from "@mui/material";
import { ArrowLeft, Check, CreditCard, Landmark, MapPin, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Footer } from "../components/Footer";
import { DS, theme } from "../components/DesignSystem";
import { useCart } from "../components/CartProvider";
import { MobileBottomNav } from "../components/MobileBottomNav";

const lineUrl = "https://line.me/R/ti/p/@porpaw";
const fieldSx = { "& .MuiOutlinedInput-root": { bgcolor: DS.white, borderRadius: "14px", "& fieldset": { borderColor: DS.line }, "&:hover fieldset": { borderColor: DS.peach }, "&.Mui-focused fieldset": { borderColor: DS.peach } }, "& .MuiInputLabel-root.Mui-focused": { color: "#B96449" } };

function StepHeader({ number, title, icon: Icon }: { number: number; title: string; icon: typeof MapPin }) {
  return <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}><Box sx={{ width: 36, height: 36, display: "grid", placeItems: "center", bgcolor: DS.peachSoft, color: "#B96449", borderRadius: "11px" }}><Icon size={18} /></Box><Box><Typography sx={{ color: DS.gray, fontSize: 10.5, fontWeight: 800, letterSpacing: ".08em" }}>STEP {number}</Typography><Typography sx={{ fontSize: 18, fontWeight: 800 }}>{title}</Typography></Box></Box>;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [payment, setPayment] = useState("promptpay");
  const [completedTotal, setCompletedTotal] = useState<number | null>(null);
  const shipping = items.length === 0 || subtotal >= 1000 ? 0 : 79;
  const total = subtotal + shipping;
  const openLine = () => { window.location.href = lineUrl; };

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCompletedTotal(total);
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (completedTotal !== null) return <ThemeProvider theme={theme}><Box sx={{ minHeight: "100vh", bgcolor: "#FCFBFA", display: "grid", placeItems: "center", p: 3 }}><Box sx={{ width: "100%", maxWidth: 560, textAlign: "center", bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "28px", p: { xs: 3, md: 5 }, boxShadow: DS.cardShadow }}><Box sx={{ width: 76, height: 76, display: "grid", placeItems: "center", mx: "auto", bgcolor: DS.mint, color: "#568768", borderRadius: "50%" }}><Check size={36} strokeWidth={2.5} /></Box><Typography sx={{ fontSize: { xs: 27, md: 34 }, fontWeight: 900, mt: 2 }}>รับคำสั่งซื้อแล้ว</Typography><Typography sx={{ color: DS.gray, fontSize: 14.5, lineHeight: 1.65, mt: 1 }}>ยอดชำระ ฿{completedTotal.toLocaleString()}<br />นี่เป็น Checkout Mockup ระบบยังไม่ได้เรียกเก็บเงินจริง</Typography><Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "center", gap: 1, mt: 3 }}><Button component={Link} href="/shop" sx={{ bgcolor: DS.ink, color: DS.white, borderRadius: DS.radius.pill, px: 3, py: 1.1 }}>กลับไปหน้าร้าน</Button><Button onClick={openLine} startIcon={<MessageCircle size={16} />} sx={{ color: DS.ink, border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, px: 3 }}>ติดต่อผ่าน LINE</Button></Box></Box></Box></ThemeProvider>;

  return <ThemeProvider theme={theme}>
    <Sidebar sectionBase="/" activeItem="Shop" />
    <Box sx={{ minHeight: "100vh", bgcolor: "#FCFBFA", color: DS.ink, pb: { xs: 10, md: 0 }, pl: { lg: "104px" } }}>
      <Navbar handleLineLogin={openLine} isConnecting={false} />
      <Container component="main" maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3, lg: 1 }, py: { xs: 3, md: 5 } }}>
        <Button component={Link} href="/cart" startIcon={<ArrowLeft size={16} />} sx={{ color: DS.gray, px: 0, mb: 2 }}>กลับไปตะกร้า</Button>
        <Typography sx={{ fontSize: { xs: 29, md: 38 }, fontWeight: 900, letterSpacing: "-.025em" }}>Checkout</Typography>
        <Typography sx={{ color: DS.gray, fontSize: 14, mt: .5, mb: 3 }}>กรอกข้อมูลสำหรับจัดส่งและตรวจสอบคำสั่งซื้อ</Typography>

        {items.length === 0 ? <Box sx={{ textAlign: "center", bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "24px", p: 5 }}><Typography sx={{ fontSize: 22, fontWeight: 800 }}>ไม่มีสินค้าให้ชำระเงิน</Typography><Button component={Link} href="/shop" sx={{ bgcolor: DS.ink, color: DS.white, borderRadius: DS.radius.pill, px: 3, mt: 2 }}>เลือกสินค้า</Button></Box> :
          <Box component="form" onSubmit={submitOrder} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0,1fr) 390px" }, gap: { xs: 2, lg: 3 }, alignItems: "start" }}>
            <Box sx={{ display: "grid", gap: 2 }}>
              <Box sx={{ bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "22px", p: { xs: 2, md: 2.75 } }}>
                <StepHeader number={1} title="ข้อมูลผู้รับ" icon={MapPin} />
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}><TextField required label="ชื่อ" size="small" sx={fieldSx} /><TextField required label="นามสกุล" size="small" sx={fieldSx} /><TextField required label="เบอร์โทรศัพท์" type="tel" size="small" sx={fieldSx} /><TextField required label="อีเมล" type="email" size="small" sx={fieldSx} /></Box>
              </Box>
              <Box sx={{ bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "22px", p: { xs: 2, md: 2.75 } }}>
                <StepHeader number={2} title="ที่อยู่จัดส่ง" icon={Truck} />
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}><TextField required label="บ้านเลขที่ / อาคาร / ถนน" size="small" sx={{ ...fieldSx, gridColumn: { sm: "1 / -1" } }} /><TextField required label="แขวง / ตำบล" size="small" sx={fieldSx} /><TextField required label="เขต / อำเภอ" size="small" sx={fieldSx} /><TextField required label="จังหวัด" size="small" sx={fieldSx} /><TextField required label="รหัสไปรษณีย์" size="small" sx={fieldSx} /><TextField label="หมายเหตุถึงผู้จัดส่ง" multiline rows={2} sx={{ ...fieldSx, gridColumn: { sm: "1 / -1" } }} /></Box>
              </Box>
              <Box sx={{ bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "22px", p: { xs: 2, md: 2.75 } }}>
                <StepHeader number={3} title="วิธีชำระเงิน" icon={CreditCard} />
                <RadioGroup value={payment} onChange={(event) => setPayment(event.target.value)} sx={{ gap: 1 }}><Box sx={{ border: `1px solid ${payment === "promptpay" ? DS.peach : DS.line}`, bgcolor: payment === "promptpay" ? "#FFF8F4" : DS.white, borderRadius: "14px", px: 1.25 }}><FormControlLabel value="promptpay" control={<Radio sx={{ color: DS.gray, "&.Mui-checked": { color: DS.peach } }} />} label={<Box><Typography sx={{ fontSize: 14, fontWeight: 700 }}>PromptPay / QR Code</Typography><Typography sx={{ color: DS.gray, fontSize: 11.5 }}>สแกนจ่ายผ่านแอปธนาคาร</Typography></Box>} /></Box><Box sx={{ border: `1px solid ${payment === "bank" ? DS.peach : DS.line}`, bgcolor: payment === "bank" ? "#FFF8F4" : DS.white, borderRadius: "14px", px: 1.25 }}><FormControlLabel value="bank" control={<Radio sx={{ color: DS.gray, "&.Mui-checked": { color: DS.peach } }} />} label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><Landmark size={17} /><Box><Typography sx={{ fontSize: 14, fontWeight: 700 }}>โอนผ่านธนาคาร</Typography><Typography sx={{ color: DS.gray, fontSize: 11.5 }}>แนบหลักฐานผ่าน LINE</Typography></Box></Box>} /></Box></RadioGroup>
              </Box>
            </Box>

            <Box sx={{ position: { lg: "sticky" }, top: 20, bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "24px", p: { xs: 2.25, md: 2.75 }, boxShadow: DS.cardShadow }}>
              <Typography sx={{ fontSize: 20, fontWeight: 800, mb: 1.5 }}>คำสั่งซื้อของคุณ</Typography>
              <Box sx={{ display: "grid", gap: 1.25, maxHeight: 285, overflowY: "auto", pr: .5 }}>{items.map((item) => <Box key={item.id} sx={{ display: "grid", gridTemplateColumns: "54px 1fr auto", alignItems: "center", gap: 1 }}><Box sx={{ position: "relative", width: 54, height: 54, bgcolor: "#FAF4EF", borderRadius: "11px" }}><Image src={item.image} alt="" fill sizes="54px" style={{ objectFit: "contain", padding: 5 }} /></Box><Box sx={{ minWidth: 0 }}><Typography noWrap sx={{ fontSize: 13, fontWeight: 700 }}>{item.name}</Typography><Typography sx={{ color: DS.gray, fontSize: 11 }}>จำนวน {item.quantity}</Typography></Box><Typography sx={{ fontSize: 13, fontWeight: 700 }}>฿{(item.price * item.quantity).toLocaleString()}</Typography></Box>)}</Box>
              <Box sx={{ display: "grid", gap: 1, borderTop: `1px solid ${DS.line}`, borderBottom: `1px solid ${DS.line}`, py: 1.75, mt: 1.75 }}><Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography sx={{ color: DS.gray, fontSize: 13 }}>ยอดสินค้า</Typography><Typography sx={{ fontSize: 13, fontWeight: 700 }}>฿{subtotal.toLocaleString()}</Typography></Box><Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography sx={{ color: DS.gray, fontSize: 13 }}>ค่าจัดส่ง</Typography><Typography sx={{ color: shipping === 0 ? "#60906F" : DS.ink, fontSize: 13, fontWeight: 700 }}>{shipping === 0 ? "ฟรี" : `฿${shipping}`}</Typography></Box></Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", py: 2 }}><Typography sx={{ fontSize: 15, fontWeight: 700 }}>ยอดชำระ</Typography><Typography sx={{ fontSize: 28, fontWeight: 900 }}>฿{total.toLocaleString()}</Typography></Box>
              <Button type="submit" fullWidth sx={{ bgcolor: DS.peach, color: DS.ink, borderRadius: DS.radius.pill, py: 1.25, fontSize: 15, fontWeight: 800, "&:hover": { bgcolor: "#F1A986" } }}>ยืนยันคำสั่งซื้อ</Button>
              <Typography sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: .5, color: DS.gray, fontSize: 10.5, textAlign: "center", mt: 1.5 }}><ShieldCheck size={14} />Checkout นี้เป็น Mockup ยังไม่มีการเรียกเก็บเงินจริง</Typography>
            </Box>
          </Box>}
      </Container>
      <Box sx={{ display: { xs: "none", md: "block" } }}><Footer /></Box>
      <MobileBottomNav />
    </Box>
  </ThemeProvider>;
}
