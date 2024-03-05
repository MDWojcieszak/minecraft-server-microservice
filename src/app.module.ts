import { Module } from '@nestjs/common';
import { MinecraftServerService } from './minecraft-server/minecraft-server.service';
import { MinecraftServerModule } from './minecraft-server/minecraft-server.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { SystemUsageModule } from './system-usage/system-usage.module';
import { CronJobsModule } from 'src/cron-jobs/cron-jobs.module';

@Module({
  imports: [
    MinecraftServerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    SystemUsageModule,
    CronJobsModule,
  ],
})
export class AppModule {}
