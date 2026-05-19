export const success = (res, data, meta = null, status = 200) => {
  const response = { success: true, data };
  if (meta) response.meta = meta;
  return res.status(status).json(response);
};

export const error = (res, message, status = 400, code = 'ERROR', details = null) => {
  const response = { success: false, error: { code, message } };
  if (details) response.error.details = details;
  return res.status(status).json(response);
};

export const paginate = (page = 1, limit = 12) => {
  const p = Math.max(1, parseInt(page));
  const l = Math.min(50, Math.max(1, parseInt(limit)));
  return { skip: (p - 1) * l, take: l, page: p, limit: l };
};
