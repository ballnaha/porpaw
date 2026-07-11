import { createTheme } from "@mui/material/styles";

/**
 * baebite design tokens — "Happy pet, Happy life."
 * Soft pastel palette lifted from the reference landing page.
 */
export const DS = {
  // ── baebite pastel palette ──
  peach: "#F5B99B",
  peachSoft: "#FBDCC9",
  peachBg: "#FAD9C6",
  mint: "#D9EBDD",
  mintDeep: "#A8CDB2",
  lavender: "#C9BFE3",
  lavenderSoft: "#E4DEF4",
  yellow: "#F6D06B",
  pink: "#F4B8A8",
  green: "#9BC7B0",
  ink: "#2B2B33",
  gray: "#8B8B95",
  line: "#EDEDEF",
  card: "#F7F7F8",
  white: "#FFFFFF",

  // ── Legacy aliases (kept so shared components don't break) ──
  primary: "#F5B99B",
  secondary: "#F7F7F8",
  accent: "#E58A5F",
  text: "#2B2B33",
  textSecondary: "#6C6C76",
  border: "#EDEDEF",

  // Radius tokens
  radius: { sm: "12px", md: "18px", lg: "24px", xl: "32px", pill: "999px" },

  // Shadows
  cardShadow: "0 14px 32px rgba(43,43,51,0.08)",
  cardShadowHover: "0 18px 40px rgba(43,43,51,0.14)",
  softShadow: "0 12px 40px rgba(43,43,51,0.10)",

  // Font stack — Nunito first, Prompt fallback for Thai
  font: "var(--font-nunito), var(--font-prompt), system-ui, -apple-system, sans-serif",
} as const;

export const theme = createTheme({
  palette: {
    primary: { main: DS.peach },
    text: { primary: DS.ink, secondary: DS.gray },
  },
  typography: {
    fontFamily: DS.font,
    allVariants: { fontFamily: DS.font },
    button: { fontFamily: DS.font, textTransform: "none", fontWeight: 800 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { fontFamily: DS.font, textTransform: "none", fontWeight: 800 },
      },
    },
  },
});
