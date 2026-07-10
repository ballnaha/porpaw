"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Button, Container, IconButton, ThemeProvider, Typography } from "@mui/material";
import { ArrowRight, CalendarDays, Check, Minus, PackageCheck, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import { BackButton } from "../components/BackButton";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Footer } from "../components/Footer";
import { DS, theme } from "../components/DesignSystem";
import { useCart } from "../components/CartProvider";
import { MobileBottomNav } from "../components/MobileBottomNav";
import { PackageAddOnDialog } from "./PackageAddOnDialog";

const lineUrl = "https://line.me/R/ti/p/@baebite";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const [activePackageId, setActivePackageId] = useState<number | null>(null);
  const hasPackage = items.some((item) => item.packageContents);
  const shipping = items.length === 0 || hasPackage || subtotal >= 1000 ? 0 : 79;
  const total = subtotal + shipping;
  const openLine = () => { window.location.href = lineUrl; };
  const activePackage = items.find((item) => item.id === activePackageId && item.packageContents);

  return <ThemeProvider theme={theme}>
    <Sidebar sectionBase="/" activeItem="Shop" />
    <Box sx={{ minHeight: "100vh", bgcolor: "#FCFBFA", color: DS.ink, pb: { xs: 10, md: 0 }, pl: { lg: "104px" } }}>
      <Navbar handleLineLogin={openLine} isConnecting={false} />
      <Container component="main" maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3, lg: 1 }, py: { xs: 3, md: 5 } }}>
        <BackButton fallbackHref="/shop" preferHistory bottomSpacing={2}>
          เลือกสินค้าต่อ
        </BackButton>
        <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 2, mb: 3 }}>
          <Box><Typography sx={{ fontSize: { xs: 30, md: 37 }, fontWeight: 700, letterSpacing: "-.02em" }}>ตะกร้าของคุณ</Typography><Typography sx={{ color: DS.gray, fontSize: 14, fontWeight: 400, mt: .5 }}>{items.length ? `${items.length} รายการในตะกร้า` : "ยังไม่มีสินค้าในตะกร้า"}</Typography></Box>
          {items.length > 0 && <Typography sx={{ display: { xs: "none", sm: "block" }, color: "#60906F", fontSize: 13, fontWeight: 600 }}>ส่งฟรีเมื่อครบ ฿1,000</Typography>}
        </Box>

        {items.length === 0 ? <Box sx={{ display: "grid", placeItems: "center", textAlign: "center", minHeight: 390, bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "28px", p: 4 }}><Box><Box sx={{ width: 76, height: 76, display: "grid", placeItems: "center", mx: "auto", bgcolor: DS.peachSoft, color: "#B96449", borderRadius: "24px" }}><ShoppingBag size={32} /></Box><Typography sx={{ fontSize: 22, fontWeight: 700, mt: 2 }}>ตะกร้ายังว่างอยู่</Typography><Typography sx={{ color: DS.gray, fontSize: 14, fontWeight: 400, mt: .5 }}>ลองเลือกอาหารหรือขนมที่เหมาะกับน้องก่อนนะ</Typography><Button component={Link} href="/shop" endIcon={<ArrowRight size={16} />} sx={{ bgcolor: DS.ink, color: DS.white, borderRadius: DS.radius.pill, px: 3, py: 1.1, mt: 2.5, fontSize: 14, fontWeight: 600, "&:hover": { bgcolor: "#44444D" } }}>ไปหน้าร้านค้า</Button></Box></Box> :
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0,1fr) 360px" }, gap: { xs: 2, lg: 3 }, alignItems: "start" }}>
            <Box sx={{ display: "grid", gap: 1.25 }}>
              {items.filter((item) => !item.packageId).map((item) => {
                const addOns = items.filter((addOn) => addOn.packageId === item.id);

                return <Box key={item.id} sx={{ display: "grid", gridTemplateColumns: { xs: "82px 1fr", sm: "120px 1fr auto" }, alignItems: item.packageContents ? "start" : "center", gap: { xs: 1.5, sm: 2 }, bgcolor: DS.white, border: `1px solid ${item.packageContents ? "#E8DDD4" : DS.line}`, borderRadius: "20px", p: { xs: 1.25, sm: item.packageContents ? 2 : 1.5 }, boxShadow: item.packageContents ? "0 10px 30px rgba(73, 55, 42, .05)" : "none" }}>
                  <Box sx={{ position: "relative", width: "100%", height: { xs: 82, sm: item.packageContents ? 120 : 100 }, bgcolor: item.packageContents ? "#FFF7F1" : "#FAF4EF", borderRadius: "15px", overflow: "hidden" }}><Image src={item.image} alt={item.name} fill sizes="120px" style={{ objectFit: "contain", padding: 8 }} /></Box>
                  <Box sx={{ minWidth: 0 }}>
                    {item.packageContents && <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: .65, mb: .8 }}><Typography sx={{ display: "inline-flex", alignItems: "center", gap: .6, color: "#A65F45", bgcolor: DS.peachSoft, borderRadius: DS.radius.pill, px: 1.1, py: .45, fontSize: 10.5, fontWeight: 700, letterSpacing: ".04em" }}><PackageCheck size={13} />แพ็กเกจรายรอบ</Typography><Typography sx={{ display: "inline-flex", alignItems: "center", color: item.petType === "cat" ? "#65569B" : "#4D7D5B", bgcolor: item.petType === "cat" ? "#F0EDFA" : "#EAF6EE", borderRadius: DS.radius.pill, px: 1.1, py: .45, fontSize: 10.5, fontWeight: 700 }}>{item.petType === "cat" ? "สำหรับแมว" : "สำหรับสุนัข"}</Typography></Box>}
                    <Typography sx={{ fontSize: { xs: 16, sm: item.packageContents ? 20 : 18 }, fontWeight: 700, lineHeight: 1.3 }}>{item.name}</Typography>
                    {item.packageContents ? <Box sx={{ display: "flex", flexWrap: "wrap", gap: .75, mt: .8 }}>
                      {item.weight.split(" • ").map((meta, index) => <Box key={meta} sx={{ display: "inline-flex", alignItems: "center", gap: .55, color: DS.gray, bgcolor: "#F8F7F5", border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, px: 1, py: .5 }}>
                        {index === 0 ? <Check size={12} color="#60906F" /> : <CalendarDays size={12} color="#B96449" />}
                        <Typography sx={{ fontSize: 11.5, fontWeight: 500 }}>{meta}</Typography>
                      </Box>)}
                    </Box> : <Typography sx={{ color: DS.gray, fontSize: 12.5, fontWeight: 500, mt: .35 }}>{item.weight}</Typography>}
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: .6, mt: item.packageContents ? 1.4 : .85 }}><Typography sx={{ fontSize: { xs: 18, sm: 20 }, fontWeight: 700 }}>฿{item.price.toLocaleString()}</Typography>{item.packageContents && <Typography sx={{ color: DS.gray, fontSize: 11 }}>/ รอบจัดส่ง</Typography>}</Box>
                  </Box>
                  <Box sx={{ gridColumn: { xs: "1 / -1", sm: "auto" }, display: "flex", alignItems: "center", justifyContent: { xs: "space-between", sm: "flex-end" }, gap: 1 }}>
                    {item.packageContents ? <Box sx={{ display: "flex", alignItems: "center", gap: .75 }}><Typography sx={{ color: DS.gray, bgcolor: "#F8F7F5", border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, px: 1.25, py: .7, fontSize: 11.5, fontWeight: 600 }}>1 แพ็กเกจ / รอบ</Typography><Button component={Link} href={`/configure?plan=${encodeURIComponent(item.name.replace("แพ็กเกจ ", "").split(" • ")[0])}&editPackageId=${item.id}${item.petType ? `&species=${item.petType}` : ""}`} sx={{ color: "#A65F45", border: "1px solid #F0D2C2", borderRadius: DS.radius.pill, px: 1.4, py: .65, fontSize: 11.5, fontWeight: 600 }}>แก้ไขแพ็กเกจ</Button></Box> : <Box sx={{ display: "flex", alignItems: "center", border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, p: .35 }}><IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="ลดจำนวน"><Minus size={14} /></IconButton><Typography sx={{ width: 34, textAlign: "center", fontSize: 13, fontWeight: 600 }}>{item.quantity}</Typography><IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="เพิ่มจำนวน"><Plus size={14} /></IconButton></Box>}
                    <IconButton onClick={() => removeItem(item.id)} aria-label={`ลบ ${item.name}`} sx={{ color: DS.gray, "&:hover": { color: "#D35F5F", bgcolor: "#FFF0F0" } }}><Trash2 size={17} /></IconButton>
                  </Box>
                  {item.packageContents && <Box sx={{ gridColumn: "1 / -1", pt: 1.35, borderTop: `1px solid ${DS.line}` }}>
                    <Typography sx={{ color: DS.gray, fontSize: { xs: 12, sm: 13 }, fontWeight: 800, letterSpacing: ".04em", mb: 1 }}>สินค้าในแพ็กเกจ</Typography>
                    <Box sx={{ display: "grid", gap: .75 }}>
                      {item.packageContents.map((content, index) => {
                        const details = content.split(" • ");
                        const quantity = details.at(-1)?.startsWith("x") ? details.pop() : null;
                        const title = details.shift();
                        return <Box key={content} sx={{ display: "grid", gridTemplateColumns: "28px minmax(0, 1fr) auto", alignItems: "center", gap: 1, py: .65 }}>
                          <Box sx={{ width: 28, height: 28, display: "grid", placeItems: "center", color: "#A65F45", bgcolor: "#FFF1E9", borderRadius: "9px", fontSize: 12, fontWeight: 800 }}>{index + 1}</Box>
                          <Box sx={{ minWidth: 0 }}><Typography sx={{ fontSize: { xs: 14, sm: 15 }, fontWeight: 700, lineHeight: 1.35 }}>{title}</Typography><Typography sx={{ color: DS.gray, fontSize: { xs: 12.5, sm: 13.5 }, fontWeight: 400, lineHeight: 1.5, mt: .1 }}>{details.join(" • ")}</Typography></Box>
                          {quantity && <Typography sx={{ color: "#A65F45", bgcolor: "#FFF3EC", borderRadius: DS.radius.pill, px: 1, py: .4, fontSize: 12, fontWeight: 800 }}>{quantity}</Typography>}
                        </Box>;
                      })}
                    </Box>
                  </Box>}
                  {item.packageContents && <Box sx={{ gridColumn: "1 / -1", pt: 1.35, borderTop: `1px solid ${DS.line}` }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.25, mb: addOns.length ? 1.25 : 0 }}><Box><Typography sx={{ fontSize: { xs: 14, sm: 15 }, fontWeight: 800 }}>สินค้าเสริมประจำแพ็กเกจ</Typography><Typography sx={{ color: DS.gray, fontSize: { xs: 12, sm: 13 }, mt: .2, lineHeight: 1.45 }}>จัดส่งพร้อมแพ็กเกจทุกรอบ · คิดเพิ่มตามจำนวน</Typography></Box><Button onClick={() => setActivePackageId(item.id)} startIcon={<Plus size={15} />} sx={{ flexShrink: 0, color: "#A65F45", bgcolor: "#FFF4ED", borderRadius: DS.radius.pill, px: 1.6, py: .75, fontSize: 12.5, fontWeight: 700, "&:hover": { bgcolor: "#FFE9DC" } }}>เพิ่มสินค้า</Button></Box>
                    {addOns.length > 0 && <Box sx={{ display: "grid", gap: .85 }}>
                      {addOns.map((addOn) => <Box key={addOn.id} sx={{ display: "grid", gridTemplateColumns: "52px minmax(0,1fr) auto", alignItems: "center", gap: 1.25, bgcolor: "#FAF9F7", border: `1px solid ${DS.line}`, borderRadius: "14px", p: 1 }}>
                        <Box sx={{ position: "relative", width: 52, height: 52, bgcolor: DS.white, borderRadius: "11px", overflow: "hidden" }}><Image src={addOn.image} alt="" fill sizes="52px" style={{ objectFit: "contain", padding: 5 }} /></Box>
                        <Box sx={{ minWidth: 0 }}><Typography noWrap sx={{ fontSize: { xs: 14, sm: 15 }, fontWeight: 700 }}>{addOn.name}</Typography><Typography sx={{ color: DS.gray, fontSize: { xs: 12, sm: 13 }, lineHeight: 1.45 }}>{addOn.weight}</Typography><Typography sx={{ fontSize: { xs: 14, sm: 15 }, fontWeight: 800, mt: .25 }}>฿{addOn.price.toLocaleString()}</Typography></Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: .3 }}><IconButton size="small" onClick={() => updateQuantity(addOn.id, addOn.quantity - 1)} aria-label={`ลดจำนวน ${addOn.name}`}><Minus size={14} /></IconButton><Typography sx={{ minWidth: 22, textAlign: "center", fontSize: 13, fontWeight: 700 }}>{addOn.quantity}</Typography><IconButton size="small" onClick={() => updateQuantity(addOn.id, addOn.quantity + 1)} aria-label={`เพิ่มจำนวน ${addOn.name}`}><Plus size={14} /></IconButton><IconButton size="small" onClick={() => removeItem(addOn.id)} aria-label={`ลบ ${addOn.name}`} sx={{ color: DS.gray, ml: .25, "&:hover": { color: "#D35F5F" } }}><Trash2 size={15} /></IconButton></Box>
                      </Box>)}
                    </Box>}
                  </Box>}
                </Box>;
              })}
            </Box>

            <Box sx={{ position: { lg: "sticky" }, top: 20, bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "24px", p: { xs: 2.25, md: 2.75 }, boxShadow: DS.cardShadow }}>
              <Typography sx={{ fontSize: 20, fontWeight: 700 }}>สรุปคำสั่งซื้อ</Typography>
              <Box sx={{ display: "grid", gap: 1.2, py: 2, mt: 1, borderBottom: `1px solid ${DS.line}` }}><Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography sx={{ color: DS.gray, fontSize: 13.5, fontWeight: 400 }}>ยอดสินค้า</Typography><Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>฿{subtotal.toLocaleString()}</Typography></Box><Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography sx={{ color: DS.gray, fontSize: 13.5, fontWeight: 400 }}>ค่าจัดส่ง</Typography><Typography sx={{ color: shipping === 0 ? "#60906F" : DS.ink, fontSize: 13.5, fontWeight: 600 }}>{shipping === 0 ? "ฟรี" : `฿${shipping}`}</Typography></Box></Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", py: 2 }}><Typography sx={{ fontSize: 15, fontWeight: 600 }}>ยอดรวม</Typography><Typography sx={{ fontSize: 28, fontWeight: 700 }}>฿{total.toLocaleString()}</Typography></Box>
              <Button component={Link} href="/checkout" endIcon={<ArrowRight size={17} />} fullWidth sx={{ bgcolor: DS.peach, color: DS.ink, borderRadius: DS.radius.pill, py: 1.25, fontSize: 15, fontWeight: 700, "&:hover": { bgcolor: "#F1A986" } }}>ดำเนินการชำระเงิน</Button>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}><Typography sx={{ display: "flex", alignItems: "center", gap: .5, color: DS.gray, fontSize: 10.5 }}><ShieldCheck size={14} />ชำระเงินปลอดภัย</Typography><Typography sx={{ display: "flex", alignItems: "center", gap: .5, color: DS.gray, fontSize: 10.5 }}><Truck size={14} />จัดส่งทั่วประเทศ</Typography></Box>
            </Box>
          </Box>}
      </Container>
      <Box sx={{ display: { xs: "none", md: "block" } }}><Footer /></Box>
      <MobileBottomNav />
    </Box>
    <PackageAddOnDialog open={activePackageId !== null} packageItem={activePackage} onClose={() => setActivePackageId(null)} />
  </ThemeProvider>;
}
