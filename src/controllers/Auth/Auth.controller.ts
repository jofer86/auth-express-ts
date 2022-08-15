import { asyncHandler } from '../../middleware/async.middleware';
import ErrorResponse from '../../utils/ErrorResponse';
import { User, UserModel } from '../../models/User/User';
import { Response } from 'express';
import { JWT_COOKIE_EXPIRE, NODE_ENV } from '../../config/env-varialbes';

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role
  });
  // Create token
  const token = user.signAndReturnJwtToken();
  res.status(200).json({ success: true, token });
});

export const users = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, data: users });
});

// @desc    Register user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new ErrorResponse('Invalid credentials', 401));

  const isMatched = await user.matchPassword(password);
  if (!isMatched) return next(new ErrorResponse('Invalid credentials', 401));

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user: UserModel, statusCode: number, res: Response) => {
  const token = user.signAndReturnJwtToken();
  const daysToExpire = 30 * 24 * 60 * 60 * 1000;

  const options = {
    expires: new Date(Date.now() + daysToExpire),
    httpOnly: true,
    secure: NODE_ENV === 'production'
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token
  });
};
