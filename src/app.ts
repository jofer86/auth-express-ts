import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import colors from 'colors';
import morgan from 'morgan';
import { connectDB } from './config/db.config';
import { Application, Request, Response, NextFunction } from 'express';
import { errorHandler } from './middleware/error.middleware';

// Env vars
dotenv.config({ path: './config/config.env' });
// Routes
connectDB();

const app: Application = express();
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
// app.use('/api/v1/users', users);
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

const server = app.listen(PORT, (): void =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`.cyan)
);

process.on('unhandledRejection', (err: any) => {
  console.log(`Error: ${err.message}`.red.bold);
  // Close server exit process
  server.close(() => process.exit(1));
});
