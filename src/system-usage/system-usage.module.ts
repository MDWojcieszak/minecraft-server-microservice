import { Module } from '@nestjs/common';
import { SystemUsageService } from './system-usage.service';
import { SystemUsageController } from './system-usage.controller';

@Module({
  providers: [SystemUsageService],
  controllers: [SystemUsageController],
  exports: [SystemUsageService],
})
export class SystemUsageModule {}
