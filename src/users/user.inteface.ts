import { NextFunction, Request, Response } from "express";

export interface IUserController {
  login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  registerByUser: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  registerByAdmin: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  info: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  find: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  addBalance: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  subtractBalance: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  // addCard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  // removeCard: (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => Promise<void>;
  getSentTransactions: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getReceivedTransactions: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}
