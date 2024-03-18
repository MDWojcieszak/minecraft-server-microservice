import { IsNotEmpty, IsString } from 'class-validator';

export class CommandContextDto {
  @IsString()
  @IsNotEmpty()
  serverId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
