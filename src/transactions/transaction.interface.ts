import { NextFunction, Request, Response } from "express";

export interface ITransactionController {
  create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getByUserIdSend: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getByUserIdReceive: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}
