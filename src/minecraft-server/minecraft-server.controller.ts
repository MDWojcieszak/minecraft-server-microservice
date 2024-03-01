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

@Controller('minecraft-server')
export class MinecraftServerController {
  constructor(private minecrafService: MinecraftServerService) {}

  @MessagePattern('start_server')
  async startServer(dto: StartServerDto) {
    const errors = await validate(dto);
    if (errors.length > 0) {
      return new BadRequestException(errors);
    }
    return this.minecrafService.startMinecraftServer(dto);
  }

  @MessagePattern('stop_server')
  stopServer() {
    return this.minecrafService.stopMinecraftServer();
  }

  @EventPattern('send_command')
  async sendCommand(dto: SendCommandDto) {
    const errors = await validate(dto);
    if (errors.length > 0) {
      return new BadRequestException(errors);
    }
    this.minecrafService.sendCommandToMinecraftServer(dto);
  }
}
