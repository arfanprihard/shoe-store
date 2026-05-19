import { verifyToken } from '../utils/jwt.js';
import prisma from '../config/database.js';
import { error } from '../utils/apiResponse.js';

export const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return error(res, 'Token tidak ditemukan', 401, 'UNAUTHORIZED');

    const decoded = verifyToken(header.split(' ')[1]);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, email: true, firstName: true, lastName: true, role: true } });
    if (!user) return error(res, 'User tidak ditemukan', 401, 'UNAUTHORIZED');

    req.user = user;
    next();
  } catch {
    return error(res, 'Token tidak valid', 401, 'UNAUTHORIZED');
  }
};

// Optional auth - sets req.user if token present, but doesn't block
export const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      const decoded = verifyToken(header.split(' ')[1]);
      req.user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, email: true, firstName: true, lastName: true, role: true } });
    }
  } catch { /* ignore */ }
  next();
};
