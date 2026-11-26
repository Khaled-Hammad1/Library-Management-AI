import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Button,
} from "@mui/material";

import { CardMedia } from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PaymentsIcon from "@mui/icons-material/Payments";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ReplayIcon from "@mui/icons-material/Replay";

export default function BorrowingHistory() {
  const { token, id } = useContext(AuthContext);

  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBorrowings() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://localhost:7000/api/MemberRepo/ShowBorrowingHistory/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load borrowings");
        }

        const data = await response.json();
        setBorrowings(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchBorrowings();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Current date
  const today = new Date();

  // Active borrowings
  const activeBorrowings = borrowings.filter(
    (item) => item.returnDate === null,
  );

  // Overdue borrowings
  const overdueBorrowings = activeBorrowings.filter(
    (item) => new Date(item.dueDate) < today,
  );

  // Total recorded fines
  const totalFines = borrowings.reduce((total, item) => total + item.fine, 0);

  function formatDate(date) {
    return new Date(date).toLocaleDateString();
  }

  function getDaysLeft(dueDate) {
    const difference = new Date(dueDate) - new Date();

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  async function handleReturnBook(borrowingId) {
    try {
      const response = await fetch(
        `https://localhost:7000/api/BorrowingRepo/ReturnItem/${borrowingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to return the book");
      }

      const data = await response.json();

      console.log("Return data:", data);

      setBorrowings((prevBorrowings) =>
        prevBorrowings.map((borrowing) =>
          borrowing.id === borrowingId
            ? {
                ...borrowing,
                returnDate: data.returnDate ?? new Date().toISOString(),
                fine: data.fine ?? borrowing.fine,
              }
            : borrowing,
        ),
      );
    } catch (error) {
      console.error("Error returning the book:", error);
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
        My Borrowings
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Track your borrowed books and due dates.
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Active */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 2, borderRadius: 3 }}>
            <CardContent>
              <MenuBookIcon sx={{ fontSize: 35, color: "#176b51", mb: 2 }} />

              <Typography variant="h4" fontWeight="bold">
                {activeBorrowings.length}
              </Typography>

              <Typography color="text.secondary">Active Borrowings</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Overdue */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 2, borderRadius: 3 }}>
            <CardContent>
              <WarningAmberIcon
                sx={{ fontSize: 35, color: "#ed6c02", mb: 2 }}
              />

              <Typography variant="h4" fontWeight="bold">
                {overdueBorrowings.length}
              </Typography>

              <Typography color="text.secondary">Overdue Books</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Fines */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 2, borderRadius: 3 }}>
            <CardContent>
              <PaymentsIcon sx={{ fontSize: 35, color: "#1976d2", mb: 2 }} />

              <Typography variant="h4" fontWeight="bold">
                {totalFines.toFixed(2)}
              </Typography>

              <Typography color="text.secondary">
                Total Recorded Fines
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Borrowed Books Section */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Currently Borrowed
      </Typography>

      {activeBorrowings.length === 0 ? (
        <Alert severity="info">You don't have any active borrowings.</Alert>
      ) : (
        <Grid container spacing={3}>
          {activeBorrowings.map((borrowing) => {
            const daysLeft = getDaysLeft(borrowing.dueDate);
            const isOverdue = daysLeft < 0;

            return (
              <Grid key={borrowing.id} size={{ xs: 12, md: 6 }}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: "100%",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 3 }}>
                    {/* Book Placeholder */}
                    <Box
                      sx={{
                        width: 90,
                        height: 120,
                        bgcolor: "#f1f5f3",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Card sx={{ maxWidth: 345 }}>
                        <CardMedia
                          component="img"
                          image={
                            borrowing.libraryItem?.imageUrl ||
                            (borrowing.libraryItem?.isbn
                              ? `https://covers.openlibrary.org/b/isbn/${borrowing.libraryItem?.isbn}-L.jpg?default=false`
                              : "/images/book-placeholder.png")
                          }
                          alt={borrowing.libraryItem?.title}
                          sx={{
                            width: "auto",
                            maxWidth: "100%",
                            height: "100%",
                            objectFit: "contain",
                            boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
                          }}
                        />
                      </Card>
                    </Box>

                    {/* Book Details */}
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {borrowing.libraryItem?.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {borrowing.libraryItem?.authorPublisher}
                      </Typography>

                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Borrowed:</strong>{" "}
                        {formatDate(borrowing.borrowDate)}
                      </Typography>

                      <Typography variant="body2" sx={{ mb: 2 }}>
                        <CalendarMonthIcon
                          sx={{
                            fontSize: 16,
                            verticalAlign: "middle",
                            mr: 1,
                          }}
                        />
                        <strong>Due:</strong> {formatDate(borrowing.dueDate)}
                      </Typography>

                      <Chip
                        label={
                          isOverdue
                            ? `${Math.abs(daysLeft)} days overdue`
                            : `${daysLeft} days left`
                        }
                        color={isOverdue ? "error" : "success"}
                        size="small"
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          ml: 2,
                          backgroundColor: "black",
                          "&:hover": { bgcolor: "#333" },
                        }}
                        endIcon={<ReplayIcon />}
                        onClick={() => handleReturnBook(borrowing.id)}
                      >
                        return
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
