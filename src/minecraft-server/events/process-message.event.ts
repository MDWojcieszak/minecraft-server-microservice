export class ProcessMessageEvent {
  constructor(
    public readonly id: string,
    public readonly message: string,
  ) {}
}
