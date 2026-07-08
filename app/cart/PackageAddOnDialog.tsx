"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useMediaQuery, Typography } from "@mui/material";
import { Check, Minus, PackageCheck, Plus, X } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { DS } from "../components/DesignSystem";
import { useCart, type CartItem } from "../components/CartProvider";
import { PRODUCTS, type ProductCategory, type ShopProduct } from "../lib/productCatalog";

type Category = "ทั้งหมด" | ProductCategory;

function getLinkedCartId(productId: number, packageId: number) {
  return Array.from(`${productId}|${packageId}|with-package`).reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    2000,
  );
}

export function PackageAddOnDialog({ open, packageItem, onClose }: { open: boolean; packageItem?: CartItem; onClose: () => void }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const [category, setCategory] = useState<Category>("ทั้งหมด");
  const [draft, setDraft] = useState<Record<number, number>>({});
  const linkedItems = useMemo(
    () => packageItem ? items.filter((item) => item.packageId === packageItem.id) : [],
    [items, packageItem],
  );

  useEffect(() => {
    if (!open || !packageItem) return;
    const nextDraft: Record<number, number> = {};
    for (const product of PRODUCTS) {
      const existing = linkedItems.find((item) => item.productId === product.id || item.name === product.name);
      if (existing) nextDraft[product.id] = existing.quantity;
    }
    setDraft(nextDraft);
    setCategory("ทั้งหมด");
  }, [open, packageItem, linkedItems]);

  const categories: Category[] = ["ทั้งหมด", ...Array.from(new Set(PRODUCTS.map((product) => product.category)))];
  const products = PRODUCTS.filter((product) => category === "ทั้งหมด" || product.category === category);
  const selectedCount = Object.values(draft).reduce((sum, quantity) => sum + quantity, 0);
  const addOnTotal = PRODUCTS.reduce((sum, product) => sum + product.price * (draft[product.id] ?? 0), 0);
  const changeQuantity = (productId: number, change: number) => setDraft((current) => {
    const quantity = Math.max(0, (current[productId] ?? 0) + change);
    if (quantity === 0) {
      const { [productId]: _removed, ...rest } = current;
      void _removed;
      return rest;
    }
    return { ...current, [productId]: quantity };
  });

  const confirmAddOns = () => {
    if (!packageItem) return;
    for (const product of PRODUCTS) {
      const quantity = draft[product.id] ?? 0;
      const existing = linkedItems.find((item) => item.productId === product.id || item.name === product.name);
      if (existing && quantity === 0) removeItem(existing.id);
      else if (existing) updateQuantity(existing.id, quantity);
      else if (quantity > 0) addItem({
        ...product,
        id: getLinkedCartId(product.id, packageItem.id),
        productId: product.id,
        deliveryMode: "every-package",
        packageId: packageItem.id,
        packageName: packageItem.name,
      }, quantity);
    }
    onClose();
  };

  return <Dialog open={open} onClose={onClose} fullScreen={fullScreen} fullWidth maxWidth="md" slotProps={{ paper: { sx: { borderRadius: fullScreen ? 0 : "26px", maxHeight: fullScreen ? "100%" : "90vh", bgcolor: "#FCFBFA", overflow: "hidden", boxShadow: "0 28px 80px rgba(43,43,51,.2)" } } }}>
    <DialogTitle sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 2.5 }, pb: 1.75, background: "linear-gradient(135deg,#FFF7F1 0%,#FFFFFF 58%,#EEF7F0 100%)", borderBottom: `1px solid ${DS.line}` }}>
      <Box><Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><Box sx={{ width: 36, height: 36, display: "grid", placeItems: "center", bgcolor: DS.white, color: "#A65F45", border: "1px solid #F0D2C2", borderRadius: "12px", boxShadow: "0 5px 14px rgba(166,95,69,.1)" }}><PackageCheck size={18} /></Box><Box><Typography sx={{ fontSize: { xs: 19, sm: 22 }, fontWeight: 700 }}>เพิ่มสินค้าเสริมทุกรอบ</Typography><Typography sx={{ color: DS.gray, fontSize: 12.5, mt: .1 }}>ส่งพร้อม {packageItem?.name} ในทุกครั้งตามรอบของแพ็กเกจ</Typography></Box></Box></Box>
      <IconButton onClick={onClose} aria-label="ปิดหน้าต่าง" sx={{ bgcolor: "rgba(255,255,255,.75)", border: `1px solid ${DS.line}`, "&:hover": { bgcolor: DS.white } }}><X size={20} /></IconButton>
    </DialogTitle>

    <DialogContent dividers sx={{ px: { xs: 1.5, sm: 3 }, py: 2, borderColor: DS.line, bgcolor: "#FCFBFA" }}>
      <Box sx={{ position: "sticky", top: 0, zIndex: 2, display: "flex", gap: .7, overflowX: "auto", mx: { xs: -1.5, sm: -3 }, px: { xs: 1.5, sm: 3 }, pt: .25, pb: 1.5, bgcolor: "rgba(252,251,250,.96)", backdropFilter: "blur(8px)", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
        {categories.map((item) => <Button key={item} onClick={() => setCategory(item)} sx={{ flexShrink: 0, color: category === item ? DS.white : DS.ink, bgcolor: category === item ? DS.ink : DS.white, border: `1px solid ${category === item ? DS.ink : DS.line}`, borderRadius: DS.radius.pill, px: 1.6, py: .65, fontSize: 12, fontWeight: 600, "&:hover": { bgcolor: category === item ? "#44444D" : DS.peachSoft } }}>{item}</Button>)}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,minmax(0,1fr))", md: "repeat(3,minmax(0,1fr))" }, gap: 1.25 }}>
        {products.map((product: ShopProduct) => {
          const quantity = draft[product.id] ?? 0;
          return <Box key={product.id} sx={{ display: "grid", gridTemplateColumns: { xs: "82px minmax(0,1fr)", sm: "1fr" }, gap: 1, bgcolor: DS.white, border: `1.5px solid ${quantity ? DS.peach : DS.line}`, borderRadius: "18px", p: 1, boxShadow: quantity ? "0 10px 26px rgba(166,95,69,.1)" : "0 3px 12px rgba(43,43,51,.035)", transition: "transform .2s, box-shadow .2s, border-color .2s", "&:hover": { transform: "translateY(-2px)", boxShadow: quantity ? "0 13px 30px rgba(166,95,69,.14)" : DS.cardShadow } }}>
            <Box sx={{ position: "relative", height: { xs: 86, sm: 138 }, bgcolor: product.color, borderRadius: "12px", overflow: "hidden" }}><Image src={product.image} alt={product.name} fill sizes="220px" style={{ objectFit: "contain", padding: 10 }} />{quantity > 0 && <Box sx={{ position: "absolute", top: 7, right: 7, width: 22, height: 22, display: "grid", placeItems: "center", bgcolor: "#60906F", color: DS.white, borderRadius: "50%" }}><Check size={13} /></Box>}</Box>
            <Box sx={{ minWidth: 0, px: { sm: .4 }, display: "flex", flexDirection: "column" }}><Typography sx={{ color: "#B96449", fontSize: 10.5, fontWeight: 600 }}>{product.category}</Typography><Typography sx={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.3, mt: .25, minHeight: { sm: 35 } }}>{product.name}</Typography><Typography sx={{ color: DS.gray, fontSize: 11, mt: .3 }}>{product.weight}</Typography><Typography sx={{ fontSize: 17, fontWeight: 700, mt: "auto", pt: .65 }}>฿{product.price.toLocaleString()}</Typography></Box>
            {quantity === 0 ? <Button onClick={() => changeQuantity(product.id, 1)} startIcon={<Plus size={15} />} fullWidth sx={{ gridColumn: { xs: "1 / -1", sm: "auto" }, color: DS.ink, bgcolor: "#F8F7F5", border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, minHeight: 38, fontSize: 12.5, fontWeight: 600, "&:hover": { bgcolor: DS.peachSoft, borderColor: DS.peach } }}>เพิ่มสินค้า</Button> : <Box sx={{ gridColumn: { xs: "1 / -1", sm: "auto" }, display: "grid", gridTemplateColumns: "40px 1fr 40px", alignItems: "center", minHeight: 40, bgcolor: "#FFF7F2", border: `1.5px solid ${DS.peach}`, borderRadius: DS.radius.pill, overflow: "hidden" }}><IconButton onClick={() => changeQuantity(product.id, -1)} aria-label={`ลดจำนวน ${product.name}`} sx={{ width: 36, height: 36, justifySelf: "center", color: "#A65F45", bgcolor: DS.white, "&:hover": { bgcolor: "#FFE9DC" } }}><Minus size={15} /></IconButton><Box sx={{ textAlign: "center", lineHeight: 1 }}><Typography sx={{ color: DS.gray, fontSize: 9.5, fontWeight: 500 }}>จำนวนต่อรอบ</Typography><Typography sx={{ color: DS.ink, fontSize: 15, fontWeight: 700, mt: .2 }}>{quantity}</Typography></Box><IconButton onClick={() => changeQuantity(product.id, 1)} aria-label={`เพิ่มจำนวน ${product.name}`} sx={{ width: 36, height: 36, justifySelf: "center", color: DS.white, bgcolor: "#A65F45", "&:hover": { bgcolor: "#8F4F39" } }}><Plus size={15} /></IconButton></Box>}
          </Box>;
        })}
      </Box>
    </DialogContent>

    <DialogActions sx={{ display: "grid", bgcolor: DS.white, borderTop: `1px solid ${DS.line}`, boxShadow: "0 -10px 28px rgba(43,43,51,.06)", gridTemplateColumns: { xs: "1fr", sm: "1fr auto" }, alignItems: "center", gap: 1.5, px: { xs: 2, sm: 3 }, py: 1.75 }}>
      <Box><Typography sx={{ color: DS.gray, fontSize: 11.5 }}>{selectedCount ? `${selectedCount} ชิ้นต่อรอบ` : "ยังไม่ได้เลือกสินค้าเพิ่ม"}</Typography><Typography sx={{ fontSize: 20, fontWeight: 700 }}>เพิ่ม ฿{addOnTotal.toLocaleString()} / รอบ</Typography></Box>
      <Box sx={{ display: "flex", gap: 1 }}><Button onClick={onClose} sx={{ color: DS.gray, border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, px: 2, fontWeight: 500 }}>ยกเลิก</Button><Button onClick={confirmAddOns} sx={{ minWidth: { sm: 190 }, bgcolor: DS.ink, color: DS.white, borderRadius: DS.radius.pill, px: 2.5, py: 1.05, fontSize: 14, fontWeight: 700, boxShadow: "0 8px 20px rgba(43,43,51,.16)", "&:hover": { bgcolor: "#44444D" } }}>บันทึกสินค้าเสริม</Button></Box>
    </DialogActions>
  </Dialog>;
}