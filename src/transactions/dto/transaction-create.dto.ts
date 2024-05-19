import { IsNumber, IsPositive } from "class-validator";
export class TransactionCreateDto {
  senderId: number;
  receiverId: number;
  @IsNumber({}, { message: "Not a number!" })
  @IsPositive({ message: "Not a positive number" })
  amount: number;
  status: string;
}
