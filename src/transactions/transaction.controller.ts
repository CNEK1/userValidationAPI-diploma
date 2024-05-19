import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errors/http-error.class";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import "reflect-metadata";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ITransactionController } from "./transaction.interface";
import { ITransactionService } from "./transaction.service.interface";
import { IUsersRepository } from "../users/users.interface.repository";
import { TransactionCreateDto } from "./dto/transaction-create.dto";
import { ValidateMiddleware } from "../common/validate.middleware";
@injectable()
export class TransactionController
  extends BaseController
  implements ITransactionController
{
  constructor(
    @inject(TYPES.ILogger) private loggerSrc: ILogger,
    @inject(TYPES.TransactionService)
    private transactionService: ITransactionService,
    @inject(TYPES.UserRepository) private usersRepository: IUsersRepository
  ) {
    super(loggerSrc);
    this.bindRoutes([
      {
        path: "/createTransaction",
        method: "post",
        func: this.create,
        middlewares: [new ValidateMiddleware(TransactionCreateDto)],
      },
    ]);
    this.bindRoutes([
      {
        path: "/getTransaction/:id",
        method: "get",
        func: this.getById,
        middlewares: [],
      },
    ]);
    this.bindRoutes([
      {
        path: "/getTransactions",
        method: "get",
        func: this.getAll,
        middlewares: [],
      },
    ]);
    this.bindRoutes([
      {
        path: "/updateTransaction/:id",
        method: "post",
        func: this.update,
        middlewares: [],
      },
    ]);
    this.bindRoutes([
      {
        path: "/deleteTransaction/:id",
        method: "get",
        func: this.delete,
        middlewares: [],
      },
    ]);
    this.bindRoutes([
      {
        path: "/getTransactionsByUserSend/:id",
        method: "get",
        func: this.getByUserIdSend,
        middlewares: [],
      },
    ]);
    this.bindRoutes([
      {
        path: "/getTransactionsByUserReceive/:id",
        method: "get",
        func: this.getByUserIdReceive,
        middlewares: [],
      },
    ]);
  }
  async create(
    { body }: Request<{}, {}>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const sender = await this.usersRepository.findOne(body.senderId);
    const receiver = await this.usersRepository.findOne(body.receiverId);

    if (!sender || !receiver) {
      return next(new HTTPError(422, "User not found"));
    }

    if (sender.balance < body.amount) {
      return next(new HTTPError(422, "Insufficient balance"));
    }
    if (sender.id === receiver.id) {
      return next(new HTTPError(422, "Incorect sender id"));
    }
    const result = await this.transactionService.createTransaction({
      senderId: sender.id,
      receiverId: receiver.id,
      amount: body.amount,
      status: "ok",
    });
    await this.usersRepository.addBalance(receiver.id, body.amount);
    await this.usersRepository.subtractBalance(sender.id, body.amount);
    if (!result) {
      return next(new HTTPError(422, "Cannot create transaction"));
    }
    this.loggerSrc.log(body);
    this.ok(res, {
      msg: "transaction Succeseful",
    });
  }

  async getById(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const transaction = await this.transactionService.getTransaction(id);
      if (!transaction) {
        return next(
          new HTTPError(404, "Transaction not found", "getTransaction")
        );
      }
      res.status(200).json(transaction);
    } catch (error: any) {
      return next(new HTTPError(500, error.message, "getTransaction"));
    }
  }
  async getAll(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const transactions = await this.transactionService.getTransactions();
      if (!transactions) {
        return next(
          new HTTPError(404, "Transactions not found", "getTransactions")
        );
      }
      res.status(200).json(transactions);
    } catch (error: any) {
      return next(new HTTPError(500, error.message, "getTransactions"));
    }
  }
  async update(
    req: Request<ParamsDictionary, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      const transaction = await this.transactionService.updateTransaction(
        id,
        status as string
      );
      if (!transaction) {
        return next(
          new HTTPError(404, "Transaction not found", "updateTransaction")
        );
      }
      res.status(200).json(transaction);
    } catch (error: any) {
      return next(new HTTPError(500, error.message, "updateTransaction"));
    }
  }
  async delete(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const transaction = await this.transactionService.deleteTransaction(id);
      if (!transaction) {
        return next(
          new HTTPError(404, "Transaction not found", "deleteTransaction")
        );
      }
      res.status(200).json(transaction);
    } catch (error: any) {
      return next(new HTTPError(500, error.message, "deleteTransaction"));
    }
  }
  async getByUserIdSend(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const transactions =
        await this.transactionService.getTransactionsByUserSend(id);
      if (!transactions) {
        return next(
          new HTTPError(404, "Transactions not found", "getTransactionsByUser")
        );
      }
      res.status(200).json(transactions);
    } catch (error: any) {
      return next(new HTTPError(500, error.message, "getTransactionsByUser"));
    }
  }
  async getByUserIdReceive(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const transactions =
        await this.transactionService.getTransactionsByUserReceive(id);
      if (!transactions) {
        return next(
          new HTTPError(404, "Transactions not found", "getTransactionsByUser")
        );
      }
      res.status(200).json(transactions);
    } catch (error: any) {
      return next(new HTTPError(500, error.message, "getTransactionsByUser"));
    }
  }
}
