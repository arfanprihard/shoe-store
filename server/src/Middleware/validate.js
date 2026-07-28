import { sendError } from '../Utils/response.helper.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const messages = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    return sendError(res, 'Validasi gagal: ' + messages, null, 400);
  }
  req.validated = result.data;
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    return sendError(res, 'Parameter tidak valid', null, 400);
  }
  req.validatedQuery = result.data;
  next();
};
