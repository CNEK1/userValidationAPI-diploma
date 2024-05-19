import {
  IsEmail,
  IsString,
  Length,
  IsIn,
  IsPhoneNumber,
  IsNumber,
  isNumber,
} from "class-validator";

export class UserRegisterDto {
  @IsEmail({}, { message: "Wrong email" })
  email: string;
  @IsString({ message: "Type a correct password" })
  password: string;
  @IsString({ message: "Type a correct first name" })
  @Length(2, 20)
  firstName: string;
  @IsString({ message: "Type a correct last name" })
  @Length(2, 20)
  secondName: string;
  @IsPhoneNumber("US")
  @IsPhoneNumber("LT")
  @IsPhoneNumber("UA")
  number: string;
  @IsIn(["Admin", "User"], { message: 'Roles can only be "Admin" or "User"' })
  roles: string;
}
