const jwt = require('jsonwebtoken');
import dotenv from 'dotenv';
import path from 'path';
import { asyncHandler } from './async.middleware';
import ErrorResponse from '../utils/ErrorResponse';
import { User, UserModel } from '../models/User/User';
import { NextFunction, Request, Response } from 'express';
import { JWT_SECRET } from '../config/env-varialbes';

export let proctect = asyncHandler(async (req: any, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    // Set token from cookie
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const verified = jwt.verify(token, JWT_SECRET);

    req.user = await User.findById(verified.id);
    next();
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
export const authorize = (...roles: any) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403)
      );
    }
    next();
  };
};
