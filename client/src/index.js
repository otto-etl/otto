import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./index.css";
import App from "./App";
import { capitalize } from "@mui/material";

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
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "contained" },
          style: {
            backgroundColor: "#3c4bcb",
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
          },
        },
      ],
    },
    // MuiAppBar: {
    //   variants: [
    //     {
    //       props: { variant: "ottoPrimary" },
    //       style: {
    //         boxShadow: "none",
    //         backgroundColor: "#3c4bcb",
    //       },
    //     },
    //   ],
    // },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
