import { body, validationResult } from 'express-validator';

const contactSchema = [
  body('name').isString().isLength({ min: 3, max: 20 }).withMessage('Name must be between 3 and 20 characters'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('phoneNumber').isString().isLength({ min: 3, max: 20 }).withMessage('Phone number must be between 3 and 20 characters'),
  body('isFavourite').optional().isBoolean().withMessage('isFavourite must be a boolean'),
  body('contactType').isString().isIn(['work', 'home', 'personal']).withMessage('Invalid contact type'),
  body('photo').optional().isURL().withMessage('Invalid photo URL format'),
];

const validateBody = (schema) => {
  return async (req, res, next) => {
    await Promise.all(schema.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: 'Validation error',
        errors: errors.array(),
      });
    }
    next();
  };
};

export { validateBody, contactSchema };







