import { Schema } from 'mongoose';
import { User, UserRoles } from './User';

export const UserSchema = new Schema<User>({
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
      'Please enter a valid email'
    ]
  },
  role: {
    type: String,
    enum: [UserRoles.USER, UserRoles.ADMIN],
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
});
