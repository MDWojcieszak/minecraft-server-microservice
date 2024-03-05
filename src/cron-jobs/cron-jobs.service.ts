import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleLoad() {
    try {
      const serverName = this.config.get<string>('SERVER_NAME');
      await this.handleLoadRaport(serverName);
      if (!this.isRegistered) {
        const registerRes = await this.handleRegistration(serverName);
        if (registerRes) this.isRegistered = true;
      }
    } catch (error) {
      console.error('Error executing cron job:', error);
    }
  }

  async handleLoadRaport(serverName: string) {
    if (!this.isRegistered) return;
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

  @Cron(CronExpression.EVERY_MINUTE)
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

  async handleRegistration(serverName: string) {
    Logger.log('SERVER REGISTRATION');
    const diskCount = (await this.systemUsage.getDiskInfo()).length;
    const ipAddress = await this.systemUsage.getPublicIP();
    const cpu = await this.systemUsage.getCpuInfo();
    return await firstValueFrom(
      this.hubClient.send('register-server', {
        name: serverName,
        ipAddress,
        diskCount,
        cpu,
      }),
    );
  }
}
