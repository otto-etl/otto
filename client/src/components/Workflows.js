import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllWorkflows } from "../services/api";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

const columns = [
  {
    field: "id",
    // headerName: "ID",
    width: 70,
    renderCell: (params) => {
      return <Link to={`/workflow/${params.id}`}>{params.id}</Link>;
    },
  },
  { field: "name", headerName: "Workflow Name", width: 130 },
  { field: "active", headerName: "Status", width: 90 },
];

const Workflows = () => {
  const [workflows, setWorkflows] = useState([]);
  useEffect(() => {
    const getInitialData = async () => {
      const res = await getAllWorkflows();
      setWorkflows(res);
    };
    getInitialData();
  });

  return (
    <>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={workflows}
          columns={columns}
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
