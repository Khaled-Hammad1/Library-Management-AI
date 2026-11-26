
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

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

export default function EditMember({
  member,
  onMemberUpdated,
  onCancel,
}) {
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: member.name ?? "",
    email: member.email ?? "",
    phoneNumber: member.phoneNumber ?? "",
    membershipId: member.membershipId ?? "",
    roleOfMem: member.roleOfMem ?? "Member",
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
    onCancel?.();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://localhost:7000/api/MemberRepo/UpdateMember/${member.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const details = await response.text();

        throw new Error(
          `Update failed: ${response.status} ${details}`
        );
      }

      onMemberUpdated?.();
      onCancel?.();

    } catch (err) {
      console.error("Error updating member:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Edit Member</DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Update the member information below.
        </DialogContentText>

        <Box
          component="form"
          id="EditMember-form"
          onSubmit={handleSubmit}
        >
          <Stack spacing={2}>

            {/* Member Name */}
            <Item>
              <FormControl fullWidth required>
                <FormLabel
                  htmlFor="edit-name"
                  sx={{ mb: 1, textAlign: "left" }}
                >
                  Member Name
                </FormLabel>

                <TextField
                  required
                  fullWidth
                  id="edit-name"
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
                <FormLabel
                  htmlFor="edit-email"
                  sx={{ mb: 1, textAlign: "left" }}
                >
                  Email
                </FormLabel>

                <TextField
                  required
                  fullWidth
                  type="email"
                  id="edit-email"
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
                    htmlFor="edit-phone"
                    sx={{ mb: 1, textAlign: "left" }}
                  >
                    Phone Number
                  </FormLabel>

                  <TextField
                    fullWidth
                    type="tel"
                    id="edit-phone"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </FormControl>
              </Item>

              <Item sx={{ minWidth: 0 }}>
                <FormControl fullWidth required>
                  <FormLabel
                    htmlFor="edit-membership"
                    sx={{ mb: 1, textAlign: "left" }}
                  >
                    Membership ID
                  </FormLabel>

                  <TextField
                    required
                    fullWidth
                    id="edit-membership"
                    name="membershipId"
                    placeholder="Enter membership ID"
                    value={formData.membershipId}
                    onChange={handleChange}
                  />
                </FormControl>
              </Item>
            </Box>

            {/* Member Role */}
            <Item>
              <FormControl fullWidth required>
                <FormLabel
                  id="edit-role-label"
                  sx={{ mb: 1, textAlign: "left" }}
                >
                  Member Role
                </FormLabel>

                <Select
                  labelId="edit-role-label"
                  id="edit-role"
                  name="roleOfMem"
                  value={formData.roleOfMem}
                  onChange={handleChange}
                >
                  <MenuItem value="Member">Member</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Item>

            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          color="inherit"
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          form="EditMember-form"
          variant="contained"
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : null
          }
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
