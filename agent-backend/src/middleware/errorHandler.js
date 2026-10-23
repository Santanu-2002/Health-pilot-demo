export function notFound(_req, res) { res.status(404).json({ message: 'The requested resource was not found.' }); }
export function errorHandler(error, _req, res, _next) {
  if (error?.code === 11000) return res.status(409).json({ message: 'That record already exists or the selected appointment slot was just taken.' });
  if (error?.name === 'ValidationError') return res.status(400).json({ message: error.message });
  if (error?.name === 'CastError') return res.status(400).json({ message: 'A supplied ID or value is invalid.' });
  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ message: status >= 500 ? 'Something went wrong. Please try again.' : error.message });
}
