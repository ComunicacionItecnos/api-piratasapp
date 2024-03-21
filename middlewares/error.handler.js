const mongoErrorHandler = (err, req, res, next) => {
  const { stack, message } = err;
  const splitStack = stack.split(':');
  if (splitStack[0] === 'MongoServerError') {
    res.status(400).json({
      message: message,
    });
  }

  next(err);
};

const boomErrorHandler = (err, req, res, next) => {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }
  next(err);
};

const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    // stack: err.stack,
  });
};

module.exports = { errorHandler, mongoErrorHandler, boomErrorHandler };
