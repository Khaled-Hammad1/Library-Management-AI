import { useContext } from "react";
import { NavLink } from "react-router";
import { AuthContext } from "../context/AuthContext.js";

import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";

import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// Sidebar navigation items
const menuItems = [
  {
    text: "Dashboard",
    path: "/admin",
    icon: <DashboardIcon />,
  },
  {
    text: "Items",
    path: "/admin/items",
    icon: <MenuBookIcon />,
  },
  {
    text: "Members",
    path: "/admin/members",
    icon: <PeopleIcon />,
  },
  {
    text: "Borrowings",
    path: "/admin/borrowings",
    icon: <HistoryIcon />,
  },
];

export default function Sidebar() {
  const { token, logout } = useContext(AuthContext);

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        position: "sticky",
        top: 0,
        flexShrink: 0,
        backgroundColor: "#142b27",
        color: "white",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 3,
        }}
      >
        <LocalLibraryIcon
          sx={{
            fontSize: 34,
            color: "#6ee7b7",
          }}
        />

        <Box>
          <Typography fontSize={20} fontWeight="bold">
            LibraryMS
          </Typography>

          <Typography fontSize={10} color="#9db5af">
            LIBRARY MANAGEMENT
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "#3a554e" }} />

      {/* Main Menu */}
      <Typography
        sx={{
          px: 3,
          pt: 3,
          pb: 1,
          fontSize: 11,
          fontWeight: 600,
          color: "#9db5af",
          letterSpacing: 1,
        }}
      >
        MAIN MENU
      </Typography>

      <List sx={{ px: 1.5 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            end
            sx={{
              borderRadius: 2,
              mb: 0.5,
              py: 1.2,
              color: "#d1d5db",
              transition: "0.2s",

              "& .MuiListItemIcon-root": {
                color: "inherit",
              },

              "&:hover": {
                backgroundColor: "#25483e",
                color: "white",
              },

              "&.active": {
                backgroundColor: "#176c51",
                color: "white",
                fontWeight: "bold",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>

            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      {/* Bottom Section */}
      <Box sx={{ mt: "auto", p: 2 }}>
        <Divider
          sx={{
            mb: 2,
            borderColor: "#3a554e",
          }}
        />

        {/* User Information */}
        {token && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
              px: 1,
            }}
          >
            <AccountCircleIcon
              sx={{
                fontSize: 36,
                color: "#9db5af",
              }}
            />

            <Box>
              <Typography fontSize={14} fontWeight={600}>
                Administrator
              </Typography>

              <Typography fontSize={11} color="#9db5af">
                Library Admin
              </Typography>
            </Box>
          </Box>
        )}

        {/* Login / Logout */}
        {token ? (
          <Button
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{
              justifyContent: "flex-start",
              color: "#fca5a5",
              textTransform: "none",
              px: 2,
              py: 1,

              "&:hover": {
                backgroundColor: "#442c2c",
              },
            }}
          >
            Logout
          </Button>
        ) : (
          <Button
            component={NavLink}
            to="/login"
            fullWidth
            startIcon={<LoginIcon />}
            sx={{
              justifyContent: "flex-start",
              color: "#6ee7b7",
              textTransform: "none",
              px: 2,
              py: 1,

              "&:hover": {
                backgroundColor: "#25483e",
              },
            }}
          >
            Login
          </Button>
        )}
      </Box>
    </Box>
  );
}
