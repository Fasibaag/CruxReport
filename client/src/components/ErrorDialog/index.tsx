import { Alert, Box } from "@mui/material";

interface CustomAlertProps {
  message: string;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({ message }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Alert severity={"error"} sx={{ mt: 2, width: "100%", maxWidth: 600 }}>
        There was an error fetching the data from the provided URL. Please check
        the URL and try again. Error: {message}
      </Alert>
    </Box>
  );
};
