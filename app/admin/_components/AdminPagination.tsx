"use client";

import { Box, Button, IconButton, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { DS } from "../../components/DesignSystem";

type Props = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  label?: string;
};

function pageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [];
  const addPage = (n: number) => { if (!pages.includes(n)) pages.push(n); };
  const addEllipsis = () => { if (pages[pages.length - 1] !== "...") pages.push("..."); };

  addPage(1);
  if (current > 3) addEllipsis();
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) addPage(i);
  if (current < total - 2) addEllipsis();
  addPage(total);

  return pages;
}

const controlSx = {
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
  lineHeight: 1,
  boxShadow: "0 1px 0 rgba(43,43,51,.04)",
  "&:hover": { bgcolor: "#FFF7F1", borderColor: DS.peach },
  "&.Mui-disabled": { opacity: 0.38, bgcolor: "#F8F7F5" },
} as const;

export function AdminPagination({ page, totalPages, totalItems, pageSize, onPageChange, label }: Props) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);
  const display = label ?? `${from}-${to} จาก ${totalItems} รายการ`;
  const pages = pageRange(page, totalPages);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "minmax(0,1fr) auto" },
        alignItems: "center",
        gap: { xs: 1, sm: 1.5 },
        px: { xs: 1.4, md: 2.1 },
        py: 1.25,
        borderTop: `1px solid ${DS.line}`,
        bgcolor: "#FBFAF8",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: .85, minWidth: 0 }}>
        <Box sx={{ width: 7, height: 7, bgcolor: DS.peach, borderRadius: "50%", flexShrink: 0 }} />
        <Typography sx={{ color: DS.gray, fontSize: 12.5, fontWeight: 800, lineHeight: 1.35 }}>
          {display}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: .8, minWidth: 0 }}>
        <Typography sx={{ display: { xs: "none", md: "block" }, color: DS.gray, fontSize: 12, fontWeight: 900, whiteSpace: "nowrap" }}>
          หน้า {page} / {totalPages}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: .45,
            minWidth: 0,
            maxWidth: "100%",
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <IconButton onClick={() => onPageChange(1)} disabled={page <= 1} aria-label="หน้าแรก" sx={controlSx}>
            <ChevronsLeft size={15} />
          </IconButton>
          <IconButton onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="หน้าก่อน" sx={controlSx}>
            <ChevronLeft size={15} />
          </IconButton>

          {pages.map((p, i) =>
            p === "..." ? (
              <Typography key={`ellipsis-${i}`} sx={{ color: DS.gray, fontSize: 13, fontWeight: 900, px: .35, userSelect: "none" }}>...</Typography>
            ) : (
              <Button
                key={p}
                onClick={() => onPageChange(p)}
                aria-current={page === p ? "page" : undefined}
                sx={{
                  ...controlSx,
                  bgcolor: page === p ? DS.ink : DS.white,
                  color: page === p ? DS.white : DS.ink,
                  borderColor: page === p ? DS.ink : DS.line,
                  boxShadow: page === p ? "0 8px 18px rgba(43,43,51,.16)" : controlSx.boxShadow,
                  "&:hover": { bgcolor: page === p ? "#44444D" : "#FFF7F1", borderColor: page === p ? "#44444D" : DS.peach },
                }}
              >
                {p}
              </Button>
            ),
          )}

          <IconButton onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} aria-label="หน้าถัดไป" sx={controlSx}>
            <ChevronRight size={15} />
          </IconButton>
          <IconButton onClick={() => onPageChange(totalPages)} disabled={page >= totalPages} aria-label="หน้าสุดท้าย" sx={controlSx}>
            <ChevronsRight size={15} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
