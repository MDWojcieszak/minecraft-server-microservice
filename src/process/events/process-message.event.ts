import { LogLevel } from 'src/common/enums';

export class ProcessMessageEvent {
  constructor(
    public readonly processId: string,
    public readonly message: string,
    public readonly level?: LogLevel,
  ) {}
}
