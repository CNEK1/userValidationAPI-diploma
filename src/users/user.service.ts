import { inject, injectable } from "inversify";
import { UserLoginDto } from "./dot/user-login.dto";
import { UserRegisterDto } from "./dot/user-register.dto";
import { User } from "./user.entity";
import { IUserService } from "./user.service.interface";
import "reflect-metadata";
import { TYPES } from "../types";
import { IConfigInterface } from "../config/config.service.interface";
import { IUsersRepository } from "./users.interface.repository";
import { UserModel } from "@prisma/client";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigInterface,
    @inject(TYPES.UserRepository) private usersRepository: IUsersRepository
  ) {}

  async createUser({
    email,
    firstName,
    secondName,
    number,
    password,
    roles,
  }: UserRegisterDto): Promise<UserModel | null> {
    const newUser = new User(
      email,
      firstName,
      secondName,
      number,
      roles,
      password
    );
    console.log(newUser);
    const salt = this.configService.get("SALT");
    await newUser.setPassword(password, Number(salt));
    const existedUser = await this.usersRepository.find(email);
    if (existedUser) {
      return null;
    }
    return this.usersRepository.create(newUser);
  }
  async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
    const existedUser = await this.usersRepository.find(email);
    if (!existedUser) {
      return false;
    }
    const newUser = new User(
      existedUser.email,
      existedUser.firstName,
      existedUser.secondName,
      existedUser.number,
      existedUser.roles,
      existedUser.password
    );
    return newUser.comparePassword(password);
  }
  async findUser(id: number): Promise<UserModel | null> {
    return this.usersRepository.findOne(id);
  }
  async getUserInfo(email: string): Promise<UserModel | null> {
    return await this.usersRepository.find(email);
  }
  async getUsers(): Promise<Array<UserModel> | null> {
    return await this.usersRepository.findAll();
  }
  async deleteUser(id: number): Promise<UserModel | null> {
    return await this.usersRepository.delete(id);
  }
  async updateUser(
    id: number,
    firstName?: string,
    secondName?: string,
    roles?: string
  ): Promise<UserModel | null> {
    return await this.usersRepository.update(id, firstName, secondName, roles);
  }
  // add the following methods
  async addBalance(id: number, amount: number): Promise<UserModel | null> {
    return await this.usersRepository.addBalance(id, amount);
  }
  async subtractBalance(id: number, amount: number): Promise<UserModel | null> {
    return await this.usersRepository.subtractBalance(id, amount);
  }
}
