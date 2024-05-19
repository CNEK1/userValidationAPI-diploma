import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";

import { TYPES } from "./types";
import { ConfigService } from "./config/config.service";
import { IConfigInterface } from "./config/config.service.interface";
import { PrismaService } from "./database/prisma.service";
import { IPrismaService } from "./database/prisma.service.interface";
import { ExceptionFilter } from "./errors/exception.filter";
import { IExceptionFilter } from "./errors/exception.filter.interface";
import { ILogger } from "./logger/logger.interface";
import { LoggerService } from "./logger/logger.service";
import { TransactionService } from "./transactions/transaction.service";
import { ITransactionService } from "./transactions/transaction.service.interface";
import { UserController } from "./users/user.controller";
import { IUserController } from "./users/user.inteface";
import { UserService } from "./users/user.service";
import { IUserService } from "./users/user.service.interface";
import { IUsersRepository } from "./users/users.interface.repository";
import { UsersRepository } from "./users/users.repository";
import { TransactionController } from "./transactions/transaction.controller";
import { ITransactionController } from "./transactions/transaction.interface";
import { TransactionsRepository } from "./transactions/transactions.repository";
import { ITransactionsRepository } from "./transactions/transactions.repository,interface";
import { IStripeService } from "./stripe/stripe.service.interface";
import { StripeService } from "./stripe/stripe.service";

export interface IBootstrapReturnType {
  appContainer: Container;
  app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
  bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
  bind<IConfigInterface>(TYPES.ConfigService)
    .to(ConfigService)
    .inSingletonScope();
  bind<IPrismaService>(TYPES.PrismaService)
    .to(PrismaService)
    .inSingletonScope();
  bind<IStripeService>(TYPES.StripeService)
    .to(StripeService)
    .inSingletonScope();
  bind<IUsersRepository>(TYPES.UserRepository)
    .to(UsersRepository)
    .inSingletonScope();
  bind<IUserController>(TYPES.UserController).to(UserController);
  bind<IUserService>(TYPES.UserService).to(UserService);

  bind<ITransactionsRepository>(TYPES.TransactionRepository)
    .to(TransactionsRepository)
    .inSingletonScope();
  bind<ITransactionController>(TYPES.TransactionController).to(
    TransactionController
  );
  bind<ITransactionService>(TYPES.TransactionService).to(TransactionService);

  bind<App>(TYPES.Application).to(App).inSingletonScope();
});

const bootstrap = (): IBootstrapReturnType => {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(TYPES.Application);
  app.init();
  return { appContainer, app };
};

export const { app, appContainer } = bootstrap();
