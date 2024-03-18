export class ProcessMessageEvent {
  constructor(
    public readonly processId: string,
    public readonly message: string,
  ) {}
}
