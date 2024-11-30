const globalError = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const statusText = err.statusText || "Internal Server Error";

  res.status(statusCode).json({
    status: statusText,
    message: err.message,
    statusCode,
    error: err,
    stack: err.stack,
  });
};

export default globalError;
