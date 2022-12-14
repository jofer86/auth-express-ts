import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import morgan from 'morgan';
import { connectDB } from './config/db.config';
import { Application, Request, Response, NextFunction } from 'express';
import { errorHandler } from './middleware/error.middleware';
import AuthRoutes from './controllers/Auth/Auth.routes';
import 'colors';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
const xss = require('xss-clean');
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import { DataSource } from 'typeorm';
import { User } from './models/User/User';

const myDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'jorge',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: true,
  logging: false
});

myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })




// Env vars
dotenv.config({ path: path.resolve(__dirname, './config/config.env') });
// Routes
// connectDB();

const app: Application = express();
app.use(express.json());
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// app.use(mongoSanitize());
// Add security headers
app.use(helmet());
// Prevent XSS attacks
app.use(xss());
// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);
// Prevent http param pollution
app.use(hpp());
// Enable CORS
app.use(cors());

// Routes
// app.use('/api/v1/auth', AuthRoutes);
// app.use(errorHandler);

const PORT = process.env.PORT || 5050;

const server = app.listen(PORT, (): void =>
  console.log(
    `Server running in ${`${process.env.NODE_ENV}`.toUpperCase().magenta} ${`mode on port:`.cyan} ${
      `${PORT}`.green
    }`.cyan
  )
);

process.on('unhandledRejection', (err: any) => {
  console.log(`Error: ${err.message}`);
  // Close server exit process
  server.close(() => process.exit(1));
});
