import { Box, Grid2, Modal } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import { useMemo, useState } from "react";
import MetricsOverview from "../MetricsOverview";
import { columns } from "./column";
import { getData } from "./util";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

interface DataGridReportProps {
  data: any[];
  loading: boolean;
}

interface RowData {
  id: number;
  [key: string]: any;
}

export default function DataGridReport({
  data = [],
  loading,
}: DataGridReportProps) {
  const rows = useMemo(() => getData(data), [data]);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [open, setOpenModal] = useState(false);

  const handleClose = () => setOpenModal(false);

  return (
    <Grid2 container justifyContent={"center"} width={"100%"} height={400}>
      <DataGrid
        loading={loading}
        rows={rows}
        columns={columns}
        hideFooter
        slots={{ toolbar: GridToolbar }}
        onRowClick={(row) => {
          setSelectedRow(row as any);
          setOpenModal(true);
        }}
      />
      {selectedRow?.row && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...style, width: 800 }}>
            <MetricsOverview metric={selectedRow.row} />
          </Box>
        </Modal>
      )}
    </Grid2>
  );
}
