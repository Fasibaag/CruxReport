import axios from "axios";
import { useState } from "react";

export const useFetchReport = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const [error, setError] = useState<any>(null);

  const fetchCrUXData = async (urls: string[], formFactor: any) => {
    setLoading(true);
    try {
      const responses = await axios.post("/api/crux", {
        urls: urls, // Or use `url` if querying specific pages
        filters: {
          formFactor: formFactor,
        },
      });

      setData(responses.data.data);
    } catch (error: any) {
      // console.error("Error fetching CrUX data:", error);
      setError(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return [loading, data, error, fetchCrUXData];
};
