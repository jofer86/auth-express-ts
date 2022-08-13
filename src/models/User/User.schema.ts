import { NextFunction } from 'express';
import { Schema } from 'mongoose';
import { UserModel, UserRoles } from './User';
const colors = require('colors');

export const UserSchema = new Schema<UserModel>({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/,
      'Please enter a valid email'.red
    ]
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  resetPassWordToken: String,
  resetPassWordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
