import BarChartIcon from "@mui/icons-material/BarChart";
import { Box, IconButton, Tooltip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { getThresholdCategory } from "./util";

export const columns: GridColDef[] = [
  {
    field: "url",
    headerName: "Url",
    minWidth: 250,
    renderCell: (params) => {
      const value = params.value;
      const id = params.id;
      return (
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <span>{value}</span>
          {id !== "sum" && id !== "avg" && (
            <IconButton aria-label="open" color="info">
              <BarChartIcon />
            </IconButton>
          )}
        </Box>
      );
    },
  },

  {
    field: "interaction_to_next_paint",
    headerName: "Interaction to Next Paint (ms)",
    minWidth: 220,
    renderCell: (params) => {
      const value = params.value.value;
      return <TableCell value={value} params={params} />;
    },
  },
  {
    field: "largest_contentful_paint",
    headerName: "Largest Contentful Paint (ms)",
    minWidth: 220,
    renderCell: (params) => {
      const value = params.value.value;
      return <TableCell value={value} params={params} />;
    },
  },

  {
    field: "first_contentful_paint",
    headerName: "First Contentful Paint (ms)",
    minWidth: 200,
    renderCell: (params) => {
      const value = params.value.value;
      return <TableCell value={value} params={params} />;
    },
  },
  {
    field: "experimental_time_to_first_byte",
    headerName: "Time to First Byte",
    minWidth: 200,
    renderCell: (params) => {
      const value = params.value.value;
      return <TableCell value={value} params={params} />;
    },
  },

  {
    field: "cumulative_layout_shift",
    headerName: "Cumulative Layout Shift (s)",
    minWidth: 250,
    renderCell: (params) => {
      const value = params.value.value;
      return <TableCell value={value} params={params} />;
    },
  },
];

interface TableCellProps {
  value: any;
  params: GridRenderCellParams;
}

export const TableCell: React.FC<TableCellProps> = ({ value, params }) => {
  const field = params.field;

  if (params.value.data === undefined) {
    return (
      <Box display={"flex"} justifyContent={"center"}>
        <Box width={"100%"} height={"100%"} textAlign={"center"}>
          <span>{value}</span>
        </Box>
      </Box>
    );
  }

  const thresholdCategory: {
    label: string;
    color: string;
  } = getThresholdCategory(field, params.value.value);
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Tooltip title={<div>{thresholdCategory?.label}</div>}>
        <Box
          width={"100%"}
          height={"100%"}
          bgcolor={thresholdCategory?.color}
          textAlign={"center"}
        >
          <span>{value}</span>
        </Box>
      </Tooltip>
    </Box>
  );
};
