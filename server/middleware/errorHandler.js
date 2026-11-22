// Kono URL-e na mile ei function chole.
export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Shob error ekhane ashe. Express bujhe je 4-ta parameter thakle eta error handler.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body.' });
  }

  // MySQL: unique column-e duplicate (jemon same email).
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'This record already exists.' });
  }

  const status = err.statusCode || 500;
  if (status === 500) console.error(err);

  res.status(status).json({
    message: status === 500 ? 'Something went wrong on the server.' : err.message,
  });
}