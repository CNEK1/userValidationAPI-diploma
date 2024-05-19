import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errors/http-error.class";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import "reflect-metadata";
import { IUserController } from "./user.inteface";
import { UserLoginDto } from "./dot/user-login.dto";
import { UserRegisterDto } from "./dot/user-register.dto";
import { ValidateMiddleware } from "../common/validate.middleware";
import { sign, verify } from "jsonwebtoken";
import { IConfigInterface } from "../config/config.service.interface";
import { IUserService } from "./user.service.interface";
import { GuardMiddleware } from "../common/guard.middleware";
import cookie from "cookie";
import { UserUpdateDto } from "./dot/user-update.dto";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { AddsubtractDto } from "./dot/addsubtract.dto";
import { ITransactionService } from "../transactions/transaction.service.interface";
import { IStripeService } from "../stripe/stripe.service.interface";

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @inject(TYPES.ILogger) private loggerSrc: ILogger,
    @inject(TYPES.UserService) private UserService: IUserService,
    @inject(TYPES.TransactionService)
    private transactionService: ITransactionService,
    @inject(TYPES.ConfigService) private configService: IConfigInterface,
    @inject(TYPES.StripeService) private stripeService: IStripeService
  ) {
    super(loggerSrc);
    this.bindRoutes([
      {
        path: "/registerByUser",
        method: "post",
        func: this.registerByUser,
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
    ]);
    this.bindRoutes([
      {
        path: "/configStripe",
        method: "get",
        func: this.configStripeFunc,
        middlewares: [],
      },
    ]);
    this.bindRoutes([
      {
        path: "/createPaymentIntent",
        method: "post",
        func: this.createPaymentIntentFunc,
        middlewares: [],
      },
    ]);
    this.bindRoutes([
      {
        path: "/registerByAdmin",
        method: "post",
        func: this.registerByAdmin,
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
    ]);
    this.bindRoutes([
      {
        path: "/login",
        method: "post",
        func: this.login,
        middlewares: [new ValidateMiddleware(UserLoginDto)],
      },
    ]);
    this.bindRoutes([
      {
        path: "/jwtFullUserInfo",
        method: "get",
        func: this.jwtFullUserInfo,
        middlewares: [],
      },
    ]);
    this.bindRoutes([
      {
        path: "/info",
        method: "get",
        func: this.info,
        middlewares: [new GuardMiddleware()],
      },
    ]);
    this.bindRoutes([
      { path: "/logout", method: "get", func: this.logout, middlewares: [] },
    ]);
    // this.bindRoutes([{ path: '/refresh', method: 'get', func: this.refresh, middlewares: [new RefreshMiddleware(this.configService.get('SECRET_REFRESH'))] }]);
    this.bindRoutes([
      { path: "/", method: "get", func: this.getAll, middlewares: [] },
    ]);
    this.bindRoutes([
      {
        path: "/delete/:id",
        method: "get",
        func: this.delete,
        middlewares: [],
      },
    ]);
    this.bindRoutes([
      {
        path: "/update/:id",
        method: "post",
        func: this.update,
        middlewares: [new ValidateMiddleware(UserUpdateDto)],
      },
    ]);
    this.bindRoutes([
      { path: "/:id", method: "get", func: this.find, middlewares: [] },
    ]);
    this.bindRoutes([
      {
        path: "/detail/:id",
        method: "get",
        func: this.findDetails,
        middlewares: [],
      },
    ]);
    this.bindRoutes([
      {
        path: "/addBalance",
        method: "post",
        func: this.addBalance,
        middlewares: [new ValidateMiddleware(AddsubtractDto)],
      },
    ]);
    this.bindRoutes([
      {
        path: "/subtractBalance",
        method: "post",
        func: this.subtractBalance,
        middlewares: [new ValidateMiddleware(AddsubtractDto)],
      },
    ]);
    this.bindRoutes([
      {
        path: "/getSentTransactions/:id",
        method: "get",
        func: this.getSentTransactions,
        middlewares: [],
      },
    ]);
    this.bindRoutes([
      {
        path: "/getReceivedTransactions/:id",
        method: "get",
        func: this.getReceivedTransactions,
        middlewares: [],
      },
    ]);
  }

  async login(
    req: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = await this.UserService.validateUser(req.body);
    if (!result) {
      return next(new HTTPError(401, "Wrong email", "login"));
    }
    const accessToken = await this.signAccessJWT(
      req.body.email,
      this.configService.get("SECRET_ACCESS")
    );
    // const refreshToken = await this.signRefreshJWT(req.body.email, this.configService.get('SECRET_REFRESH'));
    // res.setHeader(
    //     'Set-Cookie',
    //     cookie.serialize('refreshToken', refreshToken, {
    //         httpOnly: true,
    //         maxAge: 60 * 60
    //     })
    // );

    this.ok(res, { accessToken, msg: "Login Succeseful" });
  }

  async configStripeFunc(
    {}: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    this.ok(res, {
      publishableKey: this.configService.get("STRIPE_PUBLISHABLE_KEY"),
    });
  }
  async jwtFullUserInfo(
    req: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      verify(
        token,
        this.configService.get("SECRET_ACCESS"),
        async (err, decoded) => {
          if (err) {
            return next(new HTTPError(401, "Invalid token"));
          }

          if (decoded) {
            const user = decoded;
            const userEmail = user["email"] as string;
            const fullUserInfo = await this.UserService.getUserInfo(userEmail);
            this.ok(res, fullUserInfo);
          }
        }
      );
    } else {
      return next(
        new HTTPError(401, "Missing or invalid authorization header")
      );
    }
  }

  async createPaymentIntentFunc(
    { body }: Request<{}, {}>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    this.loggerSrc.log(body);
    if (body.amount * 100 < 5) {
      return next(new HTTPError(422, "Small Amount"));
    }
    const paymentIntent = await this.stripeService.createPaymentIntent(
      body.amount * 100,
      "usd"
    );
    if (!paymentIntent) {
      return next(new HTTPError(422, "Error In Create Payment Intent"));
    }
    this.ok(res, {
      clientSecret: paymentIntent.client_secret,
    });
  }

  async registerByUser(
    { body }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = await this.UserService.createUser({
      email: body.email,
      firstName: body.firstName,
      secondName: body.secondName,
      number: body.number,
      roles: "User",
      password: body.password,
    });
    console.log(body);
    if (!result) {
      return next(new HTTPError(422, "This User is already Exist"));
    }
    const accessToken = await this.signAccessJWT(
      result.email,
      this.configService.get("SECRET_ACCESS")
    );
    this.loggerSrc.log(body);
    this.ok(res, {
      accessToken: accessToken,
      msg: "Register Succeseful",
    });
  }
  async registerByAdmin(
    { body }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = await this.UserService.createUser({
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      secondName: body.secondName,
      number: body.number,
      roles: body.roles,
    });
    if (result) {
      this.loggerSrc.log(body);
      res.redirect("/");
    } else {
      return next(new HTTPError(422, "This User is already Exist"));
    }
  }

  async info(
    { user }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userInfo = await this.UserService.getUserInfo(user);
    this.ok(res, { email: userInfo?.email, id: userInfo?.id });
  }
  async logout(
    req: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("refreshToken", "", { httpOnly: true, maxAge: 0 })
    );
    res.sendStatus(200);
  }

  async getAll(
    req: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const users = await this.UserService.getUsers();
    const transactions = await this.transactionService.getTransactions();
    res.render("./pages/index", {
      users: users,
      transactions: transactions,
    });
  }
  async delete(
    req: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id: number = parseInt(req.params["id"]);
    const deletedUser = await this.UserService.deleteUser(id);
    if (deletedUser) {
      res.redirect("/");
    } else {
      return next(new HTTPError(422, "Some Error in deleting"));
    }
  }
  async update(
    req: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id: number = parseInt(req.params["id"]);
    try {
      const user = req.body;
      const updatedUser = await this.UserService.updateUser(
        id,
        user.firstName,
        user.secondName,
        user.roles
      );
      if (updatedUser) {
        res.redirect("/");
      } else {
        return next(new HTTPError(422, "Some Error in Updating"));
      }
    } catch (e: any) {
      this.ok(res, { err: e });
    }
  }
  async find(
    req: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id: number = parseInt(req.params["id"]);
    try {
      const user = await this.UserService.findUser(id);
      res.render("./pages/update", {
        users: user,
      });
    } catch (e: any) {
      this.ok(res, { err: e });
    }
  }
  async findDetails(
    req: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id: number = parseInt(req.params["id"]);
    try {
      const user = await this.UserService.findUser(id);
      res.render("./pages/details", {
        user: user,
      });
    } catch (e: any) {
      this.ok(res, { err: e });
    }
  }
  private signAccessJWT(email: string, secret: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      sign(
        {
          email,
          // iat: Math.floor(Date.now() / 1000)
          iat: 200,
        },
        secret,
        {
          algorithm: "HS256",
        },
        (err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token as string);
        }
      );
    });
  }

  async addBalance(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.body.id;
      const amount = req.body.amount;

      if (amount < 5) {
        return next(new HTTPError(404, "Small amount", "addBalance"));
      }
      const user = await this.UserService.addBalance(id, amount);
      if (!user) {
        return next(new HTTPError(404, "User not found", "addBalance"));
      }
      res.status(200).json(user);
    } catch (error: any) {
      return next(new HTTPError(500, error.message, "addBalance"));
    }
  }
  async subtractBalance(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.body.id;
      const amount = req.body.amount;
      const user = await this.UserService.subtractBalance(id, amount);

      if (amount < 5) {
        return next(new HTTPError(404, "Small amount", "subtractBalance"));
      }
      if (!user) {
        return next(new HTTPError(404, "User not found", "subtractBalance"));
      }
      res.status(200).json(user);
    } catch (error: any) {
      return next(new HTTPError(500, error.message, "subtractBalance"));
    }
  }

  async getSentTransactions(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const transactions = []; //await this.UserService.getSentTransactions(id);
      if (!transactions) {
        return next(
          new HTTPError(404, "Transactions not found", "getSentTransactions")
        );
      }
      res.status(200).json(transactions);
    } catch (error: any) {
      return next(new HTTPError(500, error.message, "getSentTransactions"));
    }
  }
  async getReceivedTransactions(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const transactions = []; //await this.UserService.getReceivedTransactions(id);
      if (!transactions) {
        return next(
          new HTTPError(
            404,
            "Transactions not found",
            "getReceivedTransactions"
          )
        );
      }
      res.status(200).json(transactions);
    } catch (error: any) {
      return next(new HTTPError(500, error.message, "getReceivedTransactions"));
    }
  }

  private signRefreshJWT(email: string, secret: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      sign(
        {
          email,
          // iat: Math.floor(Date.now() / 1000)
          iat: 60 * 60,
        },
        secret,
        {
          algorithm: "HS256",
        },
        (err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token as string);
        }
      );
    });
  }
}
