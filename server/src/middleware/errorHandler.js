export const errorHandler = (err, req, res, next) => {
  console.error('❌', err.stack || err.message);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Terjadi kesalahan server',
    },
  });
};
