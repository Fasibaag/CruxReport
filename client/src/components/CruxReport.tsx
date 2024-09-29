import Button from "@mui/joy/Button";
import ToggleButtonGroup from "@mui/joy/ToggleButtonGroup";
import { Box, Grid2, Stack } from "@mui/material";
import React, { useCallback } from "react";
import { useFetchReport } from "../hooks/usefetchReport";
import DataGridReport from "./DataGrid/DataGrid";
import { CustomAlert } from "./ErrorDialog";
import SearchInput from "./SearchInput";

export const CruxReport = () => {
  const [loading, data, error, fetchCrUXData] = useFetchReport();
  const inputSearch = React.useRef<string[]>([]);
  const [formfactor, setFormfactor] =
    React.useState<string>("ALL_FORM_FACTORS");

  const onChange = useCallback((value: string[]) => {
    inputSearch.current = value;
    value.length && fetchCrUXData(value, formfactor);
  }, []);

  const onFormfactor = useCallback((value: string) => {
    inputSearch.current && fetchCrUXData(inputSearch.current, value);
  }, []);

  return (
    <Stack my={10}>
      <SearchInput onChange={onChange} />

      <Grid2 container justifyContent={"center"} width={"calc(100%)"}>
        <Grid2
          size={{
            xs: 12,
            md: 6,
            lg: 4,
          }}
          justifyContent={"center"}
        >
          {/* {loading && (
            <Box>
              <Typography variant={"h6"}>Fetching CrUX Data...</Typography>
              <LinearProgress />
            </Box>
          )} */}
        </Grid2>

        <Grid2 width={"100%"} justifyContent={"center"}>
          {error && <CustomAlert message={error.status} />}
        </Grid2>

        <Grid2 width={"80%"} justifyContent={"center"} my={2}>
          <ToggleButtonGroup
            value={formfactor}
            onChange={(_event, newValue) => {
              newValue && setFormfactor(newValue);
              newValue && onFormfactor(newValue);
            }}
          >
            <Button value="ALL_FORM_FACTORS">All Device</Button>
            <Button value="PHONE">Mobile</Button>
            <Button value="DESKTOP">Desktop</Button>
          </ToggleButtonGroup>
        </Grid2>

        {!error && (
          <Box width={"80%"}>
            <DataGridReport data={data.success} loading={loading} />
          </Box>
        )}
      </Grid2>
    </Stack>
  );
};
