
const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!contactId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid ID format',
    });
  }
  next();
};

export default isValidId;

