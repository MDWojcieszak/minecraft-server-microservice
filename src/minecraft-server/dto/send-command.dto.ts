import { IsNotEmpty, IsString } from 'class-validator';

export class SendCommandDto {
  @IsString()
  @IsNotEmpty()
  command: string;
}
