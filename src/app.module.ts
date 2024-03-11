import { Module } from '@nestjs/common';
import { MinecraftServerModule } from './minecraft-server/minecraft-server.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { SystemUsageModule } from './system-usage/system-usage.module';
import { CronJobsModule } from 'src/cron-jobs/cron-jobs.module';
import { SystemRegisterModule } from './system-register/system-register.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CommandModule } from 'src/command/command.module';
import { ServerSettingsModule } from './server-settings/server-settings.module';

@Module({
  imports: [
    MinecraftServerModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    SystemUsageModule,
    CronJobsModule,
    SystemRegisterModule,
    CommandModule,
    ServerSettingsModule,
  ],
})
export class AppModule {}
