import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { SystemUsageService } from 'src/system-usage/system-usage.service';

@Injectable()
export class CronJobsService {
  constructor(
    @Inject('HUB') private hubClient: ClientProxy,
    private systemUsage: SystemUsageService,
    private config: ConfigService,
  ) {}
  private isRegistered = false;

  @OnEvent('system.registered')
  handleSystemRegistered() {
    this.isRegistered = true;
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleLoad() {
    try {
      const serverName = this.config.get<string>('SERVER_NAME');
      await this.handleLoadRaport(serverName);
    } catch (error) {
      console.error('Error executing cron job:', error);
    }
  }

  async handleLoadRaport(serverName: string) {
    if (!this.isRegistered) return;
    Logger.log('LOAD RAPORT');

    const systemLoad = await this.systemUsage.getSystemLoad();
    const uptime = await this.systemUsage.getSystemUptime();
    console.log(
      await firstValueFrom(
        this.hubClient.send('raport-server-usage', {
          cpu: systemLoad,
          uptime,
          name: serverName,
        }),
      ),
    );
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleMemory() {
    try {
      const serverName = this.config.get<string>('SERVER_NAME');
      if (!this.isRegistered) return;
      this.handleMemoryRaport(serverName);
    } catch (error) {
      console.error('Error executing cron job:', error);
    }
  }

  async handleMemoryRaport(serverName: string) {
    if (!this.isRegistered) return;
    Logger.log('MEMORY RAPORT');

    const memoryInfo = await this.systemUsage.getMemoryInfo();
    console.log(
      await firstValueFrom(
        this.hubClient.send('raport-server-usage', {
          memory: memoryInfo,
          name: serverName,
        }),
      ),
    );
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleDisk() {
    try {
      const serverName = this.config.get<string>('SERVER_NAME');
      if (!this.isRegistered) return;
      this.handleDiskRaport(serverName);
    } catch (error) {
      console.error('Error executing cron job:', error);
    }
  }

  async handleDiskRaport(serverName: string) {
    if (!this.isRegistered) return;
    Logger.log('DISK RAPORT');

    const diskInfo = await this.systemUsage.getDiskInfo();
    console.log(
      await firstValueFrom(
        this.hubClient.send('raport-server-usage', {
          disk: diskInfo,
          name: serverName,
        }),
      ),
    );
  }
}
