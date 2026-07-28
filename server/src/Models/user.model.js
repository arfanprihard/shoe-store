import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../Utils/password.js';
import { generateToken } from '../Utils/jwt.js';

// ─── Formatter ───────────────────────────────────────────────────
const formatUser = (u) => ({
  id: u.id,
  email: u.email,
  firstName: u.firstName,
  lastName: u.lastName,
  phone: u.phone ?? null,
  avatar: u.avatar ?? null,
  role: u.role,
  createdAt: u.createdAt,
});

// ─── Queries ─────────────────────────────────────────────────────

/**
 * Find a user by email.
 * @param {string} email
 */
const findUserByEmail = (email) =>
  prisma.user.findUnique({ where: { email } });

/**
 * Find a user by primary key.
 * @param {number} id
 */
const findUserById = (id) =>
  prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true, role: true, createdAt: true },
  });

/**
 * Register a new user. Returns { user, token }.
 * @param {{ email: string, password: string, firstName: string, lastName: string, phone?: string }} data
 */
const createUser = async ({ email, password, firstName, lastName, phone }) => {
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashed, firstName, lastName, phone },
    select: { id: true, email: true, firstName: true, lastName: true },
  });
  const token = generateToken(user.id);
  return { user, token };
};

/**
 * Verify credentials and return { user, token } or throw.
 * @param {string} email
 * @param {string} password
 */
const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user || !(await comparePassword(password, user.password))) return null;
  const token = generateToken(user.id);
  return {
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    token,
  };
};

/**
 * Update allowed profile fields for the given user.
 * @param {number} id
 * @param {object} data
 */
const updateUser = (id, data) =>
  prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, firstName: true, lastName: true, phone: true },
  });

export default {
  formatUser,
  findUserByEmail,
  findUserById,
  createUser,
  authenticateUser,
  updateUser,
};
