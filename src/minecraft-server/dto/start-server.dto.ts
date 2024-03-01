import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class StartServerDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @Min(1024)
  @IsNotEmpty()
  maxMemory: number;

  @IsNumber()
  @Min(1024)
  @IsNotEmpty()
  minMemory: number;
}
