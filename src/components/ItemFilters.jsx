
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Stack,
  Divider,
  Switch,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TuneIcon from "@mui/icons-material/Tune";

export default function ItemFilters({
  filters,
  onChange,
  onReset,
}) {
  // Update one filter without losing the others
  function handleChange(name, value) {
    onChange((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ mb: 3 }}
      >
        <TuneIcon color="primary" />

        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Search & Filters
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Find books, magazines, and newspapers
          </Typography>
        </Box>
      </Stack>

      {/* Search Field & Reset */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search library items..."
          value={filters.search}
          onChange={(e) =>
            handleChange("search", e.target.value)
          }
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
            htmlInput: {
              "aria-label": "Search library items",
            },
          }}
        />

        <Button
          type="button"
          variant="outlined"
          color="inherit"
          startIcon={<RestartAltIcon />}
          onClick={onReset}
          sx={{
            minWidth: 130,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            whiteSpace: "nowrap",
          }}
        >
          Reset All
        </Button>
      </Stack>

      {/* Advanced Filters */}
      <Grid container spacing={2}>
        {/* Item Type */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Item Type"
            value={filters.type}
            onChange={(e) =>
              handleChange("type", e.target.value)
            }
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="Book">Books</MenuItem>
            <MenuItem value="Magazine">Magazines</MenuItem>
            <MenuItem value="Newspaper">Newspapers</MenuItem>
          </TextField>
        </Grid>

        {/* Publication Year */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Publication Year"
            placeholder="e.g. 2024"
            value={filters.year}
            onChange={(e) =>
              handleChange("year", e.target.value)
            }
            slotProps={{
              htmlInput: {
                min: 1450,
                max: new Date().getFullYear(),
                step: 1,
              },
            }}
          />
        </Grid>

        {/* Search By */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Search By"
            value={filters.searchBy}
            onChange={(e) =>
              handleChange("searchBy", e.target.value)
            }
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="author">
              Author / Publisher
            </MenuItem>
          </TextField>
        </Grid>

        {/* Sort By */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Sort By"
            value={filters.sortBy}
            onChange={(e) =>
              handleChange("sortBy", e.target.value)
            }
          >
            <MenuItem value="available">
              Available First
            </MenuItem>

            <MenuItem value="title">
              Title A-Z
            </MenuItem>

            <MenuItem value="newest">
              Newest First
            </MenuItem>

            <MenuItem value="oldest">
              Oldest First
            </MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2.5 }} />

      {/* Availability Filter */}
      <FormControlLabel
        control={
          <Switch
            color="success"
            checked={filters.availableOnly}
            onChange={(e) =>
              handleChange(
                "availableOnly",
                e.target.checked
              )
            }
          />
        }
        label={
          <Typography variant="body2" fontWeight={500}>
            Available Items Only
          </Typography>
        }
        sx={{ ml: 0 }}
      />
    </Box>
  );
}
