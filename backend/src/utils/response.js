/**
 * Standardized API response helper
 */

const sendResponse = (res, statusCode, success, message, data = null, meta = null) => {
  const response = {
    success,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

// Success responses
const success = (res, message = 'Success', data = null, meta = null) => {
  return sendResponse(res, 200, true, message, data, meta);
};

const created = (res, message = 'Created successfully', data = null) => {
  return sendResponse(res, 201, true, message, data);
};

// Error responses
const badRequest = (res, message = 'Bad request', errors = null) => {
  return sendResponse(res, 400, false, message, errors);
};

const unauthorized = (res, message = 'Unauthorized') => {
  return sendResponse(res, 401, false, message);
};

const forbidden = (res, message = 'Forbidden') => {
  return sendResponse(res, 403, false, message);
};

const notFound = (res, message = 'Not found') => {
  return sendResponse(res, 404, false, message);
};

const conflict = (res, message = 'Conflict') => {
  return sendResponse(res, 409, false, message);
};

const serverError = (res, message = 'Internal server error') => {
  return sendResponse(res, 500, false, message);
};

// Pagination helper
const paginate = (page = 1, limit = 10) => {
  const pageInt = parseInt(page) || 1;
  const limitInt = parseInt(limit) || 10;
  const offset = (pageInt - 1) * limitInt;
  return {
    skip: offset,
    take: limitInt
  };
};

const paginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

module.exports = {
  success,
  created,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  serverError,
  paginate,
  paginationMeta
};
