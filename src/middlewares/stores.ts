import { NextFunction, Request, Response } from 'express';

export function validateCreateInputs (req: Request, res: Response, next: NextFunction) {
  try {
    const { name, tel, address } = req.params;

    if (name && tel && address) {
      next();
    } else {
      throw new Error('Malformed store post document');
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
}