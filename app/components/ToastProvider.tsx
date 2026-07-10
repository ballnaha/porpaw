"use client";

import { createContext, useCallback, useContext, useState } from "react";
import Link from "next/link";
import { Box, Button, IconButton, Snackbar, Typography } from "@mui/material";
import { Check, ShoppingCart, X } from "lucide-react";
import { DS } from "./DesignSystem";

interface ToastOptions {
  title?: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
  hideAction?: boolean;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = useCallback((options: ToastOptions) => {
    setToast(options);
  }, []);

  return <ToastContext.Provider value={{ showToast }}>
    {children}
    <Snackbar
      open={Boolean(toast)}
      autoHideDuration={2800}
      onClose={(_, reason) => reason !== "clickaway" && setToast(null)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{ mb: { xs: 1, sm: 2 }, mr: { xs: 0, sm: 1 }, maxWidth: { xs: "calc(100vw - 24px)", sm: 390 } }}
    >
      <Box
        role="status"
        aria-live="polite"
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "42px minmax(0,1fr) auto",
          alignItems: "center",
          gap: 1.25,
          bgcolor: DS.white,
          color: DS.ink,
          border: `1px solid ${DS.line}`,
          borderRadius: "18px",
          p: "11px 12px",
          fontFamily: "var(--font-prompt), sans-serif",
          boxShadow: "0 18px 50px rgba(43,43,51,.18)",
          "& .MuiTypography-root, & .MuiButton-root": {
            fontFamily: "var(--font-prompt), sans-serif",
          },
        }}
      >
        <Box sx={{ width: 42, height: 42, display: "grid", placeItems: "center", bgcolor: DS.mint, color: "#4D7D5B", borderRadius: "13px" }}>
          <Check size={20} strokeWidth={3} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 13.5, fontWeight: 800, lineHeight: 1.25 }}>
            {toast?.title ?? "เพิ่มลงตะกร้าแล้ว"}
          </Typography>
          <Typography noWrap sx={{ color: DS.gray, fontSize: 11.5, mt: .25 }}>
            {toast?.message}
          </Typography>
          {!toast?.hideAction && (
            <Button component={Link} href={toast?.actionHref ?? "/cart"} startIcon={<ShoppingCart size={13} />} onClick={() => setToast(null)} sx={{ minWidth: 0, color: "#B96449", fontSize: 11.5, fontWeight: 800, p: 0, mt: .45 }}>
              {toast?.actionLabel ?? "ดูตะกร้า"}
            </Button>
          )}
        </Box>
        <IconButton size="small" aria-label="ปิดการแจ้งเตือน" onClick={() => setToast(null)} sx={{ alignSelf: "start", color: DS.gray, p: .5 }}>
          <X size={15} />
        </IconButton>
      </Box>
    </Snackbar>
  </ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
