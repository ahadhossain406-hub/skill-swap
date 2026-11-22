// async route-e error hole oita error handler-e pathay (server crash kore na).
export const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);