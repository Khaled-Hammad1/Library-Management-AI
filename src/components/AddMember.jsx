import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Stack,
  Paper,
  TextField,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";

import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
}));

export default function AddMember({ onMemberAdded, onClose }) {
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    membershipId: "",
    password: "",
    roleOfMem: "Member",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleClose() {
    if (loading) return;
    onClose?.();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://localhost:7000/api/MemberRepo/AddMember",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const details = await response.text();

        throw new Error(`Failed to add member: ${response.status} ${details}`);
      }

      onMemberAdded?.();
      onClose?.();
    } catch (err) {
      console.error("Error adding member:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Member</DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Fill out the form below to add a new library member.
        </DialogContentText>

        <Box component="form" id="AddMember-form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {/* Member Name */}
            <Item>
              <FormControl fullWidth required>
                <FormLabel htmlFor="name" sx={{ mb: 1, textAlign: "left" }}>
                  Member Name
                </FormLabel>

                <TextField
                  required
                  fullWidth
                  id="name"
                  name="name"
                  placeholder="Enter member name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </FormControl>
            </Item>

            {/* Email */}
            <Item>
              <FormControl fullWidth required>
                <FormLabel htmlFor="email" sx={{ mb: 1, textAlign: "left" }}>
                  Email
                </FormLabel>

                <TextField
                  required
                  fullWidth
                  type="email"
                  id="email"
                  name="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormControl>
            </Item>

            {/* Phone Number and Membership ID */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <Item sx={{ minWidth: 0 }}>
                <FormControl fullWidth>
                  <FormLabel
                    htmlFor="phoneNumber"
                    sx={{ mb: 1, textAlign: "left" }}
                  >
                    Phone Number
                  </FormLabel>

                  <TextField
                    fullWidth
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    slotProps={{
                      htmlInput: {
                        pattern: "[0-9]{10}",
                        maxLength: 10,
                        inputMode: "numeric",
                        title: "Phone number must contain exactly 10 digits",
                      },
                    }}
                  />
                </FormControl>
              </Item>

              <Item sx={{ minWidth: 0 }}>
                <FormControl fullWidth>
                  <FormLabel
                    htmlFor="membershipId"
                    sx={{ mb: 1, textAlign: "left" }}
                  >
                    Membership ID
                  </FormLabel>

                  <TextField
                    fullWidth
                    id="membershipId"
                    name="membershipId"
                    placeholder="Enter membership ID"
                    value={formData.membershipId}
                    onChange={handleChange}
                  />
                </FormControl>
              </Item>
            </Box>

            {/* Password */}
            <Item>
              <FormControl fullWidth>
                <FormLabel htmlFor="password" sx={{ mb: 1, textAlign: "left" }}>
                  Password
                </FormLabel>

                <TextField
                  fullWidth
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </FormControl>
            </Item>

            {/* Member Role */}
            <Item>
              <FormControl fullWidth required>
                <FormLabel id="role-label" sx={{ mb: 1, textAlign: "left" }}>
                  Member Role
                </FormLabel>

                <Select
                  labelId="role-label"
                  id="roleOfMem"
                  name="roleOfMem"
                  value={formData.roleOfMem}
                  onChange={handleChange}
                >
                  <MenuItem value="Member">Member</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Item>

            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit" disabled={loading}>
          Cancel
        </Button>

        <Button
          type="submit"
          form="AddMember-form"
          variant="contained"
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {loading ? "Adding..." : "Add Member"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
