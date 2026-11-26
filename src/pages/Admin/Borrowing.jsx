import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { TextField } from "@mui/material";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Card, CardContent, CardActionArea } from "@mui/material";
export default function Borrowing() {
  const { token } = useContext(AuthContext);
  const [Allborrowings, setAllBorrowings] = useState([]);
  const [filter, setFilter] = useState("Active");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBorrowings() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          "https://localhost:7000/api/BorrowingRepo/AllBorrowings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const data = await response.json();
        const formattedData = data.map((borrowing) => ({
          ...borrowing,
          borrowDate: new Date(borrowing.borrowDate),
          dueDate: new Date(borrowing.dueDate),
          id: borrowing.borrowingId, // Ensure each row has a unique 'id' field for DataGrid
          status:
            borrowing.returnDate != null
              ? "Returned"
              : new Date(borrowing.dueDate) < new Date()
                ? "Overdue"
                : "Active",
        }));
        setAllBorrowings(formattedData);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchBorrowings();
    return () => controller.abort();
  }, [token]);

  if (loading) {
    return <p>Loading borrowings...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }
  const filteredBorrowings = Allborrowings.filter((borrowing) => {
    if (filter === "Active") {
      return (
        borrowing.status === "Active" &&
        borrowing.memberName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === "Overdue") {
      return (
        borrowing.status === "Overdue" &&
        borrowing.memberName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === "History") {
      return (
        borrowing.status === "Returned" &&
        borrowing.memberName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === "All") {
      return (
        borrowing &&
        borrowing.memberName.toLowerCase().includes(search.toLowerCase())
      );
    }

    return false;
  });
  const columns = [
    { field: "borrowingId", headerName: "ID", width: 70 },
    { field: "memberName", headerName: "Member Name", flex: 1 },
    { field: "itemTitle", headerName: "Item Title", flex: 1 },
    {
      field: "borrowDate",
      headerName: "Borrow Date",
      type: "date",
      flex: 1,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      type: "date",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        const status = params.value;

        return (
          <Chip
            label={status}
            size="small"
            color={
              status === "Returned"
                ? "success"
                : status === "Overdue"
                  ? "error"
                  : "primary"
            }
            variant="outlined"
          />
        );
      },
    },
  ];

  const activeCount = Allborrowings.filter((b) => b.status === "Active").length;

  const overdueCount = Allborrowings.filter(
    (b) => b.status === "Overdue",
  ).length;

  const returnedCount = Allborrowings.filter(
    (b) => b.status === "Returned",
  ).length;

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          Borrowings Management
        </Typography>

        <Typography color="text.secondary">
          View and monitor library borrowings
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
          },
          gap: 2,
          mb: 4,
        }}
      >
        {[
          {
            title: "Active",
            count: activeCount,
            color: "#2563eb",
            filterValue: "Active",
          },
          {
            title: "Overdue",
            count: overdueCount,
            color: "#dc2626",
            filterValue: "Overdue",
          },
          {
            title: "Returned",
            count: returnedCount,
            color: "#16a34a",
            filterValue: "History",
          },
        ].map((card) => (
          <Card
            key={card.title}
            variant="outlined"
            sx={{
              borderRadius: 3,
              transition: "0.2s",
              borderColor: filter === card.filterValue ? card.color : "divider",
              "&:hover": {
                boxShadow: 3,
              },
            }}
          >
            <CardActionArea onClick={() => setFilter(card.filterValue)}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>

                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{
                    color: card.color,
                    mt: 1,
                  }}
                >
                  {card.count}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {/* Filters and Search */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(event, newFilter) => {
            if (newFilter !== null) {
              setFilter(newFilter);
            }
          }}
          size="small"
          sx={{
            "& .Mui-selected": {
              backgroundColor: "#e8f5e9 !important",
              color: "#00875a !important",
            },
          }}
        >
          <ToggleButton value="All">All</ToggleButton>
          <ToggleButton value="Active">Active</ToggleButton>
          <ToggleButton value="Overdue">Overdue</ToggleButton>
          <ToggleButton value="History">History</ToggleButton>
        </ToggleButtonGroup>

        <TextField
          label="Search Borrowings by Member Name"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: {
              xs: "100%",
              sm: 280,
            },
          }}
        />
      </Box>

      {/* Borrowings Table */}
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
        }}
      >
        <DataGrid
          rows={filteredBorrowings}
          columns={columns}
          getRowId={(row) => row.borrowingId}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8fafc",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 700,
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f0fdf4",
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
            },
          }}
        />
      </Paper>
    </Box>
  );
}
