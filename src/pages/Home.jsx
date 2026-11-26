
import { useState, useEffect, useMemo } from "react";

import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Stack,
  Paper,
  Skeleton,
  Alert,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";

import ItemFilters from "../components/ItemFilters";
import BorrowItem from "../components/BorrowItem";

const API_URL =
  "https://localhost:7000/api/LibraryRepo/ListItems";

const DEFAULT_IMAGE = "/images/CoverNotAvailable.png";

const PAGE_SIZE = 12;

const INITIAL_FILTERS = {
  search: "",
  searchBy: "title",
  type: "all",
  year: "",
  sortBy: "available",
  availableOnly: false,
};

// ===============================
// Item Details Row
// ===============================

function DetailRow({ label, value }) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 2,
        py: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Typography
        variant="body2"
        fontWeight={600}
        sx={{
          textAlign: "right",
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

// ===============================
// Home Component
// ===============================

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [refresh, setRefresh] = useState(0);

  // All filters in one state
  const [filters, setFilters] = useState({
    ...INITIAL_FILTERS,
  });

  // Pagination
  const [page, setPage] = useState(1);

  // Selected item for details
  const [selectedItem, setSelectedItem] = useState(null);

  // ===============================
  // Fetch Items
  // ===============================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchItems() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load items: HTTP ${response.status}`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data received from API");
        }

        if (!controller.signal.aborted) {
          setItems(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
          console.error("Error fetching items:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchItems();

    return () => controller.abort();
  }, [refresh]);

  // ===============================
  // Update Filters
  // ===============================

  function handleFiltersChange(updater) {
    setFilters(updater);
    setPage(1);
  }

  // ===============================
  // Reset All Filters
  // ===============================

  function handleResetFilters() {
    setFilters({ ...INITIAL_FILTERS });
    setPage(1);
  }

  // ===============================
  // Borrow Success
  // ===============================

  function handleBorrowSuccess(itemId) {
    setItems((prevItems) =>
      prevItems.map((item) =>
        String(item.id) === String(itemId)
          ? { ...item, isAvailable: false }
          : item
      )
    );
  }

  // ===============================
  // Filter & Sort Items
  // ===============================

  const filteredItems = useMemo(() => {
    const {
      search,
      searchBy,
      type,
      year,
      sortBy,
      availableOnly,
    } = filters;

    const searchText = search.trim().toLowerCase();

    const result = items.filter((item) => {
      // Search by title or author
      const searchValue =
        searchBy === "author"
          ? item.authorPublisher
          : item.title;

      const matchesSearch =
        !searchText ||
        String(searchValue ?? "")
          .toLowerCase()
          .includes(searchText);

      // Filter by type
      const matchesType =
        type === "all" ||
        String(item.itemType ?? "").toLowerCase() ===
          type.toLowerCase();

      // Filter by year
      const matchesYear =
        year === "" ||
        Number(item.yearOfPublication) === Number(year);

      // Filter by availability
      const matchesAvailability =
        !availableOnly || item.isAvailable === true;

      return (
        matchesSearch &&
        matchesType &&
        matchesYear &&
        matchesAvailability
      );
    });

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "available": {
          const difference =
            Number(b.isAvailable) -
            Number(a.isAvailable);

          return difference !== 0
            ? difference
            : String(a.title ?? "").localeCompare(
                String(b.title ?? "")
              );
        }

        case "title":
          return String(a.title ?? "").localeCompare(
            String(b.title ?? "")
          );

        case "newest":
          return (
            Number(b.yearOfPublication ?? 0) -
            Number(a.yearOfPublication ?? 0)
          );

        case "oldest":
          return (
            Number(a.yearOfPublication ?? 0) -
            Number(b.yearOfPublication ?? 0)
          );

        default:
          return 0;
      }
    });

    return result;
  }, [items, filters]);

  // ===============================
  // Pagination
  // ===============================

  const totalPages = Math.ceil(
    filteredItems.length / PAGE_SIZE
  );

  const currentPage = Math.min(
    page,
    Math.max(totalPages, 1)
  );

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // ===============================
  // Statistics
  // ===============================

  const availableCount = items.filter(
    (item) => item.isAvailable === true
  ).length;

  // ===============================
  // Render
  // ===============================

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        maxWidth: 1600,
        mx: "auto",
        p: { xs: 2, md: 3 },
      }}
    >
      {/* Page Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mb: 1 }}
          >
            Explore Our Library
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Discover and borrow books, magazines,
            and newspapers.
          </Typography>
        </Box>

        {!loading && !error && (
          <Stack direction="row" spacing={1}>
            <Chip
              label={`${items.length} Items`}
              variant="outlined"
            />

            <Chip
              label={`${availableCount} Available`}
              color="success"
              variant="outlined"
            />
          </Stack>
        )}
      </Stack>

      {/* ======================= */}
      {/* Unified Search & Filters */}
      {/* ======================= */}

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, md: 3 },
          mb: 4,
          borderRadius: 3,
        }}
      >
        <ItemFilters
          filters={filters}
          onChange={handleFiltersChange}
          onReset={handleResetFilters}
        />
      </Paper>

      {/* ======================= */}
      {/* Results Header          */}
      {/* ======================= */}

      {!loading && !error && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
          >
            Library Catalog
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {filteredItems.length} items found
          </Typography>
        </Box>
      )}

      {/* ======================= */}
      {/* Loading Skeletons       */}
      {/* ======================= */}

      {loading && (
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid
              key={index}
              size={{
                xs: 12,
                sm: 6,
                lg: 4,
                xl: 3,
              }}
            >
              <Card sx={{ borderRadius: 3 }}>
                <Skeleton
                  variant="rectangular"
                  height={230}
                />

                <Box sx={{ p: 3 }}>
                  <Skeleton height={35} width="85%" />
                  <Skeleton width="60%" />

                  <Skeleton
                    variant="rounded"
                    height={35}
                    sx={{ mt: 3 }}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ======================= */}
      {/* Error State             */}
      {/* ======================= */}

      {!loading && error && (
        <Box sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>

          <Button
            variant="contained"
            onClick={() =>
              setRefresh((prev) => prev + 1)
            }
          >
            Try Again
          </Button>
        </Box>
      )}

      {/* ======================= */}
      {/* Empty State             */}
      {/* ======================= */}

      {!loading &&
        !error &&
        filteredItems.length === 0 && (
          <Paper
            variant="outlined"
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{ mb: 1 }}
            >
              No Items Found
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Try changing your search or filters.
            </Typography>

            <Button
              variant="outlined"
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
          </Paper>
        )}

      {/* ======================= */}
      {/* Items Grid              */}
      {/* ======================= */}

      {!loading &&
        !error &&
        filteredItems.length > 0 && (
          <>
            <Grid container spacing={3}>
              {paginatedItems.map((item) => (
                <Grid
                  key={item.id}
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 4,
                    xl: 3,
                  }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                      boxShadow:
                        "0 2px 10px rgba(0,0,0,0.04)",
                      transition:
                        "transform 0.25s, box-shadow 0.25s",

                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow:
                          "0 12px 28px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    {/* Item Image */}
                    <Box
                      sx={{
                        height: 240,
                        bgcolor: "#f3f6f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 3,
                        position: "relative",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={
                          item.imageUrl || DEFAULT_IMAGE
                        }
                        alt={item.title || "Library item"}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            DEFAULT_IMAGE;
                        }}
                        sx={{
                          width: "auto",
                          maxWidth: "100%",
                          height: "100%",
                          objectFit: "contain",
                          filter:
                            "drop-shadow(0 5px 7px rgba(0,0,0,0.12))",
                        }}
                      />

                      <Chip
                        label={
                          item.isAvailable
                            ? "Available"
                            : "Unavailable"
                        }
                        color={
                          item.isAvailable
                            ? "success"
                            : "error"
                        }
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    {/* Item Information */}
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        p: 2.5,
                      }}
                    >
                      <Chip
                        label={item.itemType}
                        size="small"
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />

                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: 17,
                          fontWeight: 700,
                          lineHeight: 1.4,
                          mb: 1,
                          minHeight: 48,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          minHeight: 42,
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.authorPublisher}
                      </Typography>

                      <Divider sx={{ mb: 2 }} />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Published
                        </Typography>

                        <Typography
                          variant="body2"
                          fontWeight={600}
                        >
                          {item.yearOfPublication ?? "N/A"}
                        </Typography>
                      </Box>
                    </CardContent>

                    {/* Card Actions */}
                    <CardActions
                      sx={{
                        px: 2.5,
                        pb: 2.5,
                        pt: 0,
                        mt: "auto",
                        display: "flex",
                        gap: 1,
                        "& > :not(style) ~ :not(style)": {
                          ml: 0,
                        },
                      }}
                    >
                      {/* View Details */}
                      <Button
                        variant="outlined"
                        onClick={() =>
                          setSelectedItem(item)
                        }
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Details
                      </Button>

                      {/* Borrow Button */}
                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,

                          "& .MuiButton-root": {
                            width: "100%",
                            bgcolor: "#176b51",
                            color: "white",
                            borderRadius: 2,
                            fontWeight: 600,
                            textTransform: "none",

                            "&:hover": {
                              bgcolor: "#12543f",
                            },

                            "&.Mui-disabled": {
                              bgcolor: "#e5e7eb",
                              color: "#9ca3af",
                            },
                          },
                        }}
                      >
                        <BorrowItem
                          item={item}
                          onBorrow={handleBorrowSuccess}
                        />
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 5,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, value) =>
                    setPage(value)
                  }
                  color="primary"
                  shape="rounded"
                />
              </Box>
            )}

            {/* Results Information */}
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ mt: 2 }}
            >
              Showing{" "}
              {(currentPage - 1) * PAGE_SIZE + 1}
              {" - "}
              {Math.min(
                currentPage * PAGE_SIZE,
                filteredItems.length
              )}
              {" of "}
              {filteredItems.length} items
            </Typography>
          </>
        )}

      {/* ======================= */}
      {/* Item Details Dialog     */}
      {/* ======================= */}

      <Dialog
        open={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: { borderRadius: 3 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Item Details
        </DialogTitle>

        <DialogContent dividers>
          {selectedItem && (
            <Stack spacing={3}>
              {/* Item Image & Info */}
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  alignItems: {
                    xs: "center",
                    sm: "flex-start",
                  },
                }}
              >
                <Box
                  component="img"
                  src={
                    selectedItem.imageUrl ||
                    DEFAULT_IMAGE
                  }
                  alt={selectedItem.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      DEFAULT_IMAGE;
                  }}
                  sx={{
                    width: 120,
                    height: 170,
                    objectFit: "contain",
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mb: 1 }}
                  >
                    {selectedItem.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {selectedItem.authorPublisher}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                  >
                    <Chip
                      label={selectedItem.itemType}
                      size="small"
                      variant="outlined"
                    />

                    <Chip
                      label={
                        selectedItem.isAvailable
                          ? "Available"
                          : "Unavailable"
                      }
                      color={
                        selectedItem.isAvailable
                          ? "success"
                          : "error"
                      }
                      size="small"
                    />
                  </Stack>
                </Box>
              </Box>

              <Divider />

              {/* Item Details */}
              <Box>
                <DetailRow
                  label="Item ID"
                  value={selectedItem.id}
                />

                <DetailRow
                  label="Year of Publication"
                  value={selectedItem.yearOfPublication}
                />

                {selectedItem.itemType === "Book" && (
                  <>
                    <DetailRow
                      label="ISBN"
                      value={selectedItem.isbn}
                    />

                    <DetailRow
                      label="Number of Pages"
                      value={selectedItem.numberOfPages}
                    />
                  </>
                )}

                {selectedItem.itemType === "Magazine" && (
                  <>
                    <DetailRow
                      label="Issue Number"
                      value={selectedItem.issueNumber}
                    />

                    <DetailRow
                      label="Category"
                      value={selectedItem.category}
                    />
                  </>
                )}

                {selectedItem.itemType === "Newspaper" && (
                  <>
                    <DetailRow
                      label="Publication Date"
                      value={
                        selectedItem.publicationDate
                          ? String(
                              selectedItem.publicationDate
                            ).slice(0, 10)
                          : null
                      }
                    />

                    <DetailRow
                      label="Region"
                      value={selectedItem.region}
                    />
                  </>
                )}
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={() => setSelectedItem(null)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
