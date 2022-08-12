import { model } from 'mongoose';
import { UserSchema } from './User.schema';

export interface User {
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

export const UserModel = model<User>('User', UserSchema);
