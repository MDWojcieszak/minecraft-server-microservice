import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ServerStatus } from 'src/common/enums';
import { SystemUsageService } from 'src/system-usage/system-usage.service';

@Injectable()
export class SystemRegisterService {
  constructor(
    private config: ConfigService,
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
        this.hubClient.send('register-server', {
          name: serverName,
          ipAddress,
          diskCount,
          cpu,
        }),
      );
      this.eventEmmiter.emit('system.registered');
    } catch (e) {
      Logger.error('REGISTRATION FAILED');
    }
  }

  async registerCommands() {}

  async onApplicationBootstrap() {
    this.handleRegistration();
  }
}
