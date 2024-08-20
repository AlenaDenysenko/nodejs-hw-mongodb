const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');
const { User } = require('../models/user');
const { Session } = require('../models/session');

const registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const payload = { id: user._id };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

  await Session.deleteMany({ userId: user._id });
  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + 15 * 60 * 1000, // 15 хвилин
    refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 днів
  });

  return { accessToken, refreshToken };
};

const refreshSession = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not provided');
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const session = await Session.findOneAndDelete({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const newAccessToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
  const newRefreshToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  await Session.create({
    userId: payload.id,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: Date.now() + 15 * 60 * 1000, // 15 хвилин
    refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 днів
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not provided');
  }

  const session = await Session.findOneAndDelete({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser, 
};

