"use client";

import { Box, Button, IconButton, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { DS } from "../../components/DesignSystem";

type Props = {
  page: number;           // 1-indexed
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  /** Optional label shown in the middle, defaults to "x–y จาก z รายการ" */
  label?: string;
};

function pageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [];
  const addPage = (n: number) => { if (!pages.includes(n)) pages.push(n); };
  const addEllipsis = () => { if (pages[pages.length - 1] !== "…") pages.push("…"); };

  addPage(1);
  if (current > 3) addEllipsis();
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) addPage(i);
  if (current < total - 2) addEllipsis();
  addPage(total);
  return pages;
}

const btnBase = {
  minWidth: 0,
  width: 34,
  height: 34,
  borderRadius: "10px",
  p: 0,
  border: `1px solid ${DS.line}`,
  color: DS.ink,
  bgcolor: DS.white,
  fontWeight: 900,
  fontSize: 13,
  "&:hover": { bgcolor: "#FFF7F1", borderColor: DS.peach },
  "&.Mui-disabled": { opacity: 0.35 },
} as const;

export function AdminPagination({ page, totalPages, totalItems, pageSize, onPageChange, label }: Props) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);
  const display = label ?? `${from}–${to} จาก ${totalItems} รายการ`;
  const pages = pageRange(page, totalPages);

  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 1.5,
      px: { xs: 1.6, md: 2.1 },
      py: 1.4,
      borderTop: `1px solid ${DS.line}`,
    }}>
      {/* Info text */}
      <Typography sx={{ color: DS.gray, fontSize: 13, fontWeight: 700, order: { xs: 2, sm: 0 }, width: { xs: "100%", sm: "auto" }, textAlign: { xs: "center", sm: "left" } }}>
        {display}
      </Typography>

      {/* Page buttons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: .5, mx: "auto" }}>
        <IconButton onClick={() => onPageChange(1)} disabled={page <= 1} aria-label="หน้าแรก" sx={btnBase}>
          <ChevronsLeft size={15} />
        </IconButton>
        <IconButton onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="หน้าก่อน" sx={btnBase}>
          <ChevronLeft size={15} />
        </IconButton>

        {pages.map((p, i) =>
          p === "…" ? (
            <Typography key={`ell-${i}`} sx={{ color: DS.gray, fontSize: 13, px: .3, userSelect: "none" }}>…</Typography>
          ) : (
            <Button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={page === p ? "page" : undefined}
              sx={{
                ...btnBase,
                bgcolor: page === p ? DS.ink : DS.white,
                color: page === p ? DS.white : DS.ink,
                borderColor: page === p ? DS.ink : DS.line,
                "&:hover": { bgcolor: page === p ? "#44444D" : "#FFF7F1", borderColor: page === p ? "#44444D" : DS.peach },
              }}
            >
              {p}
            </Button>
          ),
        )}

        <IconButton onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} aria-label="หน้าถัดไป" sx={btnBase}>
          <ChevronRight size={15} />
        </IconButton>
        <IconButton onClick={() => onPageChange(totalPages)} disabled={page >= totalPages} aria-label="หน้าสุดท้าย" sx={btnBase}>
          <ChevronsRight size={15} />
        </IconButton>
      </Box>
    </Box>
  );
}
