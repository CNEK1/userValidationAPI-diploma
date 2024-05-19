import { TransactionModel, UserModel } from "@prisma/client";
import { Transaction } from "./transaction.entity";
export interface ITransactionsRepository {
  create: (transaction: Transaction) => Promise<TransactionModel>;
  getById: (id: number) => Promise<TransactionModel | null>;
  getAll: () => Promise<Array<TransactionModel> | null>;
  update: (id: number, status: string) => Promise<TransactionModel | null>;
  delete: (id: number) => Promise<TransactionModel | null>;
  getAllTypeByIdSend: (
    userId: number
  ) => Promise<Array<TransactionModel> | null>;
  getAllTypeByIdReceive: (
    receiverId: number
  ) => Promise<Array<TransactionModel> | null>;
}
