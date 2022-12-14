import { asyncHandler } from '../../middleware/async.middleware';
import ErrorResponse from '../../utils/ErrorResponse';
import { User, UserModel } from '../../models/User/User';
import { Response } from 'express';
import { JWT_COOKIE_EXPIRE, JWT_EXPIRE, NODE_ENV } from '../../config/env-varialbes';
import { sendMail } from '../../utils/SendEmail';
import crypto from 'crypto';
import { UserRepository } from '../../models/User/User.repository';
import { MoreThan } from 'typeorm';



// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
   // Create user
  const user = UserRepository.create({
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
  const users = await UserRepository.find();
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

  const user = await UserRepository.findOneByOrFail({ email });
  if (!user) return next(new ErrorResponse('Invalid credentials', 401));

  const isMatched = await user.matchPassword(password);
  if (!isMatched) return next(new ErrorResponse('Invalid credentials', 401));

  sendTokenResponse(user, 200, res);
});

export const getMe = asyncHandler(async (req, res, next) => {
  const user = await UserRepository.findOneBy({ id: req.user.id });
  res.status(200).json({ success: true, data: user });
});

// @desc forgot password
// @route POST /api/v1/auth/forgot-password
// @access Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await UserRepository.findOneBy({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await UserRepository.save(user);

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendMail({
      email: user.email,
      subject: 'Password reset token',
      message
    });
    res.status(200).json({ success: true, data: 'Email Sent' });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await UserRepository.save(user);
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

export const resetPassowrd = asyncHandler(async (req, res, next) => {
  let resetToken: string = req.params.resetToken;
  try {
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const [user] = await UserRepository.find({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: MoreThan(new Date())
      }
    })

    if (!user) {
      return next(new ErrorResponse('Invalid token', 400));
    }

    // Set new password

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await UserRepository.save(user);

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error(err);
    next();
  }
});

export const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true, data: 'Logged out' });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user: User, statusCode: number, res: Response) => {
  const token = user.signAndReturnJwtToken();
  const daysToExpire = parseInt(JWT_COOKIE_EXPIRE as string) * 24 * 60 * 60 * 1000;

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
