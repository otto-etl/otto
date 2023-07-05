import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllWorkflows } from "../services/api";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
  },
  { field: "name", headerName: "Workflow Name", width: 130 },
  { field: "active", headerName: "Status", width: 90 },
];

const Workflows = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  useEffect(() => {
    const getInitialData = async () => {
      const res = await getAllWorkflows();
      setWorkflows(res);
    };
    getInitialData();
  });
  const handleRowClick = (params, event, details) => {
    navigate(`/workflow/${params.row.id}`);
  };

  return (
    <>
      <div style={{ height: 400, width: "100%" }}>
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
    </>
  );
};

export default Workflows;
