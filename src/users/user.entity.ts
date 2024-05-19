import { compare, hash } from "bcryptjs";

export class User {
  private _password: string;
  constructor(
    private readonly _email: string,
    private readonly _firstName: string,
    private readonly _secondName: string,
    private readonly _number: string,
    private readonly _roles: string,
    passwordHash?: string
  ) {
    if (passwordHash) {
      this._password = passwordHash;
    }
  }

  get email(): string {
    return this._email;
  }
  get firstName(): string {
    return this._firstName;
  }
  get secondName(): string {
    return this._secondName;
  }
  get number(): string {
    return this._number;
  }
  get password(): string {
    return this._password;
  }
  get roles(): string {
    return this._roles;
  }

  public async setPassword(pass: string, salt: number): Promise<void> {
    this._password = await hash(pass, salt);
  }

  public async comparePassword(pass: string): Promise<boolean> {
    return compare(pass, this._password);
  }
}
