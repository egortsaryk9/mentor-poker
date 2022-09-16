const AppError = require('./../AppError');

class FailedDependencyError extends AppError {
  constructor(message) {
    super(message, 424);
  }
}


module.exports = FailedDependencyError;