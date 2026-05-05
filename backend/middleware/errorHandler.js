const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);
  
  // In production, never expose internal error details to the client
  if (process.env.NODE_ENV === 'production') {
    res.json({
      message: statusCode === 500
        ? 'An internal server error occurred'
        : err.message,
    });
  } else {
    res.json({
      message: err.message,
      stack: err.stack,
    });
  }
};

module.exports = errorHandler;
