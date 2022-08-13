import { NextFunction } from 'express';
import { HydratedDocument, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { Schema } from 'mongoose';
const colors = require('colors');

export interface UserModel {
  name: string;
  email: string;
  role: string;
  password: string;
  resetPassWordToken: string;
  resetPassWordExpires: Date;
  createdAt: Date;
  signAndReturnJwtToken: () => string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user'
}

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
      minlength: [6, 'Password must be at least 6 characters']
    },
    resetPassWordToken: String,
    resetPassWordExpires: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    methods: {
      signAndReturnJwtToken(): string {
        return jwt.sign({ id: this._id }, secret, {
          expiresIn: process.env.JWT_EXPIRE || '7d'
        });
      },
      async matchPassword(enteredPassword): Promise<boolean> {
        return await bcrypt.compare(enteredPassword, this.password);
      }
    }
  }
);

UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

let secret: Secret = process.env.JWT_SECRET || 'secret';

export const User = model<UserModel>('User', UserSchema);
