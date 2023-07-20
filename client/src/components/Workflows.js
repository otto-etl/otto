import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllWorkflows, deleteWorkflow } from "../services/api";
import GlobalNavbar from "./Navigation/GlobalNavbar";
import NewWFModal from "./Modals/NewWFModal.js";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  IconButton,
  Stack,
  Container,
  Typography,
  Box,
} from "@mui/material";
import { Plus, Trash2 } from "lucide-react";

const gridStyles = {
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#f3f4f6 ",
  },
  "& .MuiDataGrid-row": {
    cursor: "pointer",
  },
  "& .MuiDataGrid-row:hover [data-delete-icon]": {
    visibility: "visible",
  },
  "& .MuiDataGrid-cell:focus": {
    outline: "none",
  },
  fontSize: "16px",
};

const Workflows = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [newWFVisible, setNewWFVisible] = useState(false);

  const columns = [
    { field: "name", headerName: "Name", width: 550 },
    {
      field: "active",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        return (
          <Box>
            {params.value ? (
              <Typography sx={{ color: "#247c44", fontWeight: "500" }}>
                Active
              </Typography>
            ) : (
              <Typography sx={{ color: "#555" }}>Inactive</Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: "id",
      headerName: "",
      width: 30,
      renderCell: (params) => {
        return (
          <IconButton
            data-delete-icon
            aria-label={`Delete workflow ${params.value}`}
            sx={{
              display: "flex",
              justifyContent: "center",
              visibility: "hidden",
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteWorkflow(params.value);
              setWorkflows((prev) =>
                prev.filter((workflow) => workflow.id !== params.value)
              );
            }}
          >
            <Trash2 size={18} />
          </IconButton>
        );
      },
    },
  ];

  useEffect(() => {
    const getInitialData = async () => {
      const res = await getAllWorkflows();
      setWorkflows(res);
    };
    getInitialData();
  }, [setWorkflows]);

  const handleRowClick = (params) => {
    navigate(`/workflow/${params.row.id}`);
  };

  const handleCloseNewWFModal = (e) => {
    e.preventDefault();
    setNewWFVisible(false);
  };

  return (
    <>
      <GlobalNavbar onHomePage={true} />
      <Container sx={{ maxWidth: "800px !important", marginTop: "60px" }}>
        <Stack
          direction="row"
          spacing={20}
          justifyContent="space-between"
          alignItems="center"
          marginBottom={"20px"}
        >
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: "500",
            }}
          >
            Workflows
          </Typography>
          <Button
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              setNewWFVisible(true);
            }}
            sx={{ gap: "10px" }}
            size="small"
          >
            <Plus size={18} />
            Create Workflow
          </Button>
        </Stack>
        <div style={{ height: "631px", width: "100%" }}>
          <DataGrid
            rows={workflows}
            columns={columns}
            onRowClick={handleRowClick}
            sx={gridStyles}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            slots={{
              noRowsOverlay: () => (
                <Typography
                  sx={{
                    textAlign: "center",
                    paddingTop: "50px",
                    color: "#555",
                  }}
                >
                  No rows
                </Typography>
              ),
            }}
          />
        </div>
      </Container>
      {newWFVisible ? (
        <NewWFModal
          newWFVisible={newWFVisible}
          handleCloseNewWFModal={handleCloseNewWFModal}
          // handleSaveNewWF={handleSaveNewWF}
        />
      ) : null}
    </>
  );
};

export default Workflows;
