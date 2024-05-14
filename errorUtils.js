// utils/errorUtils.js
exports.handleError = (err, message = 'Something went wrong', statusCode = 500) => {
    let error = { message, statusCode };
  
    if (err) {
      if (err.name === 'ValidationError') {
        // Handle Mongoose validation errors
        error.message = Object.values(err.errors)
          .map((val) => val.message)
          .join(', ');
        error.statusCode = 400;
      } else if (err.name === 'CastError') {
        // Handle Mongoose cast errors (e.g., invalid ObjectId)
        error.message = `Invalid ${err.path}: ${err.value}`;
        error.statusCode = 400;
      } else if (err.code === 11000) {
        // Handle duplicate key errors (e.g., unique constraint violation)
        error.message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        error.statusCode = 400;
      } else {
        // Handle other errors
        error.message = err.message || 'Something went wrong';
        error.statusCode = err.statusCode || 500;
      }
    }
  
    return error;
  };