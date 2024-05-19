import { injectable, inject } from "inversify";
import { PrismaService } from "../database/prisma.service";
import { TYPES } from "../types";
import { ITransactionsRepository } from "./transactions.repository,interface";
import { TransactionModel } from "@prisma/client";
import { Transaction } from "./transaction.entity";

@injectable()
export class TransactionsRepository implements ITransactionsRepository {
  constructor(
    @inject(TYPES.PrismaService) private prismaService: PrismaService
  ) {}

  async create({
    senderId,
    receiverId,
    amount,
    status,
  }: Transaction): Promise<TransactionModel> {
    return this.prismaService.client.transactionModel.create({
      data: {
        sender: {
          connect: { id: senderId },
        },
        receiver: {
          connect: { id: receiverId },
        },
        amount: amount,
        status: status,
      },
    });
  }
  async getById(id: number): Promise<TransactionModel | null> {
    return this.prismaService.client.transactionModel.findFirst({
      where: {
        id,
      },
    });
  }
  async getAll(): Promise<Array<TransactionModel> | null> {
    return this.prismaService.client.transactionModel.findMany({ where: {} });
  }
  async update(id: number, status: string): Promise<TransactionModel | null> {
    return this.prismaService.client.transactionModel.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }
  async delete(id: number): Promise<TransactionModel | null> {
    return this.prismaService.client.transactionModel.delete({
      where: {
        id,
      },
    });
  }
  async getAllTypeByIdSend(
    userId: number
  ): Promise<Array<TransactionModel> | null> {
    return this.prismaService.client.transactionModel.findMany({
      where: {
        senderId: userId,
      },
    });
  }

  async getAllTypeByIdReceive(
    userId: number
  ): Promise<Array<TransactionModel> | null> {
    return this.prismaService.client.transactionModel.findMany({
      where: {
        receiverId: userId,
      },
    });
  }
}
