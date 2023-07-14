import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllWorkflows, createNewWF } from "../services/api";
import GlobalNavbar from "./Navigation/GlobalNavbar";
import NewWFModal from "./Modals/NewWFModal.js";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const gridStyles = {
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "rgba(25, 118, 210, 0.08)",
	fontSize: 16
  },
  "& .MuiDataGrid-row": {
    cursor: "pointer",
    "&:nth-child(2n)": { backgroundColor: "#FCFCFC" } 
  }
 }

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
  },
  { field: "name", headerName: "Workflow Name", width: 170 },
  {
    field: "active",
    valueGetter: (params) => {
      return params.value ? "Active" : "Inactive";
    },
    headerName: "Status",
    width: 90,
  },
  {
    field: "delete",
	headerName: "",
	width: 90,
	renderCell: (params) => {
	  return <Button color="primary">Delete</Button>
	}
  }
];

const Workflows = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [newWFVisible, setNewWFVisible] = useState(false);

  useEffect(() => {
    const getInitialData = async () => {
      const res = await getAllWorkflows();
      setWorkflows(res);
    };
    getInitialData();
  }, [setWorkflows]);
  const handleRowClick = (params, event, details) => {
    navigate(`/workflow/${params.row.id}`);
  };

  const handleCloseNewWFModal = (e) => {
    e.preventDefault();
    setNewWFVisible(false);
  };

  const handleSaveNewWF = (e) => {
    e.preventDefault();
    setNewWFVisible(false);
  };
  return (
    <>
      <GlobalNavbar onHomePage={true} />
	  <Stack direction="row" sx={{margin:"10px 20px 10px 20px"}} spacing={20} justifyContent="space-between">
	    <h4>Workflows</h4>
       <Button
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            setNewWFVisible(true);
          }}
        >
          Create New Workflow
        </Button>
	  </Stack>
      <div style={{ height: 400, width: "100%"}}>
        <DataGrid
          rows={workflows}
          columns={columns}
          onRowClick={handleRowClick}
		  sx={gridStyles}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </div>
      {newWFVisible ? (
        <NewWFModal
          newWFVisible={newWFVisible}
          handleCloseNewWFModal={handleCloseNewWFModal}
          handleSaveNewWF={handleSaveNewWF}
        />
      ) : null}
    </>
  );
};

export default Workflows;
