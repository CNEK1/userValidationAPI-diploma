import { injectable, inject } from "inversify";
import { IConfigInterface } from "../config/config.service.interface";
import { TYPES } from "../types";
import { ITransactionService } from "./transaction.service.interface";
import { TransactionModel, UserModel } from "@prisma/client";
import { ITransactionsRepository } from "./transactions.repository,interface";
import { Transaction } from "./transaction.entity";
import { TransactionCreateDto } from "./dto/transaction-create.dto";
import { IUsersRepository } from "../users/users.interface.repository";
import { ILogger } from "../logger/logger.interface";

@injectable()
export class TransactionService implements ITransactionService {
  constructor(
    @inject(TYPES.TransactionRepository)
    private transactionRepository: ITransactionsRepository,
    @inject(TYPES.ILogger) private logger: ILogger
  ) {}
  async createTransaction({
    senderId,
    receiverId,
    amount,
    status,
  }: TransactionCreateDto): Promise<TransactionModel | null> {
    const newTransaction = new Transaction(
      senderId,
      receiverId,
      amount,
      status
    );
    // await this.usersRepository.addBalance(receiverId, amount);
    // await this.usersRepository.subtractBalance(senderId, amount);
    return this.transactionRepository.create(newTransaction);
  }
  async getTransaction(id: number): Promise<TransactionModel | null> {
    return await this.transactionRepository.getById(id);
  }
  async getTransactions(): Promise<Array<TransactionModel> | null> {
    return await this.transactionRepository.getAll();
  }
  async updateTransaction(
    id: number,
    status: string
  ): Promise<TransactionModel | null> {
    return await this.transactionRepository.update(id, status);
  }
  async deleteTransaction(id: number): Promise<TransactionModel | null> {
    return await this.transactionRepository.delete(id);
  }
  async getTransactionsByUserSend(
    userId: number
  ): Promise<Array<TransactionModel> | null> {
    return await this.transactionRepository.getAllTypeByIdSend(userId);
  }
  async getTransactionsByUserReceive(
    receiverId: number
  ): Promise<Array<TransactionModel> | null> {
    return await this.transactionRepository.getAllTypeByIdReceive(receiverId);
  }
}
