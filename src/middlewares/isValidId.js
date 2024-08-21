import createError from 'http-errors';

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  console.log('Received contactId:', contactId); // Лог ID, який отримано
  
  if (!contactId.match(/^[0-9a-fA-F]{24}$/)) {
    console.log('Invalid ID format:', contactId); // Лог при невірному форматі
    return next(createError(400, 'Invalid ID format'));
  }
  
  next();
};

export default isValidId;



