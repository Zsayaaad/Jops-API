const CustomAPIError = require('./custom-error');
const UnauthenticatedError = require('./unauth');
const NotFoundError = require('./not-found');
const BadRequestError = require('./bad-req');

module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
};
