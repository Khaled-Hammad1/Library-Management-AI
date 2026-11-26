import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AddMember from "../../components/AddMember";
import EditMember from "../../components/EditMember";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function Members() {
  const { token } = useContext(AuthContext);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = (item) => {
    setSelectedMember(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (item) => {
    setShowEdit(true);
    setSelectedMember(item);
  };

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMembers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://localhost:7000/api/MemberRepo/ListMember",
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
        console.log("Fetched members:", data); // Debugging line
        setMembers(data);
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

    fetchMembers();

    return () => controller.abort();
  }, [token, refresh]);

  if (loading) {
    return <p>Loading members...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(
        `https://localhost:7000/api/MemberRepo/DeleteMember/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

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
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
    { field: "membershipId", headerName: "Membership ID", flex: 1 },
    { field: "roleOfMem", headerName: "Role", flex: 1 },
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
        Members List
      </Typography>
      <Typography color="text.secondary">
        Here you can manage the members in the library. You can add new members,
        edit existing ones, or delete members that are no longer needed.
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <IconButton
          variant="outlined"
          onClick={() => setShowAddMemberForm(!showAddMemberForm)}
        >
          {showAddMemberForm ? (
            <CloseIcon color="error" />
          ) : (
            <AddIcon color="primary" />
          )}
        </IconButton>
      </Box>

      {showAddMemberForm && (
        <AddMember
          onMemberAdded={() => {
            setShowAddMemberForm(false);
            setRefresh((prev) => prev + 1);
          }}
          onClose={() => setShowAddMemberForm(false)}
        />
      )}

      {showEdit && (
        <EditMember
          member={selectedMember}
          onMemberUpdated={() => {
            setRefresh((prev) => prev + 1);
          }}
          onCancel={() => {
            setShowEdit(false);
            setSelectedMember(null);
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
          <Button onClick={() => handleDelete(selectedMember)}>Yes</Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={members}
          columns={columns}
          showToolbar
          pageSizeOptions={[5, 10]}
          initialState={{ pagination: { paginationModel } }}
          sx={{ border: 0 }}
        />
      </Paper>
    </>
  );
}
