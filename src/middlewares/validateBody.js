import createHttpError from 'http-errors';

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.validate(req.body);
  if (result.error) {
    throw createHttpError(400, result.error.details[0].message);
  }
  next();
};
