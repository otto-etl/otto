import React from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";

// import ottoLogo from "../../assets/otto.png";
import ottoLogo from "../../assets/otto.svg";
// import ottoLogo from "../../assets/otto.svg";
import { useNavigate, Link } from "react-router-dom";

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
        <Link
          to="/"
          style={{
            display: "flex",
            "align-items": "center",
            color: "white",
            "text-decoration": "none",
            "justify-content": "space-between",
            gap: "10px",
          }}
        >
          <img
            src={ottoLogo}
            className="otto logo"
            alt="otto logo"
            style={{ height: 28, width: 28 }}
          />
          <Typography
            fontFamily={"Quicksand"}
            sx={{
              fontSize: "32px",
              fontWeight: "700",
              marginTop: "-6px",
            }}
          >
            otto
          </Typography>
        </Link>
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
