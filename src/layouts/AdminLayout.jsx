
import { useState } from "react";
import { Outlet } from "react-router";
import { Box } from "@mui/material";

import Sidebar from "../components/Sidebar";
import MenuAppBar from "../components/MenuAppBar";

export default function AdminLayout() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <MenuAppBar
        onMenuClick={() => setShowSidebar((prev) => !prev)}
      />

      <Box
        sx={{
          display: "flex",
          flex: 1,
          minWidth: 0,
        }}
      >
        {showSidebar && <Sidebar />}

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            p: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
