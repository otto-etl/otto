import React from "react";
import { useState, useEffect } from "react";
import { getAllWorkflows, createNewWF } from "../services/api";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import NewWFModal from "./Modals/NewWFModal.js";
import Button from "@mui/material/Button";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
  },
  { field: "name", headerName: "Workflow Name", width: 130 },
  {
    field: "active",
    valueGetter: (params) => {
      return params.value ? "Active" : "Inactive";
    },
    headerName: "Status",
    width: 90,
  },
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
      <div style={{ height: 400, width: "100%" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            setNewWFVisible(true);
          }}
        >
          Create New Workflow
        </Button>
        <DataGrid
          rows={workflows}
          columns={columns}
          onRowClick={handleRowClick}
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
