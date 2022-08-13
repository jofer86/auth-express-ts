import mongoose, { Connection, ConnectOptions, Error, Mongoose } from 'mongoose';

export const connectDB = async (): Promise<void> => {
  let dbKey = process.env.MONGO_URI;
  try {
    const connect: Mongoose = await mongoose.connect(`${dbKey}`);
    console.log(`MongoDB connected on: ${connect.connection.host}`.magenta);
  } catch (err: any) {
    console.error(err.message);
  }
};
