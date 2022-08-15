import { NextFunction } from 'express';
import crypto from 'crypto';
import { HydratedDocument, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { Schema } from 'mongoose';
import { JWT_EXPIRE, JWT_SECRET } from '../../config/env-varialbes';
const colors = require('colors');

export interface UserModel {
  name: string;
  email: string;
  role: string;
  password: string;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: Date | undefined;
  createdAt: Date;
  signAndReturnJwtToken: () => string;
  getResetPasswordToken: () => Promise<string>;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user'
}

let secret: Secret = JWT_SECRET as string;
export const UserSchema = new Schema<UserModel>(
  {
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
      enum: [UserRoles.ADMIN, UserRoles.USER],
      default: UserRoles.USER
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    methods: {
      signAndReturnJwtToken(): string {
        return jwt.sign({ id: this._id }, secret, {
          expiresIn: JWT_EXPIRE || '7d'
        });
      },
      async matchPassword(enteredPassword): Promise<boolean> {
        return await bcrypt.compare(enteredPassword, this.password);
      },
      getResetPasswordToken(): string {
        const resetToken = crypto.randomBytes(20).toString('hex');
        this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        this.resetPasswordExpire = (Date.now() + 10 * 60 * 1000) as any;

        return resetToken;
      }
    }
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const User = model<UserModel>('User', UserSchema);
