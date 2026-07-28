import userModel from '../Models/user.model.js';
import { sendSuccess, sendError } from '../Utils/response.helper.js';

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.validated;
    const exists = await userModel.findUserByEmail(email);
    if (exists) return sendError(res, 'Email sudah terdaftar', null, 409);

    const { user, token } = await userModel.createUser({ email, password, firstName, lastName, phone });
    return sendSuccess(res, 'Registrasi berhasil', { user, token }, 201);
  } catch (e) {
    return sendError(res, 'Gagal melakukan registrasi', e);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.validated;
    const result = await userModel.authenticateUser(email, password);
    if (!result) return sendError(res, 'Email atau password salah', null, 401);
    return sendSuccess(res, 'Login berhasil', result);
  } catch (e) {
    return sendError(res, 'Gagal melakukan login', e);
  }
};

const me = async (req, res) => {
  try {
    const user = await userModel.findUserById(req.user.id);
    return sendSuccess(res, 'Data user berhasil diambil', user);
  } catch (e) {
    return sendError(res, 'Gagal mengambil data user', e);
  }
};

const updateMe = async (req, res) => {
  try {
    const user = await userModel.updateUser(req.user.id, req.validated);
    return sendSuccess(res, 'Profil berhasil diupdate', user);
  } catch (e) {
    return sendError(res, 'Gagal mengupdate profil', e);
  }
};

export default {
  register,
  login,
  me,
  updateMe,
};
