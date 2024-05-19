import { UserLoginDto } from "./dot/user-login.dto";
import { UserRegisterDto } from "./dot/user-register.dto";
import { UserModel } from "@prisma/client";

export interface IUserService {
  createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
  validateUser: (dto: UserLoginDto) => Promise<boolean>;
  findUser: (id: number) => Promise<UserModel | null>;
  getUserInfo: (email: string) => Promise<UserModel | null>;
  getUsers: () => Promise<Array<UserModel> | null>;
  deleteUser: (id: number) => Promise<UserModel | null>;
  updateUser: (
    id: number,
    firstName?: string,
    secondName?: string,
    roles?: string
  ) => Promise<UserModel | null>;
  addBalance: (id: number, amount: number) => Promise<UserModel | null>;
  subtractBalance: (id: number, amount: number) => Promise<UserModel | null>;
  // addCard: (id: number, card: string) => Promise<UserModel | null>;
  // removeCard: (id: number, card: string) => Promise<UserModel | null>;
}
