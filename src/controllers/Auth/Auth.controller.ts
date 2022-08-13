import { asyncHandler } from '../../middleware/async.middleware';
import ErrorResponse from '../../utils/ErrorResponse';
import { User, UserModel } from '../../models/User/User';
import { HydratedDocument, Model, Schema } from 'mongoose';

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

  // User is matched??
  const isMatched = await user.matchPassword(password);

  if (!isMatched) return next(new ErrorResponse('Invalid credentials', 401));
  // Create token
  const token = user.signAndReturnJwtToken();
  res.status(200).json({ success: true, token });
});
