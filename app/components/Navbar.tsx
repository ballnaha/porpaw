"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Container, Typography, Button, Drawer, IconButton } from "@mui/material";
import { ArrowRight, Minus, Plus, ShoppingBag, ShoppingCart, Trash2, X } from "lucide-react";
import { DS } from "./DesignSystem";
import { useCart } from "./CartProvider";

interface NavbarProps {
  handleLineLogin: () => void;
  isConnecting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  handleLineLogin,
  isConnecting,
}) => {
  const [cartOpen, setCartOpen] = useState(false);
  const { items, itemCount, subtotal, updateQuantity, removeItem } = useCart();
  const hasPackage = items.some((item) => item.packageContents);
  const shipping = items.length === 0 || hasPackage || subtotal >= 1000 ? 0 : 79;
  return (
    <Container
      maxWidth="lg"
      id="top"
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        pt: { xs: 2.5, md: 4.5 },
        pb: { xs: 1, md: 1.5 },
        px: { xs: 2.5, sm: 3, lg: 1 },
      }}
    >
      {/* Brand */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Image
          src="/images/logo.png"
          alt="Porpaw"
          width={1191}
          height={346}
          priority
          style={{
            width: "auto",
            height: "clamp(30px, 6vw, 42px)",
            objectFit: "contain",
          }}
        />
        <Typography
          sx={{
            display: { xs: "none", sm: "block" },
            fontSize: "14px",
            color: DS.gray,
            fontWeight: 400,
          }}
        >
          พ.พาว
        </Typography>
      </Box>

      {/* Right actions */}
      <Box
        sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1.5 }}
      >
        <Button
          onClick={handleLineLogin}
          disableElevation
          sx={{
            display: { xs: "none", sm: "inline-flex" },
            border: `1px solid ${DS.line}`,
            borderRadius: DS.radius.pill,
            minWidth: 122,
            px: 2.5,
            py: 1,
            fontSize: 12,
            fontWeight: 800,
            color: DS.ink,
            bgcolor: DS.white,
            "&:hover": { borderColor: DS.ink, bgcolor: DS.white },
          }}
        >
          {isConnecting ? "กำลังเชื่อมต่อ…" : "Login / Register"}
        </Button>
        <IconButton
          onClick={() => setCartOpen(true)}
          aria-label="ตะกร้าสินค้า"
          sx={{
            position: "relative",
            width: 46,
            height: 46,
            bgcolor: DS.peach,
            color: DS.white,
            transition: "transform .2s",
            "&:hover": { bgcolor: DS.peach, transform: "scale(1.06)" },
          }}
        >
          <ShoppingCart size={20} strokeWidth={1.9} />
          {itemCount > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: -5,
                right: -5,
                minWidth: 21,
                height: 21,
                px: .55,
                display: "grid",
                placeItems: "center",
                bgcolor: DS.ink,
                color: DS.white,
                border: "2px solid white",
                borderRadius: DS.radius.pill,
                fontSize: 11,
                fontWeight: 600,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: 0,
                boxShadow: "0 3px 8px rgba(43,43,51,.18)",
              }}
            >
              {itemCount > 99 ? "99+" : itemCount}
            </Box>
          )}
        </IconButton>
      </Box>

      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        slotProps={{ paper: { sx: { width: { xs: "100%", sm: 430 }, bgcolor: "#FCFBFA" } } }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${DS.line}`, px: { xs: 2.25, sm: 2.75 }, py: 2 }}>
            <Box>
              <Typography sx={{ fontSize: 21, fontWeight: 700 }}>ตะกร้าของคุณ</Typography>
              <Typography sx={{ color: DS.gray, fontSize: 12.5, mt: .2 }}>{itemCount} ชิ้น</Typography>
            </Box>
            <IconButton onClick={() => setCartOpen(false)} aria-label="ปิดตะกร้า" sx={{ color: DS.gray }}><X size={20} /></IconButton>
          </Box>

          {items.length === 0 ? (
            <Box sx={{ flex: 1, display: "grid", placeItems: "center", textAlign: "center", p: 4 }}>
              <Box>
                <Box sx={{ width: 72, height: 72, display: "grid", placeItems: "center", mx: "auto", bgcolor: DS.peachSoft, color: "#B96449", borderRadius: "22px" }}><ShoppingCart size={29} /></Box>
                <Typography sx={{ fontSize: 20, fontWeight: 700, mt: 2 }}>ตะกร้ายังว่างอยู่</Typography>
                <Typography sx={{ color: DS.gray, fontSize: 13.5, mt: .5 }}>เลือกสินค้าที่เหมาะกับน้องก่อนนะ</Typography>
                <Button component={Link} href="/shop" onClick={() => setCartOpen(false)} sx={{ bgcolor: DS.ink, color: DS.white, borderRadius: DS.radius.pill, px: 3, py: 1.05, mt: 2.25, "&:hover": { bgcolor: "#44444D" } }}>เลือกซื้อสินค้า</Button>
              </Box>
            </Box>
          ) : (
            <>
              <Box sx={{ flex: 1, overflowY: "auto", display: "grid", alignContent: "start", gap: 1, p: { xs: 1.5, sm: 2 } }}>
                {items.map((item) => (
                  <Box key={item.id} sx={{ display: "grid", gridTemplateColumns: "76px minmax(0,1fr) auto", alignItems: "center", gap: 1.25, bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "17px", p: 1 }}>
                    <Box sx={{ position: "relative", width: 76, height: 76, bgcolor: "#FAF4EF", borderRadius: "13px", overflow: "hidden" }}><Image src={item.image} alt={item.name} fill sizes="76px" style={{ objectFit: "contain", padding: 6 }} /></Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography noWrap sx={{ fontSize: 14, fontWeight: 700 }}>{item.name}</Typography>
                      <Typography sx={{ color: DS.gray, fontSize: 11.5, mt: .2 }}>{item.weight}</Typography>{item.packageId && <Typography sx={{ color: "#568768", fontSize: 10.5, mt: .15 }}>ส่งพร้อม {item.packageName} ทุกรอบ</Typography>}
                      <Typography sx={{ fontSize: 14.5, fontWeight: 700, mt: .5 }}>฿{item.price.toLocaleString()}</Typography>
                      {item.packageContents ? <Typography sx={{ display: "inline-flex", color: DS.gray, bgcolor: "#F8F7F5", border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, px: 1, py: .45, fontSize: 10.5, fontWeight: 600, mt: .75 }}>1 แพ็กเกจ / รอบ</Typography> : <Box sx={{ display: "inline-flex", alignItems: "center", border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, mt: .75, p: .15 }}><IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="ลดจำนวน"><Minus size={12} /></IconButton><Typography sx={{ width: 28, textAlign: "center", fontSize: 12, fontWeight: 600 }}>{item.quantity}</Typography><IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="เพิ่มจำนวน"><Plus size={12} /></IconButton></Box>}
                    </Box>
                    <IconButton onClick={() => removeItem(item.id)} aria-label={`ลบ ${item.name}`} sx={{ alignSelf: "start", color: DS.gray, p: .75, "&:hover": { color: "#D35F5F", bgcolor: "#FFF0F0" } }}><Trash2 size={16} /></IconButton>
                  </Box>
                ))}
              </Box>

              <Box sx={{ bgcolor: DS.white, borderTop: `1px solid ${DS.line}`, p: { xs: 2.25, sm: 2.75 }, boxShadow: "0 -12px 32px rgba(43,43,51,.06)" }}>
                <Box sx={{ display: "grid", gap: .9 }}><Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography sx={{ color: DS.gray, fontSize: 13 }}>ยอดสินค้า</Typography><Typography sx={{ fontSize: 13, fontWeight: 600 }}>฿{subtotal.toLocaleString()}</Typography></Box><Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography sx={{ color: DS.gray, fontSize: 13 }}>ค่าจัดส่ง</Typography><Typography sx={{ color: shipping === 0 ? "#60906F" : DS.ink, fontSize: 13, fontWeight: 600 }}>{shipping === 0 ? "ฟรี" : `฿${shipping}`}</Typography></Box></Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: `1px solid ${DS.line}`, mt: 1.5, pt: 1.5 }}><Typography sx={{ fontSize: 15, fontWeight: 700 }}>ยอดรวม</Typography><Typography sx={{ fontSize: 25, fontWeight: 700 }}>฿{(subtotal + shipping).toLocaleString()}</Typography></Box>
                <Button component={Link} href="/checkout" onClick={() => setCartOpen(false)} endIcon={<ArrowRight size={17} />} fullWidth sx={{ bgcolor: DS.ink, color: DS.white, borderRadius: DS.radius.pill, py: 1.25, fontSize: 15, fontWeight: 700, mt: 1.75, boxShadow: "0 8px 20px rgba(43,43,51,.16)", "&:hover": { bgcolor: "#44444D", boxShadow: "0 10px 24px rgba(43,43,51,.2)" } }}>ไปหน้าชำระเงิน</Button>
                <Button component={Link} href="/cart" onClick={() => setCartOpen(false)} startIcon={<ShoppingBag size={15} />} fullWidth sx={{ color: DS.ink, bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, py: 1.05, fontSize: 13, fontWeight: 500, mt: 1, "&:hover": { bgcolor: "#F8F7F5", borderColor: "#D9D9DD" } }}>ดูตะกร้าแบบเต็มหน้า</Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </Container>
  );
};
