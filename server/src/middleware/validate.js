import { error } from '../utils/apiResponse.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const messages = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`);
    return error(res, 'Validasi gagal', 400, 'VALIDATION_ERROR', messages);
  }
  req.validated = result.data;
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    return error(res, 'Parameter tidak valid', 400, 'VALIDATION_ERROR');
  }
  req.validatedQuery = result.data;
  next();
};
