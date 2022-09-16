const AppError = require('./AppError');
const BadRequestError = require('./http/BadRequestError');
const NotFoundError = require('./http/NotFoundError');
const ConflictError = require('./http/ConflictError');
const ForbiddenError = require('./http/ForbiddenError');
const UnauthorizedError = require('./http/UnauthorizedError');
const FailedDependencyError = require('./http/FailedDependencyError');


module.exports = {
  AppError,
  BadRequestError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
  FailedDependencyError
}