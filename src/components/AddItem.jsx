import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormLabel from "@mui/material/FormLabel";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

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

export default function AddItem({ onItemAdded, onClose }) {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forms, setForms] = useState({
    title: "",
    authorPublisher: "",
    yearOfPublication: 0,
    isAvailable: true,
    itemType: "",
    isbn: "",
    numberOfPages: 0,
    issueNumber: 0,
    category: "",
    publicationDate: "",
    region: "",
    
  });
  const [openAddItem, setOpenAddItem] = useState(true);

  const handleCloseAddItem = () => {
    onClose(); // Call the onClose function to close the dialog
    setOpenAddItem(false);
  };

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForms((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,

      ...(name === "publicationDate" && {
        yearOfPublication: value ? Number(value.slice(0, 4)) : null,
      }),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const itemData = {
      ...forms,

      publicationDate:
        forms.itemType === "Newspaper" ? forms.publicationDate || null : null,

      isbn: forms.itemType === "Book" ? forms.isbn : null,

      numberOfPages:
        forms.itemType === "Book" ? Number(forms.numberOfPages) : null,

      issueNumber:
        forms.itemType === "Magazine" ? Number(forms.issueNumber) : null,

      category: forms.itemType === "Magazine" ? forms.category : null,

      region: forms.itemType === "Newspaper" ? forms.region : null,

      yearOfPublication:
        forms.yearOfPublication === "" ? null : Number(forms.yearOfPublication),
    };
    console.log("Original Forms:", forms);
    console.log("Processed ItemData:", itemData);
    try {
      const response = await fetch(
        "https://localhost:7000/api/LibraryRepo/AddItem",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemData),
        },
      );

      if (!response.ok) {
        const details = await response.text();
        throw new Error(`Failed to add item: ${response.status} ${details}`);
      }

      console.log("Item added successfully");

      onItemAdded();
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={openAddItem} onClose={handleCloseAddItem} fullWidth>
      <DialogTitle>Add Item</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add an item to the library, please fill out the form below.
        </DialogContentText>
        <form onSubmit={handleSubmit} id="AddItem-form">
          <Stack spacing={2}>
            <Item>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="selectItemLabel">Item Type</InputLabel>
                  <Select
                    labelId="selectItemLabel"
                    name="itemType"
                    value={forms.itemType}
                    label="Item Type"
                    onChange={handleChange}
                  >
                    <MenuItem value="Book">Book</MenuItem>
                    <MenuItem value="Magazine">Magazine</MenuItem>
                    <MenuItem value="Newspaper">Newspaper</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Item>
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
                  value={forms.title}
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
                  value={forms.authorPublisher}
                  onChange={handleChange}
                />
              </FormControl>
            </Item>

            {forms.itemType === "Book" && (
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
                        value={forms.yearOfPublication}
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
                        value={forms.numberOfPages}
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
                      value={forms.isbn}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Item>
              </>
            )}
            {forms.itemType === "Magazine" && (
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
                        value={forms.yearOfPublication}
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
                        value={forms.issueNumber}
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
                      value={forms.category}
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
            {forms.itemType === "Newspaper" && (
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
                        value={forms.publicationDate}
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
                        value={forms.region}
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
                      forms.isAvailable ? "success.main" : "text.secondary"
                    }
                  >
                    {forms.isAvailable ? "Available" : "Unavailable"}
                  </Typography>

                  <Switch
                    name="isAvailable"
                    checked={forms.isAvailable}
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
        <Button onClick={handleCloseAddItem}>Cancel</Button>
        <Button type="submit" form="AddItem-form" disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </DialogActions>
    </Dialog>
  );
}
