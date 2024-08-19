const errorHandler = (err, req, res, next) => {
  console.log('Error handler triggered:', err);
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({
    status,
    message,
    data: null,
  });
};

export { errorHandler }; 



