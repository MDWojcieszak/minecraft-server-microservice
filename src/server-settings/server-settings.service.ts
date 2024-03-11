import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MinecraftServerConfig, ServerCategory } from 'src/common/enums';

@Injectable()
export class ServerSettingsService {
  constructor(@Inject('HUB') private hubClient: ClientProxy) {}
  private config = {
    [ServerCategory.MINECRAFT_SERVER]: {
      [MinecraftServerConfig.MAX_MEMORY]: 1024,
      [MinecraftServerConfig.MIN_MEMORY]: 1024,
    },
  };
  listen() {}
}
