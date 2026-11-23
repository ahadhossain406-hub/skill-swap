// Amader nijer error. Message ar HTTP status code (404, 401...) ekshathe rakhe.
export default class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}