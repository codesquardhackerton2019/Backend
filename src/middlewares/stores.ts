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
    error.status = 400;
    next(error);
  }
}

export function validateGetInputs (req: Request, res: Response, next: NextFunction) {
  try {
    const size = req.query.size;
    if (size && isNaN(parseInt(size, 10))) throw new Error();

    req.query.size = size ? parseInt(size, 10) : undefined;
    next();
  } catch (error) {
    error.status = 400;
    next(error);
  }
}
