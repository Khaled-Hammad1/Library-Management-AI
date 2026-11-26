import { Outlet, Link, useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import HistoryIcon from "@mui/icons-material/History";
import { useLocation } from "react-router";
import Home from "../pages/Home";

export default function PublicLayout() {
  const { token, logout, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f9f8" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "#122d27",
        }}
      >
        <Toolbar sx={{ minHeight: 75, gap: 2 }}>
          {/* Logo */}
          <MenuBookIcon sx={{ fontSize: 35, color: "#75dfbe" }} />

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              LibraryMS
            </Typography>

            <Typography variant="caption" sx={{ color: "#a6c4b9" }}>
              Discover. Read. Learn.
            </Typography>
          </Box>

          {/* Home Button */}
          <Button color="inherit"  component={Link} to="/">
            Home
          </Button>

          {/* Authentication */}
          {token && role === "Member" ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/history"
                startIcon={<HistoryIcon />}
              >
                My Borrowings
              </Button>

              {/* <Avatar
                sx={{
                  bgcolor: "#176b51",
                  width: 35,
                  height: 35,
                }}
              /> */}

              <Button
                color="inherit"
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : token && role === "Admin" ? (
            <>
              <Button color="inherit" component={Link} to="/admin">
                Admin panel
              </Button>
              {/* <Avatar
                sx={{
                  bgcolor: "#176b51",
                  width: 35,
                  height: 35,
                }}
              /> */}

              <Button
                color="inherit"
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              component={Link}
              to="/login"
              startIcon={<LoginIcon />}
              sx={{
                bgcolor: "#176b51",
                px: 3,
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "#218568",
                },
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Box component="main" sx={{ p: 3 }}>
        {location.pathname === "/login" && <Home />}
        {location.pathname === "/signup" && <Home />}
        <Outlet />
      </Box>
    </Box>
  );
}
