// errorHandler.js
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500; // Default to 500 if no status code is provided
  const message = err.message || "Internal Server Error";

  // Log the error for debugging purposes (optional)
  console.error(err);

  res.json({
    status: "error",
    statusCode: statusCode,
    message: "Internal Server Error",
  });
}

module.exports = errorHandler;
