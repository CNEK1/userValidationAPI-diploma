import { IsString, Length, IsIn } from "class-validator";

export class UserUpdateDto {
  @IsString({ message: "Type a correct name" })
  @Length(5, 20)
  firstName: string;
  @IsString({ message: "Type a correct name" })
  @Length(5, 20)
  secondName: string;
  @IsIn(["Admin", "User"], { message: 'Roles can only be "Admin" or "User"' })
  roles: string;
}
