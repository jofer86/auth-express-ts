import { Request, Response, NextFunction } from 'express';
interface NewRequest extends Request {
  user?: any;
}

type AsyncHandler = (req: NewRequest, res: Response, next: NextFunction) => Promise<void>;

export const asyncHandler = (fn: AsyncHandler) => (req: NewRequest, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);
