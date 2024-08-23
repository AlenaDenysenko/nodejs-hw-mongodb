import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer' || !token) {
    console.log('Authorization header missing or malformed');
    return next(createHttpError(401, 'Not authorized'));
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.log('Token verification failed:', error.message);
    return next(createHttpError(401, 'Access token expired'));
  }

  const session = await Session.findOne({ accessToken: token });
  if (!session) {
    console.log('Session not found for token:', token);
    return next(createHttpError(401, 'Session not found'));
  }

  const user = await User.findById(payload.id);
  if (!user) {
    console.log('User not found with ID:', payload.id);
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;
  next();
};

export default authenticate;

