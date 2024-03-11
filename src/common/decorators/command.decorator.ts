import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { CommandType } from 'src/common/enums';

export type Command = {
  commandName: string;
  commandCategory: string;
  commandType: CommandType;
  commandParams?: Record<string, any>;
};

export const Command = (
  commandName: Command['commandName'],
  commandCategory: Command['commandCategory'],
  commandType: Command['commandType'],
) =>
  SetMetadata('command_metadata', {
    commandName,
    commandType,
    commandCategory,
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
