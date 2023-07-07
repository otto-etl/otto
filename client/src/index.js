import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./index.css";
import App from "./App";

const theme = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "contained" },
          style: {
            backgroundColor: "#3c4bcb",
          },
        },
        {
          props: { variant: "outlined" },
          style: {
            color: "#3c4bcb",
            border: "1px solid #3c4bcb",
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
