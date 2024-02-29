import { Inject, Controller } from '@nestjs/common';
import { MinecraftServerService } from './minecraft-server.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { StartServerDto } from 'src/minecraft-server/dto/start-server.dto';

@Controller('minecraft-server')
export class MinecraftServerController {
  constructor(private minecrafService: MinecraftServerService) {}

  @EventPattern('start_server')
  startServer(data: StartServerDto) {
    this.minecrafService.startMinecraftServer(data);
  }

  @EventPattern('stop_server')
  stopServer() {
    this.minecrafService.stopMinecraftServer();
  }
}
