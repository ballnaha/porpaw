"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { Home, Package, ShoppingBag, ShoppingCart } from "lucide-react";
import { DS } from "./DesignSystem";
import { useCart } from "./CartProvider";

const ITEMS = [
  { label: "หน้าหลัก", href: "/", icon: Home, match: (path: string) => path === "/" },
  { label: "ร้านค้า", href: "/shop", icon: ShoppingBag, match: (path: string) => path.startsWith("/shop") },
  { label: "สมาชิก", href: "/#promo", icon: Package, match: () => false },
  { label: "ตะกร้า", href: "/cart", icon: ShoppingCart, match: (path: string) => path === "/cart" || path === "/checkout" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return <Box
    component="nav"
    aria-label="เมนูด้านล่าง"
    sx={{
      display: { xs: "grid", md: "none" },
      gridTemplateColumns: "repeat(4,1fr)",
      position: "fixed",
      zIndex: 1200,
      left: 10,
      right: 10,
      bottom: "max(10px, env(safe-area-inset-bottom))",
      height: 66,
      bgcolor: "rgba(255,255,255,.96)",
      border: `1px solid ${DS.line}`,
      borderRadius: "22px",
      boxShadow: "0 12px 36px rgba(43,43,51,.16)",
      backdropFilter: "blur(16px)",
      px: .5,
    }}
  >
    {ITEMS.map(({ label, href, icon: Icon, match }) => {
      const active = match(pathname);
      const isCart = label === "ตะกร้า";
      return <Box
        key={label}
        component={Link}
        href={href}
        aria-current={active ? "page" : undefined}
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: .35,
          color: active ? "#B96449" : "#77727A",
          textDecoration: "none",
          borderRadius: "18px",
          "&:active": { bgcolor: "#FFF4EE" },
        }}
      >
        <Box sx={{ position: "relative", display: "grid", placeItems: "center", width: 29, height: 26 }}>
          <Icon size={active ? 21 : 20} strokeWidth={active ? 2.4 : 1.8} />
          {isCart && itemCount > 0 && <Box sx={{ position: "absolute", top: -7, right: -9, minWidth: 18, height: 18, px: .4, display: "grid", placeItems: "center", bgcolor: DS.peach, color: DS.ink, border: "2px solid white", borderRadius: DS.radius.pill, fontSize: 9.5, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{itemCount > 99 ? "99+" : itemCount}</Box>}
        </Box>
        <Typography sx={{ fontSize: 10.5, fontWeight: active ? 600 : 500, lineHeight: 1 }}>{label}</Typography>
        {active && <Box sx={{ position: "absolute", bottom: 5, width: 18, height: 2.5, bgcolor: DS.peach, borderRadius: DS.radius.pill }} />}
      </Box>;
    })}
  </Box>;
}
