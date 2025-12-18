const { validationResult } = require('express-validator');
const { ZodError } = require('zod');
const { badRequest } = require('../utils/response');

/**
 * Validate express-validator results
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    
    return badRequest(res, 'Validasi gagal', formattedErrors);
  }
  
  next();
};

/**
 * Validate request with Zod schema
 * @param {import('zod').ZodSchema} schema - Zod schema
 * @param {string} source - 'body' | 'query' | 'params'
 */
const validateZod = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const data = req[source];
      const result = schema.parse(data);
      req[source] = result; // Replace with parsed/transformed data
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return badRequest(res, 'Validasi gagal', formattedErrors);
      }
      next(error);
    }
  };
};

module.exports = { validateRequest, validateZod };
