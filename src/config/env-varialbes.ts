import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, './config.env') });

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRE = process.env.JWT_EXPIRE;
export const JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE;
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
export const SMTP_EMAIL = process.env.SMTP_EMAIL;
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
export const FROM_EMAIL = process.env.FROM_EMAIL;
export const FROM_NAME = process.env.FROM_NAME;
