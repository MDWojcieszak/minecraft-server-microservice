import { IsObject } from 'class-validator';
import { CommandContextDto } from 'src/common/dto';

export class StopServerDto {
  @IsObject({ context: CommandContextDto })
  context: CommandContextDto;
}
