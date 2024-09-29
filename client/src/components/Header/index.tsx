import AssessmentIcon from "@mui/icons-material/Assessment";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
const Header: React.FC = () => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="report">
          <AssessmentIcon />
        </IconButton>
        <Typography variant="h6" style={{ color: "white" }}>
          BrightEdge - Chrome UX Report
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
