import { NextFunction } from 'express';
import { HydratedDocument, model } from 'mongoose';
import { UserSchema } from './User.schema';
import bcrypt from 'bcryptjs';

export interface UserModel {
  name: string;
  email: string;
  role: string;
  password: string;
  resetPassWordToken: string;
  resetPassWordExpires: Date;
  createdAt: Date;
}

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user'
}

UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const User = model<UserModel>('User', UserSchema);
