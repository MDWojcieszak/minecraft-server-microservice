import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CommandCollectorSerice } from 'src/command/command-collector.service';
import { ServerStatus } from 'src/common/enums';
import { RegisterServerCommandsEvent } from 'src/system-register/events';
import { RegisterServerEvent } from 'src/system-register/events/register-server.event';
import { SystemUsageService } from 'src/system-usage/system-usage.service';

@Injectable()
export class SystemRegisterService {
  constructor(
    private config: ConfigService,
    private commandCollector: CommandCollectorSerice,
    private systemUsage: SystemUsageService,
    private eventEmmiter: EventEmitter2,
    @Inject('HUB') private hubClient: ClientProxy,
  ) {}

  async handleRegistration() {
    try {
      const serverName = this.config.get<string>('SERVER_NAME');

      Logger.log('SERVER REGISTRATION');
      const diskCount = (await this.systemUsage.getDiskInfo()).length;
      const ipAddress = await this.systemUsage.getPublicIP();
      const cpu = await this.systemUsage.getCpuInfo();
      await firstValueFrom(
        this.hubClient.send(
          'register-server',
          new RegisterServerEvent(serverName, ipAddress, diskCount, cpu),
        ),
      );
      await this.handleCommandRegistration(serverName);
      this.eventEmmiter.emit('system.registered');
    } catch (e) {
      Logger.error('REGISTRATION FAILED');
    }
  }

  async handleCommandRegistration(serverName: string) {
    try {
      Logger.log('COMMANDS REGISTRATION');
      const commands = this.commandCollector.getAll();

      await firstValueFrom(
        this.hubClient.send(
          'register-commands',
          new RegisterServerCommandsEvent(serverName, commands),
        ),
      );
    } catch (e) {
      Logger.error('COMMAND_REGISTRATION_FAILED');
    }
  }

  async registerCommands() {}

  async onApplicationBootstrap() {
    this.handleRegistration();
  }
}
