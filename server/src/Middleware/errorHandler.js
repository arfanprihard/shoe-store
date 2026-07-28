import { sendError } from '../Utils/response.helper.js';

export const errorHandler = (err, req, res, next) => {
  console.error('❌', err.stack || err.message);
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'development' ? err.message : 'Terjadi kesalahan server';
  return sendError(res, message, err, status);
};
