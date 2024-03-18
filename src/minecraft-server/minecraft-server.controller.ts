import { Inject, Controller, BadRequestException } from '@nestjs/common';
import { MinecraftServerService } from './minecraft-server.service';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
} from '@nestjs/microservices';
import { StartServerDto } from 'src/minecraft-server/dto/start-server.dto';
import { SendCommandDto } from 'src/minecraft-server/dto';
import { validate } from 'class-validator';
import { OnEvent } from '@nestjs/event-emitter';
import { Command } from 'src/common/decorators';
import { CommandType, ServerCategory } from 'src/common/enums';
import { StopServerDto } from 'src/minecraft-server/dto/stop-server.dto';

@Controller('minecraft-server')
export class MinecraftServerController {
  constructor(private minecrafService: MinecraftServerService) {}

  @Command('server.start', ServerCategory.MINECRAFT_SERVER, CommandType.MESSAGE)
  @MessagePattern('server.start')
  async startServer(dto: StartServerDto) {
    return this.minecrafService.handleStartServer(dto);
  }

  @Command('server.stop', ServerCategory.MINECRAFT_SERVER, CommandType.MESSAGE)
  @MessagePattern('server.stop')
  stopServer(dto: StopServerDto) {
    return this.minecrafService.handleStopServer(dto);
  }

  @Command('server.kill', ServerCategory.MINECRAFT_SERVER, CommandType.EVENT)
  @MessagePattern('server.kill')
  killServer() {
    return this.minecrafService.handleKillServer();
  }

  // @Command('send_command', ServerCategory.MINECRAFT_SERVER, CommandType.EVENT)
  // @EventPattern('send_command')
  // async sendCommand(dto: any) {
  //   console.log('xDD');
  //   // const errors = await validate(dto);
  //   // if (errors.length > 0) {
  //   //   return new BadRequestException(errors);
  //   // }
  //   // this.minecrafService.sendCommandToMinecraftServer(dto);
  // }
}
