import { verifyToken } from '../Utils/jwt.js';
import prisma from '../config/database.js';
import { sendError } from '../Utils/response.helper.js';

export const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return sendError(res, 'Token tidak ditemukan', null, 401);

    const decoded = verifyToken(header.split(' ')[1]);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, email: true, firstName: true, lastName: true, role: true } });
    if (!user) return sendError(res, 'User tidak ditemukan', null, 401);

    req.user = user;
    next();
  } catch {
    return sendError(res, 'Token tidak valid', null, 401);
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
