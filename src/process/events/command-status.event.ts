import { CommandStatus } from 'src/common/enums';

export class CommandStatusEvent {
  constructor(
    public readonly serverName: string,
    public readonly commandName: string,
    public readonly category: string,
    public readonly runningProgress?: number,
    public readonly status?: CommandStatus,
  ) {}
}
