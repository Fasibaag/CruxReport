import {
  Autocomplete,
  Button,
  Chip,
  Container,
  Grid2,
  TextField,
} from "@mui/material";
import { ChangeEvent, SyntheticEvent, useState } from "react";

// Regular Expression for URL or Domain Validation
const urlRegex =
  /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+)(\/[a-zA-Z0-9-._~:\/?#[\]@!$&'()*+,;=]*)?$/;

interface DomainAutocompleteProps {
  onChange: (urls: string[]) => void;
}

const DomainAutocomplete: React.FC<DomainAutocompleteProps> = ({
  onChange,
}) => {
  const [urls, setUrls] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string[]>([]);

  // Validate input and only add valid URLs or domains
  const handleChange = (_event: SyntheticEvent, newDomains: string[]) => {
    setUrls(newDomains);
  };

  const validateUrls = (urls: string[]): string[] => {
    return urls.filter((url) => !urlRegex.test(url.trim()));
  };

  const handleInputChange = (_event: SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
    const urls = newInputValue.split(",");
    const invalidUrls = validateUrls(urls);
    setError(invalidUrls);
  };

  const handleOnFocus = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    setUrls([]);
    if (inputValue) {
      setInputValue([...urls, ...inputValue.split(",")].join(","));
    } else {
      setInputValue([...urls].join(","));
    }
  };

  const ensureHttpPrefix = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url; // Append 'https://' if neither is present
    }
    return url;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urls = inputValue
      .split(",")
      .map((url) => ensureHttpPrefix(url.trim()));
    const invalidUrls = validateUrls(urls);

    if (invalidUrls.length > 0) {
      setError(invalidUrls);
      setInputValue(invalidUrls.join(","));
      setUrls(urls.filter((url) => urlRegex.test(url.trim())));
    } else {
      onChange(urls);
      setUrls([...urls.map((url) => url.trim())]);
      setError([]);
      setInputValue("");
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid2
          container
          spacing={4}
          width={"100%"}
          justifyContent={"center"}
          my={4}
        >
          <Grid2 size={{ md: 6 }}>
            <Autocomplete
              multiple
              freeSolo
              options={[]} // No predefined options; only user input
              value={urls}
              onChange={handleChange}
              inputValue={inputValue}
              onInputChange={handleInputChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={index}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter website URLs"
                  error={error.length > 0}
                  helperText={
                    error.length > 0 || inputValue.length === 0
                      ? `Enter Valid URL ${error.join(",")}`
                      : "Enter website URLs by comma separated for more than one"
                  }
                  // onBlur={handleOnBlur} // Add keydown listener for comma or Enter
                  onFocus={handleOnFocus} // Add keydown listener for comma or Enter
                  size="small"
                  required
                />
              )}
              filterSelectedOptions
            />
          </Grid2>

          <Grid2>
            <Button
              size="large"
              variant="contained"
              color="primary"
              type="submit"
              disabled={error.length > 0}
            >
              Get Report
            </Button>
          </Grid2>
        </Grid2>
      </form>
    </Container>
  );
};

export default DomainAutocomplete;
