import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import AddItem from "../../components/AddItem";
import EditItem from "../../components/EditItem";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Items() {
  const { token } = useContext(AuthContext);
  const [refresh, setRefresh] = useState(0);
  const [items, setItems] = useState([]);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (item) => {
    setShowEdit(true);
    setSelectedItem(item);
  };

  useEffect(() => {
    const controller = new AbortController();

    async function fetchItems() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          "https://localhost:7000/api/LibraryRepo/ListItems",
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
        setItems(data);
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

    fetchItems();
    return () => controller.abort();
  }, [token, refresh]);

  if (loading) {
    return <p>Loading members...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  async function handleDelete(itemId) {
    try {
      const response = await fetch(
        `https://localhost:7000/api/LibraryRepo/DeleteItem/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response);
      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }
      setOpen(false);

      setRefresh((prev) => prev + 1);
    } catch (err) {
      setError(err.message);
    }
  }

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "authorPublisher", headerName: "Author", flex: 1 },
    {
      field: "yearOfPublication",
      headerName: "Year of Publication",
      flex: 1,
    },
    {
      field: "isAvailable",
      headerName: "Available",
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%" }}
        >
          {params.value ? (
            <CheckCircleIcon color="success" fontSize="small" />
          ) : (
            <CancelIcon color="error" fontSize="small" />
          )}

          <Typography variant="body2">
            {params.value ? "Available" : "Unavailable"}
          </Typography>
        </Box>
      ),
    },
    { field: "itemType", headerName: "Item Type", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      renderCell: (params) => (
        <Stack direction="row">
          <IconButton
            onClick={() => handleEdit(params.row)}
            aria-label="edit"
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleClickOpen(params.row.id)}
            aria-label="delete"
            color="error"
          >
            <DeleteForeverIcon />
          </IconButton>
        </Stack>
      ),
      flex: 1,
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
        Items List
      </Typography>
      <Typography color="text.secondary">
        Here you can manage the items in the library. You can add new items,
        edit existing ones, or delete items that are no longer needed.
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <IconButton
          variant="outlined"
          onClick={() => setShowAddItemForm(!showAddItemForm)}
        >
          {showAddItemForm ? (
            <CloseIcon color="error" />
          ) : (
            <AddIcon color="primary" />
          )}
        </IconButton>
      </Box>

      {showAddItemForm && (
        <AddItem
          onItemAdded={() => {
            setShowAddItemForm(false);
            setRefresh((prev) => prev + 1);
          }}
          onClose={() => setShowAddItemForm(false)}
        />
      )}

      {showEdit && (
        <EditItem
          item={selectedItem} // Assuming you want to edit the first item for demonstration
          onItemUpdated={() => {
            setRefresh((prev) => prev + 1);
          }}
          onCancel={() => {
            setShowEdit(false);
            setSelectedItem(null);
          }}
        />
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        role="alertdialog"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure that you want to delete this item?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            No
          </Button>
          <Button onClick={() => handleDelete(selectedItem)}>Yes</Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={items}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          showToolbar
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
        />
      </Paper>
    </>
  );
}
