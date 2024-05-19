export class Transaction {
  constructor(
    private readonly _senderId: number,
    private readonly _receiverId: number,
    private readonly _amount: number,
    private readonly _status: string
  ) {}

  get senderId(): number {
    return this._senderId;
  }
  get receiverId(): number {
    return this._receiverId;
  }
  get amount(): number {
    return this._amount;
  }
  get status(): string {
    return this._status;
  }
}
