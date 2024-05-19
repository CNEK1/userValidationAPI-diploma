import { TransactionModel } from "@prisma/client";
import { TransactionCreateDto } from "./dto/transaction-create.dto";
export interface ITransactionService {
  createTransaction: (
    dto: TransactionCreateDto
  ) => Promise<TransactionModel | null>;
  getTransaction: (id: number) => Promise<TransactionModel | null>;
  getTransactions: () => Promise<Array<TransactionModel> | null>;
  updateTransaction: (
    id: number,
    status: string
  ) => Promise<TransactionModel | null>;
  deleteTransaction: (id: number) => Promise<TransactionModel | null>;
  getTransactionsByUserSend: (
    userId: number
  ) => Promise<Array<TransactionModel> | null>;
  getTransactionsByUserReceive: (
    receiverId: number
  ) => Promise<Array<TransactionModel> | null>;
}
