import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { CommandType } from 'src/common/enums';

export type Command = {
  commandName: string;
  category: string;
  commandType: CommandType;
  commandParams?: Record<string, any>;
};

export const Command = (
  commandName: Command['commandName'],
  category: Command['category'],
  commandType: Command['commandType'],
) =>
  SetMetadata('command_metadata', {
    commandName,
    commandType,
    category,
  });

export const CommandParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const commandMetadata = Reflect.getMetadata(
      'command_metadata',
      ctx.getHandler(),
    );
    return commandMetadata;
  },
);
