import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
      light: "#757de8",
      dark: "#002984",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#5c6bc0",
      light: "#8e99f3",
      dark: "#26418f",
      contrastText: "#ffffff",
    },
    success: {
      main: "#4caf50",
      light: "#80e27e",
      dark: "#087f23",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ff9800",
      light: "#ffc947",
      dark: "#c66900",
      contrastText: "#000000",
    },
    error: {
      main: "#f44336",
      light: "#ff7961",
      dark: "#ba000d",
      contrastText: "#ffffff",
    },
    info: {
      main: "#2196f3",
      light: "#6ec6ff",
      dark: "#0069c0",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          },
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#4d5ec1",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
        },
      },
    },
  },
});

export default theme;
