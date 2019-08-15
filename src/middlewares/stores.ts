import { NextFunction, Request, Response } from 'express';
import { isUndefined } from 'util';

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
    if (!isUndefined(size) && isNaN(parseInt(size, 10))) throw new Error();

    req.query.size = parseInt(size, 10);
    next();
  } catch (error) {
    error.status = 400;
    next(error);
  }
}
