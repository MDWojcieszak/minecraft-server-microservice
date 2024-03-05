import { Module } from '@nestjs/common';
import { CronJobsService } from './cron-jobs.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SystemUsageModule } from 'src/system-usage/system-usage.module';
import { HubConnectionModule } from 'src/hub-connection/hub-connection.module';
import { SystemUsageService } from 'src/system-usage/system-usage.service';

@Module({
  imports: [HubConnectionModule, ScheduleModule.forRoot()],
  providers: [CronJobsService, SystemUsageService],
  exports: [CronJobsService],
})
export class CronJobsModule {}
