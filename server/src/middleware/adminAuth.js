import { error } from '../utils/apiResponse.js';

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return error(res, 'Akses ditolak. Hanya admin yang bisa mengakses.', 403, 'FORBIDDEN');
  }
  next();
};
