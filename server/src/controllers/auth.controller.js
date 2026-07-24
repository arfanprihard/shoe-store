import prisma from '../config/database.js';
import { success, error } from '../utils/apiResponse.js';
import { generateToken } from '../utils/jwt.js';
import { hashPassword, comparePassword } from '../utils/password.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.validated;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return error(res, 'Email sudah terdaftar', 409, 'DUPLICATE');

    const user = await prisma.user.create({
      data: { email, password: await hashPassword(password), firstName, lastName, phone },
      select: { id: true, email: true, firstName: true, lastName: true },
    });
    const token = generateToken(user.id);
    return success(res, { user, token }, null, 201);
  } catch (e) { next(e); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validated;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await comparePassword(password, user.password)))
      return error(res, 'Email atau password salah', 401, 'INVALID_CREDENTIALS');

    const token = generateToken(user.id);
    return success(res, {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      token,
    });
  } catch (e) { next(e); }
};

export const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true, role: true, createdAt: true },
    });
    return success(res, user);
  } catch (e) { next(e); }
};

export const updateMe = async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: req.validated,
      select: { id: true, email: true, firstName: true, lastName: true, phone: true },
    });
    return success(res, user);
  } catch (e) { next(e); }
};
