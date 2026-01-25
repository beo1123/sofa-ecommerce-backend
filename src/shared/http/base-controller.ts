import { Request, Response, NextFunction } from 'express';

export abstract class BaseController {
  public handle(fn: (req: Request, res: Response) => Promise<void>) {
    return (req: Request, res: Response, next: NextFunction) => {
      fn(req, res).catch(next);
    };
  }
}
