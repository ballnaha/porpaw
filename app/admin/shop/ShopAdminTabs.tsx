"use client";

import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { LayoutGrid, Tag } from "lucide-react";
import { DS } from "../../components/DesignSystem";
import { ProductAdminManager } from "./ProductAdminManager";
import { CategoryAdminManager } from "./CategoryAdminManager";

type Tab = "products" | "categories";

export function ShopAdminTabs() {
  const [tab, setTab] = useState<Tab>("products");

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "products", label: "Products", icon: <LayoutGrid size={15} /> },
    { key: "categories", label: "Categories", icon: <Tag size={15} /> },
  ];

  return (
    <Box sx={{ display: "grid", gap: 1.6 }}>
      {/* Tab bar */}
      <Box sx={{ display: "flex", gap: .75, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <Button
            key={t.key}
            onClick={() => setTab(t.key)}
            startIcon={t.icon}
            sx={{
              bgcolor: tab === t.key ? DS.ink : DS.white,
              color: tab === t.key ? DS.white : DS.ink,
              border: `1px solid ${tab === t.key ? DS.ink : DS.line}`,
              borderRadius: DS.radius.pill,
              px: 2,
              py: .85,
              fontSize: 13.5,
              fontWeight: 900,
              textTransform: "none",
              "&:hover": { bgcolor: tab === t.key ? "#44444D" : DS.peachSoft },
            }}
          >
            {t.label}
          </Button>
        ))}
        {tab === "categories" && (
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
            <Typography sx={{ color: DS.gray, fontSize: 12.5 }}>
              จัดการ category → จะปรากฏใน dropdown เพิ่มสินค้า และ filter ในหน้า Shop
            </Typography>
          </Box>
        )}
      </Box>

      {/* Tab content */}
      {tab === "products" && <ProductAdminManager />}
      {tab === "categories" && <CategoryAdminManager />}
    </Box>
  );
}
