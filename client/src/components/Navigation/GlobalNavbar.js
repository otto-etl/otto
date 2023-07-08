import React from "react";
import { AppBar, Button, Toolbar } from "@mui/material";

import ottoLogo from "../../assets/otto.png";
import { useNavigate } from "react-router-dom";

const GlobalNavbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position={"static"}
      sx={{
        boxShadow: "none",
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#3c4bcb",
        }}
      >
        <img
          src={ottoLogo}
          className="otto logo"
          alt="otto logo"
          style={{ height: 25 }}
        />
        <Button
          variant="text"
          sx={{
            color: "white",
            textTransform: "capitalize",
            fontSize: "16px",
          }}
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          All Workflows
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default GlobalNavbar;
