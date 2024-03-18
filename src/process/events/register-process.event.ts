export class RegisterProcessEvent {
  constructor(
    public readonly categoryId: string,
    public readonly userId: string,
    public readonly name: string,
  ) {}
}
