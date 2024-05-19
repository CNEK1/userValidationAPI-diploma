import { UserModel, TransactionModel } from ".prisma/client";
import { inject, injectable } from "inversify";
import { PrismaService } from "../database/prisma.service";
import { TYPES } from "../types";
import { User } from "./user.entity";
import { IUsersRepository } from "./users.interface.repository";

@injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @inject(TYPES.PrismaService) private prismaService: PrismaService
  ) {}

  async create({
    email,
    password,
    firstName,
    secondName,
    number,
    roles,
  }: User): Promise<UserModel> {
    return this.prismaService.client.userModel.create({
      data: {
        email,
        password,
        firstName,
        secondName,
        number,
        roles,
      },
    });
  }
  async find(email: string): Promise<UserModel | null> {
    return this.prismaService.client.userModel.findFirst({
      where: {
        email,
      },
    });
  }
  async findOne(id: number): Promise<UserModel | null> {
    return this.prismaService.client.userModel.findFirst({
      where: {
        id: id,
      },
    });
  }

  async findAll(): Promise<Array<UserModel> | null> {
    return this.prismaService.client.userModel.findMany({ where: {} });
  }
  async delete(id: number): Promise<UserModel | null> {
    return this.prismaService.client.userModel.delete({
      where: {
        id: id,
      },
    });
  }
  async update(
    id: number,
    firstName?: string,
    secondName?: string,
    roles?: string
  ): Promise<UserModel | null> {
    return this.prismaService.client.userModel.update({
      where: {
        id: id,
      },
      data: {
        firstName: firstName,
        secondName: secondName,
        roles: roles,
      },
    });
  }
  // add the following methods
  async addBalance(id: number, amount: number): Promise<UserModel | null> {
    return this.prismaService.client.userModel.update({
      where: {
        id: id,
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
  }
  async subtractBalance(id: number, amount: number): Promise<UserModel | null> {
    return this.prismaService.client.userModel.update({
      where: {
        id: id,
      },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });
  }
  // async addCard(id: number, card: string): Promise<UserModel | null> {
  //   return this.prismaService.client.userModel.update({
  //     where: {
  //       id: id,
  //     },
  //     data: {
  //       cards: {
  //         push: card,
  //       },
  //     },
  //   });
  // }
  // async removeCard(id: number, card: string): Promise<UserModel | null> {
  //   return this.prismaService.client.userModel.update({
  //     where: {
  //       id: id,
  //     },
  //     data: {
  //       cards: {
  //         pull: card,
  //       },
  //     },
  //   });
  // }
  async getSentTransactions(
    id: number
  ): Promise<Array<TransactionModel> | null> {
    return this.prismaService.client.userModel
      .findFirst({
        where: {
          id: id,
        },
      })
      .sentTransactions();
  }
  async getReceivedTransactions(
    id: number
  ): Promise<Array<TransactionModel> | null> {
    return this.prismaService.client.userModel
      .findFirst({
        where: {
          id: id,
        },
      })
      .receivedTransactions();
  }
}
