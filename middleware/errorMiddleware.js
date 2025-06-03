const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(err.stack);

  // Set default status code
  const statusCode = err.statusCode || 500;

  // Prepare error response
  const errorResponse = {
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };

  // Handle specific error types
  if (err.name === "ValidationError") {
    errorResponse.statusCode = 400;
    errorResponse.message = "Validation Error";
    errorResponse.errors = Object.values(err.errors).map((val) => val.message);
  }

  if (err.code === 11000) {
    errorResponse.statusCode = 400;
    errorResponse.message = "Duplicate field value entered";
    errorResponse.field = Object.keys(err.keyPattern)[0];
  }

  if (err.name === "JsonWebTokenError") {
    errorResponse.statusCode = 401;
    errorResponse.message = "Invalid token";
    errorResponse.error = "Please log in again";
  }

  if (err.name === "TokenExpiredError") {
    errorResponse.statusCode = 401;
    errorResponse.message = "Token expired";
    errorResponse.error = "Please log in again";
  }

  // Send JSON response
  res.status(errorResponse.statusCode || statusCode).json(errorResponse);
};

module.exports = errorHandler;
