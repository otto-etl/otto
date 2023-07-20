import React from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import ottoLogo from "../../assets/otto.svg";
import { useNavigate } from "react-router-dom";

const GlobalNavbar = ({ onHomePage }) => {
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
        <Button
          variant="text"
          sx={{
            color: "white",
            fontSize: "16px",
            display: "flex",
            gap: "10px",
          }}
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          <img
            src={ottoLogo}
            className="otto logo"
            alt="otto logo"
            style={{ height: 28, width: 28 }}
          />
          <Typography
            fontFamily={"Quicksand, sans-serif"}
            sx={{
              fontSize: "32px",
              fontWeight: "700",
              marginTop: "-6px",
              textTransform: "lowercase",
            }}
          >
            otto
          </Typography>
        </Button>
        {!onHomePage ? (
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
        ) : null}
      </Toolbar>
    </AppBar>
  );
};

export default GlobalNavbar;
