import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ServerCategory } from 'src/common/enums';

export class SetSettingDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsEnum(ServerCategory)
  category: ServerCategory;

  @IsString()
  @IsNotEmpty()
  serverName: string;
}
