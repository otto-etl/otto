import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./index.css";
import App from "./App";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 1200,
      md: 1500,
      lg: 1800,
      xl: 2100,
    },
  },
  palette: {
    primary: {
      main: "#3C4BCB",
      light: "#6673E1",
      dark: "#0B1565",
    },
  },
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
          fontSize: "16px",
          fontWeight: "500",
          "&.Mui-selected": {
            color: "#3C4BCB",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #E4E4E4",
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        root: {
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: "#3C4BCB",
            "& + .MuiSwitch-track": {
              color: "#3C4BCB",
            },
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#EBEDFE",
            "&:hover": {
              backgroundColor: "#EBEDFE",
            },
          },
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "contained" },
          style: {
            backgroundColor: "#3c4bcb",
            textTransform: "capitalize",
            fontSize: "16px",
            "&:hover": {
              backgroundColor: "#2433B2",
            },
          },
        },
        {
          props: { variant: "text" },
          style: {
            textTransform: "capitalize",
            fontSize: "16px",
          },
        },
        {
          props: { variant: "outlined" },
          style: {
            color: "#3c4bcb",
            border: "1px solid #3c4bcb",
            textTransform: "capitalize",
            fontSize: "16px",
            "&:hover": {
              backgroundColor: "#EBEDFE",
            },
          },
        },
      ],
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
