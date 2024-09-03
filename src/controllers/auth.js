import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { sendEmail } from '../config/email.js';

const register = async (req, res) => {
  const { name, email, password } = req.body;

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

  res.status(201).json({
    status: 'success',
    message: 'Successfully registered a user!',
    data: {
      user: {
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

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

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({
    status: 'success',
    message: 'Successfully logged in an user!',
    data: {
      accessToken,
    },
  });
};

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;

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

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({
    status: 'success',
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: newAccessToken,
    },
  });
};

const logout = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not provided');
  }

  const session = await Session.findOneAndDelete({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  res.clearCookie('refreshToken');

  res.status(204).send();
};

const sendResetEmail = async (req, res, next) => {
  const { email } = req.body;

  console.log('Received request to send reset email for:', email);

  const user = await User.findOne({ email });
  if (!user) {
    console.log('User not found:', email);
    return next(createHttpError(404, 'User not found!'));
  }

  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;

  console.log('Generated reset link:', resetLink);

  try {
    await sendEmail(email, 'Reset Password', `<p>Click <a href="${resetLink}">here</a> to reset your password</a></p>`);
    console.log('Email sent successfully to:', email);
    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return next(createHttpError(500, 'Failed to send the email, please try again later.'));
  }
};

const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Error verifying token:', error);
    return next(createHttpError(401, 'Token is expired or invalid.'));
  }

  const user = await User.findOne({ email: payload.email });
  if (!user) {
    return next(createHttpError(404, 'User not found!'));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  await Session.deleteMany({ userId: user._id });

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

export const wrappedRegister = ctrlWrapper(register);
export const wrappedLogin = ctrlWrapper(login);
export const wrappedRefresh = ctrlWrapper(refresh);
export const wrappedLogout = ctrlWrapper(logout);
export const wrappedSendResetEmail = ctrlWrapper(sendResetEmail);
export const wrappedResetPassword = ctrlWrapper(resetPassword);



