import { sendError } from '../Utils/response.helper.js';

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return sendError(res, 'Akses ditolak. Hanya admin yang bisa mengakses.', null, 403);
  }
  next();
};
