
import { useState } from "react";
import { useNavigate, Link } from "react-router";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  MenuItem,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    membershipId: "",
    password: "",
    roleOfMem: "Member",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleClose() {
    if (!loading) {
      navigate("/");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://localhost:7000/api/MemberRepo/AddMember",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Registration failed");
      }

      // Account created successfully
      navigate("/login", { replace: true });

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 2,
          },
        },
      }}
    >
      {/* Close Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={handleClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <MenuBookIcon
          sx={{
            fontSize: 50,
            color: "#176b51",
          }}
        />

        <DialogTitle sx={{ fontWeight: "bold", fontSize: 26 }}>
          Create Account
        </DialogTitle>

        <Typography color="text.secondary">
          Join LibraryMS and start exploring books.
        </Typography>
      </Box>

      {/* Registration Form */}
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>

          <TextField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            slotProps={{
              input: {
                pattern: "[0-9]{10}",
                title: "Please enter a valid 10-digit phone number",
              },
            }}

          />

          <TextField
            label="Membership ID"
            name="membershipId"
            value={form.membershipId}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {/* Sign Up */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            startIcon={!loading && <PersonAddIcon />}
            sx={{
              mt: 3,
              py: 1.5,
              bgcolor: "#176b51",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#12543f",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Account"
            )}
          </Button>

          {/* Login Link */}
          <Typography
            textAlign="center"
            sx={{ mt: 3 }}
            color="text.secondary"
          >
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#176b51" }}>
              Sign In
            </Link>
          </Typography>

        </Box>
      </DialogContent>
    </Dialog>
  );
}
