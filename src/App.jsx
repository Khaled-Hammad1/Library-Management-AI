import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import { Box } from "@mui/material";
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import MenuAppBar from "./components/MenuAppBar";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import Items from "./pages/Admin/Items";
import Members from "./pages/Admin/Members";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Borrowing from "./pages/Admin/Borrowing";
import Home from "./pages/Home";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import { AuthContext } from "./context/AuthContext";
import BorrowingHistory from "./pages/BorrowingHistory";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<BorrowingHistory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>


      {/* Admin pages */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="items" element={<Items />} />
        <Route path="members" element={<Members />} />
        <Route path="borrowings" element={<Borrowing />} />
      </Route>

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
