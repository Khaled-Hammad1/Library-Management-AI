import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Switch,
  Box,
  Typography,
  Stack,
  styled,
} from "@mui/material";
import Paper from "@mui/material/Paper";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function EditItem({ item, onItemUpdated, onCancel }) {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openEditItem, setOpenEditItem] = useState(true);

  const handleCloseEditItem = () => {
    onCancel(); // Call the onCancel function to close the dialog
    setOpenEditItem(false);
  };
  console.log("AddItem formData:", item);

  const [formData, setFormData] = useState({
    title: item.title,
    authorPublisher: item.authorPublisher,
    yearOfPublication: item.yearOfPublication,
    isAvailable: item.isAvailable,
    itemType: item.itemType,
    isbn: item.isbn,
    numberOfPages: item.numberOfPages,
    issueNumber: item.issueNumber,
    category: item.category,
    publicationDate: item.publicationDate
      ? item.publicationDate.slice(0, 10)
      : "",
    region: item.region,
  });
  console.log("EditItem formData:", formData);
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const resonse = await fetch(
        `https://localhost:7000/api/LibraryRepo/UpdateItem/${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );
      if (!resonse.ok) {
        const details = await resonse.text();
        throw new Error(`Update failed: ${resonse.status} ${details}`);
      }
      onItemUpdated();
      onCancel(); // Close the dialog after successful update
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={openEditItem} onClose={handleCloseEditItem} fullWidth>
      <DialogTitle>Edit Item</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To edit an item in the library, please fill out the form below.
        </DialogContentText>
        <form onSubmit={handleSubmit} id="AddItem-form">
          <Stack spacing={2}>
            <Item>
              <FormControl fullWidth>
                <FormLabel htmlFor="title" sx={{ mb: 1, textAlign: "left" }}>
                  Title *
                </FormLabel>

                <TextField
                  required
                  fullWidth
                  id="title"
                  name="title"
                  placeholder="Enter item title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </FormControl>
            </Item>
            <Item>
              <FormControl fullWidth>
                <FormLabel
                  htmlFor="authorPublisher"
                  sx={{ mb: 1, textAlign: "left" }}
                >
                  Author/Publisher *
                </FormLabel>

                <TextField
                  required
                  fullWidth
                  id="authorPublisher"
                  name="authorPublisher"
                  placeholder="Enter author or publisher"
                  value={formData.authorPublisher}
                  onChange={handleChange}
                />
              </FormControl>
            </Item>
            {formData.itemType === "Book" && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexGrow: 1,
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Item sx={{ flex: 1, minWidth: 0 }}>
                    <FormControl fullWidth required>
                      <FormLabel
                        htmlFor="yearOfPublication"
                        sx={{ mb: 1, textAlign: "left" }}
                      >
                        Year of Publication
                      </FormLabel>

                      <TextField
                        required
                        fullWidth
                        type="number"
                        id="yearOfPublication"
                        name="yearOfPublication"
                        placeholder="e.g. 2024"
                        value={formData.yearOfPublication}
                        onChange={handleChange}
                        size="small"
                        slotProps={{
                          htmlInput: {
                            min: 1450,
                            max: new Date().getFullYear(),
                            step: 1,
                          },
                        }}
                      />
                    </FormControl>
                  </Item>
                  <Item sx={{ flex: 1, minWidth: 0 }}>
                    <FormControl fullWidth required>
                      <FormLabel
                        htmlFor="numberOfPages"
                        sx={{ mb: 1, textAlign: "left" }}
                      >
                        Number of Pages
                      </FormLabel>

                      <TextField
                        required
                        fullWidth
                        type="number"
                        id="numberOfPages"
                        name="numberOfPages"
                        placeholder="100"
                        value={formData.numberOfPages}
                        onChange={handleChange}
                        size="small"
                        slotProps={{
                          htmlInput: {
                            min: 1,
                            max: 10000,
                            step: 1,
                          },
                        }}
                      />
                    </FormControl>
                  </Item>
                </Box>

                <Item>
                  <FormControl fullWidth required>
                    <FormLabel htmlFor="isbn" sx={{ mb: 1, textAlign: "left" }}>
                      ISBN
                    </FormLabel>
                    <TextField
                      required
                      fullWidth
                      id="isbn"
                      name="isbn"
                      placeholder="Enter ISBN"
                      value={formData.isbn}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Item>
              </>
            )}
            {formData.itemType === "Magazine" && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexGrow: 1,
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Item sx={{ flex: 1, minWidth: 0 }}>
                    <FormControl fullWidth required>
                      <FormLabel
                        htmlFor="yearOfPublication"
                        sx={{ mb: 1, textAlign: "left" }}
                      >
                        Year of Publication
                      </FormLabel>

                      <TextField
                        required
                        fullWidth
                        type="number"
                        id="yearOfPublication"
                        name="yearOfPublication"
                        placeholder="e.g. 2024"
                        value={formData.yearOfPublication}
                        onChange={handleChange}
                        size="small"
                        slotProps={{
                          htmlInput: {
                            min: 1450,
                            max: new Date().getFullYear(),
                            step: 1,
                          },
                        }}
                      />
                    </FormControl>
                  </Item>

                  <Item sx={{ flex: 1, minWidth: 0 }}>
                    <FormControl fullWidth required>
                      <FormLabel
                        htmlFor="issueNumber"
                        sx={{ mb: 1, textAlign: "left" }}
                      >
                        Issue Number
                      </FormLabel>

                      <TextField
                        required
                        fullWidth
                        type="number"
                        id="issueNumber"
                        name="issueNumber"
                        placeholder="100"
                        value={formData.issueNumber}
                        onChange={handleChange}
                        size="small"
                        slotProps={{
                          htmlInput: {
                            min: 1,
                            max: 10000,
                            step: 1,
                          },
                        }}
                      />
                    </FormControl>
                  </Item>
                </Box>
                <Item>
                  <FormControl fullWidth required>
                    <FormLabel
                      htmlFor="category"
                      sx={{ mb: 1, textAlign: "left" }}
                    >
                      Magazine Category
                    </FormLabel>

                    <Select
                      displayEmpty
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      size="small"
                      renderValue={(selected) =>
                        selected ? (
                          selected
                        ) : (
                          <span style={{ color: "#999" }}>
                            Select a category
                          </span>
                        )
                      }
                    >
                      <MenuItem value="" disabled>
                        Select a category
                      </MenuItem>
                      <MenuItem value="Science">Science</MenuItem>
                      <MenuItem value="Technology">Technology</MenuItem>
                      <MenuItem value="Business">Business</MenuItem>
                      <MenuItem value="Sports">Sports</MenuItem>
                      <MenuItem value="Health">Health</MenuItem>
                      <MenuItem value="Fashion">Fashion</MenuItem>
                      <MenuItem value="Entertainment">Entertainment</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Item>
              </>
            )}
            {formData.itemType === "Newspaper" && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexGrow: 1,
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Item sx={{ flex: 1, minWidth: 0 }}>
                    <FormControl fullWidth required>
                      <FormLabel
                        htmlFor="publicationDate"
                        sx={{ mb: 1, textAlign: "left" }}
                      >
                        Publication Date
                      </FormLabel>
                      <TextField
                        required
                        fullWidth
                        type="date"
                        id="publicationDate"
                        name="publicationDate"
                        value={formData.publicationDate}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Item>
                  <Item sx={{ flex: 1, minWidth: 0 }}>
                    <FormControl fullWidth required>
                      <FormLabel
                        htmlFor="region"
                        sx={{ mb: 1, textAlign: "left" }}
                      >
                        Region
                      </FormLabel>
                      <TextField
                        required
                        fullWidth
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Item>
                </Box>
              </>
            )}

            <Item>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{ textAlign: "left" }}
                >
                  Availability
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    color={
                      formData.isAvailable ? "success.main" : "text.secondary"
                    }
                  >
                    {formData.isAvailable ? "Available" : "Unavailable"}
                  </Typography>

                  <Switch
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    size="small"
                    slotProps={{
                      input: { "aria-label": "Item availability" },
                    }}
                  />
                </Box>
              </Box>
            </Item>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEditItem}>Cancel</Button>
        <Button type="submit" form="AddItem-form" disabled={loading}>
          {loading ? "Editing..." : "Edit"}
        </Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </DialogActions>
    </Dialog>
  );
}
