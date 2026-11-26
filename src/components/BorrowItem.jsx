import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  Alert,
  Box,
  CardMedia,
  Divider,
  Chip,
} from "@mui/material";

export default function BorrowItem({ item, onBorrow }) {
  const [open, setOpen] = useState(false);
  const [durationDays, setDurationDays] = useState(7);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleClickOpen() {
    if (!token) {
      navigate("/login");
      return;
    }

    setError("");
    setDurationDays(7);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setError("");
  }

  async function handleBorrow() {
    if (!Number.isInteger(Number(durationDays)) || Number(durationDays) <= 0) {
      setError("Please enter a valid number of days.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://localhost:7000/api/BorrowingRepo/BorrowItem/${item.id}/${durationDays}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to borrow item.");
      }

      const data = await response.json();

      console.log(data);

      handleClose();

      if (onBorrow) {
        onBorrow(item.id);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Borrow Button */}
      <Button
        variant="contained"
        fullWidth
        disabled={!item.isAvailable || role !== "Member"}
        onClick={handleClickOpen}
      >
        {item.isAvailable ? "Borrow" : "Unavailable"}
      </Button>

      {/* Borrow Dialog */}
      <Dialog
        open={open}
        onClose={loading ? undefined : handleClose}
        fullWidth
        maxWidth="sm"
        scroll="paper"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 5,
              maxHeight: "90vh",
            },
          },
        }}
      >
        {/* Dialog Header */}
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: 22,
            pb: 1,
          }}
        >
          Borrow Item
        </DialogTitle>

        <DialogContent dividers>
          {/* Item Details */}
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              gap: 3,
              alignItems: {
                xs: "center",
                sm: "flex-start",
              },
              mb: 3,
            }}
          >
            {/* Item Cover */}
            <Box
              sx={{
                width: 125,
                height: 175,
                flexShrink: 0,
                bgcolor: "#f5f7f6",
                borderRadius: 2,
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="img"
                image={item.imageUrl || "/images/CoverNotAvailable.png"}
                alt={item.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/CoverNotAvailable.png";
                }}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: 1,
                  boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
                }}
              />
            </Box>

            {/* Item Information */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  mb: 1,
                  overflowWrap: "anywhere",
                }}
              >
                {item.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {item.authorPublisher}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  mb: 2,
                }}
              >
                <Chip
                  label={item.isAvailable ? "Available" : "Unavailable"}
                  color={item.isAvailable ? "success" : "error"}
                  size="small"
                />

                <Chip label={item.itemType} size="small" variant="outlined" />
              </Box>

              <Typography variant="body2" color="text.secondary">
                Published: {item.yearOfPublication ?? "N/A"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Borrowing Details */}
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            Borrowing Details
          </Typography>

          <TextField
            label="Borrowing Duration (Days)"
            type="number"
            fullWidth
            size="small"
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            disabled={loading}
            slotProps={{
              htmlInput: {
                min: 1,
                max: 30,
                step: 1,
              },
            }}
            helperText="Choose a borrowing period between 1 and 30 days"
          />

          {/* Due Date Preview */}
          {Number.isInteger(Number(durationDays)) &&
            Number(durationDays) >= 1 &&
            Number(durationDays) <= 30 && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: "action.hover",
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Expected Return Date
                  </Typography>

                  <Typography variant="subtitle1" fontWeight="bold">
                    {(() => {
                      const date = new Date();
                      date.setDate(date.getDate() + Number(durationDays));

                      return date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      });
                    })()}
                  </Typography>
                </Box>

                <Chip
                  label={`${durationDays} Days`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>
            )}

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            gap: 1,
          }}
        >
          <Button
            onClick={handleClose}
            disabled={loading}
            color="inherit"
            sx={{
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleBorrow}
            disabled={
              loading ||
              !Number.isInteger(Number(durationDays)) ||
              Number(durationDays) < 1 ||
              Number(durationDays) > 30
            }
            sx={{
              bgcolor: "#176b51",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              borderRadius: 2,

              "&:hover": {
                bgcolor: "#12543f",
              },
            }}
          >
            {loading ? "Borrowing..." : "Confirm Borrow"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
