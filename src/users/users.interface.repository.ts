import { User } from "./user.entity";
import { UserModel, TransactionModel } from "@prisma/client";

export interface IUsersRepository {
  create: (user: User) => Promise<UserModel>;
  find: (email: string) => Promise<UserModel | null>;
  findOne: (id: number) => Promise<UserModel | null>;
  findAll: () => Promise<Array<UserModel> | null>;
  delete: (id: number) => Promise<UserModel | null>;
  update: (
    id: number,
    email?: string,
    firstName?: string,
    secondName?: string,
    number?: string,
    roles?: string
  ) => Promise<UserModel | null>;
  addBalance: (id: number, amount: number) => Promise<UserModel | null>;
  subtractBalance: (id: number, amount: number) => Promise<UserModel | null>;
  // addCard: (id: number, card: string) => Promise<UserModel | null>;
  // removeCard: (id: number, card: string) => Promise<UserModel | null>;
  getSentTransactions: (id: number) => Promise<Array<TransactionModel> | null>;
  getReceivedTransactions: (
    id: number
  ) => Promise<Array<TransactionModel> | null>;
}
