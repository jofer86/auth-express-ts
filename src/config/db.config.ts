import mongoose, { Connection, ConnectOptions, Error, Mongoose } from 'mongoose';
import { magenta } from 'colors';

export const connectDB = async (): Promise<void> => {
  let dbKey = process.env.MONGO_URI;
  console.log(dbKey);
  try {
    const connect: Mongoose = await mongoose.connect(`${dbKey}`);
    console.log(`MongoDB connected on: ${connect.connection.host}`);
  } catch (err: any) {
    console.error(err.message);
  }
};
