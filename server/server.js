const express = require("express");
const axios = require("axios");
const errorHandler = require("./errorhandler");
const path = require("path"); // Import path for serving static files
const cors = require("cors");

// Use CORS middleware
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const apiKey = process.env.CRUX_API_KEY; // Securely access your API key
app.use(errorHandler);

const endpoint = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${apiKey}`;

// Endpoint to fetch CrUX data
app.post("/api/crux", async (req, res) => {
  try {
    const urls = req.body.urls;
    if (urls) {
      const response = await sendRequestsInParallel(req.body);
      res.json(response);
    } else {
      res.status(400).json({
        status: 400,
        message: "Bad Request, Please provide a URL",
      });
    }
  } catch (error) {
    console.error(`Error fetching CrUX data: ${error.response}`, {
      url: req.body.urls,
      stack: error.stack,
    });
    res.status(500).json(error.response.data);
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/dist")));

// The "catchall" handler: for any request that doesn't match one above,
// send back the React app.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const sendRequestsInParallel = async (payload) => {
  const urls = payload.urls || [];
  const filters = payload.filters || {};
  const requests = urls.map((url) =>
    axios.post(endpoint, {
      url,
      ...filters,
    })
  );

  const results = await Promise.allSettled(requests);

  // Structure the result object
  const resultObject = {
    success: [],
    error: [],
  };

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      resultObject.success.push({
        url: urls[index],
        data: result.value.data,
      });
    } else {
      resultObject.error.push({
        url: urls[index],
        error: result.reason.response.data,
      });
    }
  });

  return { data: resultObject };
};
