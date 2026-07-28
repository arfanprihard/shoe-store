export const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, message, error = null, statusCode = 500) => {
  if (error) {
    console.error("sendError received error:", error);
  }
  const response = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === "development" && error) {
    response.serverMessage = error.message || error;
  }

  return res.status(statusCode).json(response);
};

export const paginate = (page = 1, limit = 12) => {
  const p = Math.max(1, parseInt(page));
  const l = Math.min(50, Math.max(1, parseInt(limit)));
  return { skip: (p - 1) * l, take: l, page: p, limit: l };
};
