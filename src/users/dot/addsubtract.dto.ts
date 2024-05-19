import { IsNumber, IsPositive } from "class-validator";

export class AddsubtractDto {
  @IsNumber({}, { message: "Not a number!" })
  @IsPositive({ message: "Not a positive number" })
  amount: number;
}
