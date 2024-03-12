import { Command } from 'src/common/decorators';

export class RegisterServerCommandsEvent {
  constructor(
    public readonly serverName: string,
    public readonly commands: Command[],
  ) {}
}
